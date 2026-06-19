import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({...form,[e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user",
        JSON.stringify(
          response.data.user
        )
      );       
      navigate("/dashboard");
    } 
    catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="terminal-window auth-card">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-amber"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="terminal-path">~/register</span>
        </div>

        <div className="terminal-body">
          <h1 className="auth-title">
            <span className="prompt">&gt;</span> Register
          </h1>

          <form onSubmit={handleSubmit} className="auth-form">

            <label className="field-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              name="username"
              placeholder="yourname"
              onChange={handleChange}
            />

            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
            />

            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
              Register
            </button>

          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;