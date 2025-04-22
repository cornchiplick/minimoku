interface LoginModalProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void; // 로그인 핸들러
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>; // 로그인 모달 상태 변경 핸들러
}

const LoginModal = ({handleLogin, setShowLoginModal}: LoginModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">로그인</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">이메일</label>
            <input
              type="email"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">비밀번호</label>
            <input
              type="password"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none">
              로그인
            </button>
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="text-gray-500 hover:text-gray-700">
              취소
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p>
            계정이 없으신가요?{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
