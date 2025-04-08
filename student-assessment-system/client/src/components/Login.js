import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Add a ref to track mounted state
  const isMountedRef = React.useRef(true);
  
  // Set up the cleanup
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false; // Update ref when component unmounts
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { username, password });

      if (isMountedRef.current) { // Check ref instead of local variable
        // Extract token and user data
        const { token, user } = res.data;
        
        console.log("Login successful, token and user data:", token, user);

        // Store token securely in sessionStorage (or localStorage based on preference)
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify({ 
          _id: user._id, 
          username: user.username, // ✅ important
          role: user.role 
        }));
        
        // Redirect based on role
        const roleRoutes = {
          teacher: "/teacher",
          student: "/student",
          admin: "/admin-dashboard",
        };

        const redirectPath = roleRoutes[user.role] || "/dashboard";
        console.log("Redirecting to:", redirectPath);
        navigate(redirectPath);
      }
    } catch (err) {
      if (isMountedRef.current) { // Check ref
        const errorMessage = err.response?.status === 401 
          ? "Invalid credentials. Please check your username and password."
          : err.response?.data?.message || "Login failed. Please try again.";

        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) { // Check ref
        setLoading(false);
      }
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="btn btn-primary">
          Register Here
        </Link>
      </p>
    </div>
  );
};

export default Login;
