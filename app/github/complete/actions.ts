export const getAccessToken = async (code: string) => {
  // code를 이용해 access token을 받아옴
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  // access token을 이용해 user profile을 받아옴.
  // user profile에는 github id, avatar url, login 정보가 있음
  const {error, access_token} = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  return access_token;
};

export const getGithubProfile = async (access_token: string) => {
  // github id를 이용해 user를 찾음
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  // user가 존재하면 session에 user id를 저장하고 profile 페이지로 redirect (이후 email/pwd 방식 로그인과 동일)
  return await userProfileResponse.json();
};

export const getGithubEmail = async (access_token: string) => {
  // email 가져와보기
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const emails = await userEmailResponse.json();
  return emails.find((email: {primary: boolean}) => email.primary)?.email;
};
