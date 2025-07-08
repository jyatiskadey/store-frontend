import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "somu" && password === "Admin1#") {
      sessionStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-900"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1671427478482-2968e71a6311?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
          🔐 Store Login
        </h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-white mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="storekeeper"
            className="w-full px-4 py-2 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition border border-gray-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="password"
            className="w-full px-4 py-2 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 transition border border-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-300"
        >
          Login
        </button>

        <p className="mt-4 text-xs text-white text-center">
          Hint: storekeeper / 123456
        </p>
      </form>
    </div>
  );
};

export default Login;
