import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Register</h1>
      
      <form onSubmit={handleSubmit}>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
        />

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
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;