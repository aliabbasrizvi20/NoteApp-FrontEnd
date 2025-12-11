import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function SignUp() {
  const nav = useNavigate();
  const [resMessage, setResMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onHandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/auth/register", formData);
      setResMessage(res.data.message);

      if (res.data.success) {
        setTimeout(() => nav("/login"), 1000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setResMessage(err.response.data.message);
      } else {
        setResMessage("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <>
      <div className="whole-container">
        <form onSubmit={handleSubmit}>
          <div className="signup-field">
            <div className="heading">
              <h3>Register</h3>
            </div>
            <div className="fields">
              <input
                name="name"
                placeholder="Enter your name"
                onChange={onHandleChange}
                required
              />
              <br></br>
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
              <button>Signup</button>
            </div>
            <p>
              Already registered? <Link to="/login">LogIn</Link>
            </p>
            <h6 id="signup-res">{resMessage}</h6>
          </div>
        </form>
      </div>
    </>
  );
}
