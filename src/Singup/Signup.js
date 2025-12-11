import { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const nav = useNavigate();

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
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        formData
      );
      // console.log(res);
      alert(res.data.message);
      if (res.data.success) {
        nav("/login");
      }
    } catch (err) {
      alert("Error");
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
              />
              <br></br>
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
              <button>Signup</button>
            </div>
            <p>
              Already registered? <Link to="/login">LogIn</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
