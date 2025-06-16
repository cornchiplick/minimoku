import {URL} from "@/constants/url";
import {redirect} from "next/navigation";
import {NextRequest} from "next/server";
import {getAccessToken, getGithubProfile} from "./actions";

export async function GET(request: NextRequest) {
  // github로부터 redirect된 url에는 code라는 query parameter가 존재
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    // return notFound();
    return new Response(null, {
      status: 400,
    });
  }
  const access_token = await getAccessToken(code);

  // access token을 이용해 user email을 받아옴.
  // const userEmail = await getGithubEmail(access_token);
  // console.log("github Email : ", userEmail);

  // access token을 이용해 user profile을 받아옴.
  // const {id, avatar_url, login} = await getGithubProfile(access_token);
  const data = await getGithubProfile(access_token);
  console.log("github Profile : ", data);

  // const user = await db.user.findUnique({
  //   where: {
  //     github_id: id + "",
  //   },
  //   select: {
  //     id: true,
  //   },
  // });
  // if (user) {
  //   await sessionLogin(user.id);
  //   redirect("/profile");
  // }
  // const newUser = await db.user.create({
  //   data: {
  //     // 주의! github 로그인을 통해 만들어지는 user의 username 과 email/pwd 방식으로 만들어지는 user의 username이 겹칠 수 있는 문제의 소지 있음
  //     username: login,

  //     github_id: id + "",
  //     avatar: avatar_url,
  //   },
  //   select: {
  //     id: true,
  //   },
  // });
  // await sessionLogin(newUser.id);

  // ./layout.tsx 에 지금 로그인 상태임을 알리는 동작 하기. 그 이후 redirect
  redirect(URL.HOME);
}
