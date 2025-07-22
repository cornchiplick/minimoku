"use client";

import {useSession} from "next-auth/react";
import Image from "next/image";

const UserInfo = () => {
  const {data: session, status} = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div
        style={{
          position: "relative",
          padding: "15px",
          backgroundColor: "#e6ffe6",
          borderRadius: "8px",
          border: "1px solid #b3ffb3",
        }}>
        <p style={{fontWeight: "bold", color: "#28a745", marginBottom: "10px"}}>로그인됨!</p>
        <p>이름: {session.user?.name}</p>
        <p>이메일: {session.user?.email}</p>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="User Avatar"
            width={50}
            height={50}
            // fill
            style={{width: "50px", height: "50px", borderRadius: "50%", marginTop: "10px"}}
          />
        )}
        <p style={{marginTop: "10px", fontSize: "0.9em", color: "#555"}}>
          (이 정보는 클라이언트 컴포넌트에서 `useSession` 훅으로 가져왔습니다.)
        </p>
      </div>
    );
  }

  return (
    <p
      style={{
        padding: "15px",
        backgroundColor: "#ffe6e6",
        borderRadius: "8px",
        border: "1px solid #ffb3b3",
        color: "#dc3545",
      }}>
      로그아웃되었습니다.
      <p style={{fontSize: "0.9em", color: "#555", marginTop: "5px"}}>
        (클라이언트 컴포넌트에서 세션이 없습니다.)
      </p>
    </p>
  );
};

export default UserInfo;
