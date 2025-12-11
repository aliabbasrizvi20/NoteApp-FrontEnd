import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Logins.css";
import axiosClient from "../api/axiosClient";
export default function Login() {
  const nav = useNavigate();
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [resData, setResData]=useState("");
  const onHandleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axiosClient.post("/auth/login", userForm);
    
    setResData(res.data.message);

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/"); 
    }
  } catch (err) {
  
    if (err.response && err.response.data && err.response.data.message) {
      setResData(err.response.data.message);
    } else {
      setResData("Something went wrong!");
    }
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
              required
            />
            <br></br>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={onHandleChange}
              required
            />
            <br></br>
            <button>LogIn</button>
          </div>
          <p>
            Haven't created an account? <Link to="/signUp">SignUp</Link>
          </p>
            <h4 id="log-res">{resData}</h4>
        </form>
      </div>
    </div>
  );
}
