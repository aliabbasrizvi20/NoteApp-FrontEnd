import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Logins.css";
export default function Login() {
  const nav = useNavigate();
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const onHandleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        userForm
      );
      alert(res.data.message);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        nav("/notethat");
      }
    } catch (err) {
      alert("Invalid Creds");
    }
  };
  return (
    <div className="login-whole-container">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="input-fields-login">
            <h3>LogIn</h3>
            <input
              name="email"
              placeholder="Enter your email"
              onChange={onHandleChange}
            />
            <br></br>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={onHandleChange}
            />
            <br></br>
            <button>LogIn</button>
          </div>
          <p>
            Haven't created an account? <Link to="/signUp">SignUp</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
