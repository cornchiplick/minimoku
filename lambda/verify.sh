#!/usr/bin/env bash
# 배포 후 검증 — 배포 시각 이후 새로 생긴 실행 환경(로그 스트림)의 첫 실행 로그에서 오류를 찾는다.
# 스케줄이 잦은 함수(telegram-todo-notifier, 매분)에만 의미가 있다. guest-reset 은 하루 1회라 다음날 로그를 보는 수밖에 없다.
#
#   bash ../verify.sh <함수명> <배포 시각 epoch ms> [최대 대기 초=150]
set -euo pipefail

FUNCTION_NAME="${1:?사용법: verify.sh <함수명> <배포 시각 epoch ms> [대기 초]}"
SINCE_MS="${2:?사용법: verify.sh <함수명> <배포 시각 epoch ms> [대기 초]}"
WAIT_SEC="${3:-150}"
REGION="${AWS_REGION:-ap-northeast-2}"
LOG_GROUP="/aws/lambda/$FUNCTION_NAME"
if [ -z "${CI:-}" ] && [ -z "${AWS_PROFILE:-}" ]; then export AWS_PROFILE=minimoku; fi

log() { printf '[verify:%s] %s\n' "$FUNCTION_NAME" "$*"; }

DEADLINE=$(( $(date +%s) + WAIT_SEC ))
while [ "$(date +%s)" -lt "$DEADLINE" ]; do
  # 배포 이후 생성됐고 이벤트가 하나라도 있는 스트림 = 새 코드로 뜬 실행 환경
  STREAM=$(aws logs describe-log-streams --region "$REGION" --log-group-name "$LOG_GROUP" \
    --order-by LastEventTime --descending --no-paginate --limit 5 \
    --query "logStreams[?creationTime > \`$SINCE_MS\` && lastEventTimestamp != null] | [0].logStreamName" --output text 2>/dev/null || true)
  if [ -n "$STREAM" ] && [ "$STREAM" != "None" ]; then
    MESSAGES=$(aws logs get-log-events --region "$REGION" --log-group-name "$LOG_GROUP" --log-stream-name "$STREAM" \
      --start-from-head --query 'events[].message' --output text)
    log "새 실행 환경 확인: $STREAM"
    grep -E 'INIT_START|START RequestId|REPORT|ERROR|Runtime\.|timed out' <<< "$MESSAGES" | head -8 | sed 's/^/  /' || true
    if grep -qE 'ERROR|Runtime\.|Task timed out|Unhandled' <<< "$MESSAGES"; then
      log "✖ 새 코드 실행에서 오류 발견 — npm run rollback 검토"; exit 1
    fi
    log "✔ 새 코드 정상 실행 (오류 없음)"; exit 0
  fi
  sleep 15
done
log "⚠ ${WAIT_SEC}초 안에 새 실행 환경이 뜨지 않음 — 스케줄/트리거 상태를 확인할 것"; exit 1
