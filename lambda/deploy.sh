#!/usr/bin/env bash
# Lambda 배포 공용 스크립트 — 각 lambda 디렉터리의 `npm run deploy` / `npm run upload` / `npm run rollback` 이 호출한다.
#
#   bash ../deploy.sh <함수명> <zip 파일>
#
# 순서: 사전 검사(크기·핸들러·Prisma 엔진) → 현재 배포 코드 백업(.previous.zip) → 업로드 → 반영 대기 → 무결성 확인
# 검사에서 하나라도 실패하면 업로드하지 않는다. 업로드는 update-function-code 한 번이라 중간 상태가 없다.
set -euo pipefail

FUNCTION_NAME="${1:?사용법: deploy.sh <함수명> <zip 파일>}"
ZIP="${2:?사용법: deploy.sh <함수명> <zip 파일>}"
REGION="${AWS_REGION:-ap-northeast-2}"

# 로컬에서는 minimoku 프로필을 기본으로 쓰고, CI(GitHub Actions) 에서는 OIDC 로 받은 자격증명을 그대로 쓴다
if [ -z "${CI:-}" ] && [ -z "${AWS_PROFILE:-}" ]; then
  export AWS_PROFILE=minimoku
fi

# Lambda 공식 한도 (docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)
MAX_ZIP_MB=50        # API/콘솔 직접 업로드 상한 — 초과 시 S3 경유 필요
MAX_UNZIPPED_MB=250  # 압축 해제 상한 (레이어 포함) — 초과 시 Layer 분리 또는 컨테이너 이미지
WARN_ZIP_MB=45       # 여기부터 경고: 한도 임박, 정리(prune) 검토

log()  { printf '[deploy:%s] %s\n' "$FUNCTION_NAME" "$*"; }
fail() { printf '[deploy:%s] ✖ %s\n' "$FUNCTION_NAME" "$*" >&2; exit 1; }

# ── 1. zip 존재·크기 ─────────────────────────────────────────────────────────
[ -f "$ZIP" ] || fail "zip 파일이 없습니다: $ZIP (먼저 npm run package)"
ZIP_BYTES=$(wc -c < "$ZIP" | tr -d ' ')
ZIP_MB=$(awk "BEGIN{printf \"%.1f\", $ZIP_BYTES/1048576}")
UNZ_BYTES=$(unzip -l "$ZIP" | tail -1 | awk '{print $1}')
# zip 항목 목록은 한 번만 읽어 둔다. `unzip | grep -q` 는 pipefail 아래에서 SIGPIPE 로 오판할 수 있어 here-string 으로 검사한다
ZIP_LIST=$(unzip -Z1 "$ZIP")
UNZ_MB=$(awk "BEGIN{printf \"%.1f\", $UNZ_BYTES/1048576}")
log "zip ${ZIP_MB} MB / 압축 해제 ${UNZ_MB} MB"
awk "BEGIN{exit !($ZIP_BYTES > $MAX_ZIP_MB*1048576)}" && \
  fail "zip 이 ${MAX_ZIP_MB} MB 를 넘습니다 (${ZIP_MB} MB). 직접 업로드 불가 — CLAUDE.md '배포 절차 › 크기 초과 시' 참고"
awk "BEGIN{exit !($UNZ_BYTES > $MAX_UNZIPPED_MB*1048576)}" && \
  fail "압축 해제 크기가 ${MAX_UNZIPPED_MB} MB 를 넘습니다 (${UNZ_MB} MB). Lambda 하드 리밋 — Layer 분리 또는 컨테이너 이미지 필요"
awk "BEGIN{exit !($ZIP_BYTES > $WARN_ZIP_MB*1048576)}" && \
  log "⚠ zip 이 ${WARN_ZIP_MB} MB 를 넘었습니다. 50 MB 한도 임박 — prune 대상 점검 권장"

# ── 2. 핸들러 파일이 zip 안 올바른 경로에 있는지 (함수 설정의 Handler 에서 유도) ──
HANDLER=$(aws lambda get-function-configuration --region "$REGION" --function-name "$FUNCTION_NAME" --query Handler --output text)
HANDLER_FILE="${HANDLER%.*}.js"   # 예: dist/index.handler → dist/index.js
grep -qx "$HANDLER_FILE" <<< "$ZIP_LIST" || \
  fail "zip 안에 핸들러 파일 '$HANDLER_FILE' 이 없습니다 (함수 Handler 설정: $HANDLER). zip 구조가 어긋났습니다"
log "핸들러 확인: $HANDLER → $HANDLER_FILE"

# ── 3. Prisma 엔진: 리눅스(OpenSSL 3) 엔진은 필수, 타 플랫폼 엔진은 용량 낭비 ──
grep -q 'libquery_engine-rhel-openssl-3.0.x' <<< "$ZIP_LIST" || \
  fail "rhel-openssl-3.0.x Prisma 엔진이 없습니다. Node 22 Lambda 에서 실행 불가 — schema.prisma binaryTargets 와 prune-engines 확인"
EXTRA=$(grep -cE 'engine-(darwin|windows|debian)|rhel-openssl-1\.0\.x' <<< "$ZIP_LIST" || true)
[ "$EXTRA" = "0" ] || log "⚠ 불필요한 Prisma 엔진 ${EXTRA}개 포함 (darwin/windows/debian/1.0.x) — prune-engines 확인"

# ── 4. 현재 배포 코드 백업 (롤백용, gitignore 대상) ──────────────────────────
PREV=".previous.zip"
if [ "$ZIP" != "$PREV" ]; then
  CUR_URL=$(aws lambda get-function --region "$REGION" --function-name "$FUNCTION_NAME" --query Code.Location --output text)
  curl -sf -o "$PREV" "$CUR_URL" && log "현재 배포 코드를 $PREV 로 백업 (롤백: npm run rollback)" || log "⚠ 백업 실패 — 계속 진행"
fi

# ── 5. 업로드 → 반영 대기 → 무결성 확인 ─────────────────────────────────────
LOCAL_SHA=$(openssl dgst -sha256 -binary "$ZIP" | base64)
log "업로드 중..."
aws lambda update-function-code --region "$REGION" --function-name "$FUNCTION_NAME" --zip-file "fileb://$ZIP" --no-cli-pager > /dev/null
aws lambda wait function-updated --region "$REGION" --function-name "$FUNCTION_NAME"
read -r REMOTE_SHA STATUS LAST_MOD <<< "$(aws lambda get-function-configuration --region "$REGION" --function-name "$FUNCTION_NAME" \
  --query '[CodeSha256, LastUpdateStatus, LastModified]' --output text)"
[ "$STATUS" = "Successful" ] || fail "반영 실패: LastUpdateStatus=$STATUS"
[ "$LOCAL_SHA" = "$REMOTE_SHA" ] || fail "무결성 불일치: 로컬 SHA256 과 Lambda CodeSha256 이 다릅니다"
log "✔ 배포 완료 — CodeSha256 일치, LastModified=$LAST_MOD"
