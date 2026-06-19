import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser }
from "../services/authApi";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;