import React from "react";

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
