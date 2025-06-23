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

  // access token을 이용해 user profile을 받아옴.
  const {id, avatar_url, login} = await getGithubProfile(access_token);
  const data = await getGithubProfile(access_token);
  console.log("github Profile : ", data, avatar_url, login);

  // const user = await db.user.findUnique({
  //   where: {
  //     provider_provider_id: {
  //       provider: 'github',
  //       provider_id: id + ""
  //     },
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
  //     username: login,
  //     provider: "github",
  //     provider_id: id + "",
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
