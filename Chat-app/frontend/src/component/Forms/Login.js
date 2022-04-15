import React, { useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {ChatState} from "../../Context/ChatProvider";

function Login(props) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { token ,setToken } = ChatState();

  const handlePasswordShowClick = (e) => {
    setShow(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
      toast.warning("Fill all the details", {
        position: "top-center",
      });
      setLoading(false);
      return;
    }

    const loginCredential = {
      username,
      password,
    };

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/login",
        loginCredential,
        config
      );
      toast.success("login successful", {
        position: "top-center",
      });
      const { token } = data;
      localStorage.setItem("token", token);
      setToken(token)

     

      //localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast.error("Error while registration", {
        position: "top-center",
      });
      setLoading(false);
    }
  };
  return (
    <div className="main">
      <div className=" header">
        <h4 className="text-white">Please login here</h4>
      </div>

      <div className="login">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              User name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              id="exampleInputText"
              aria-describedby="textHelp"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type={show ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              id="exampleInputPassword1"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              onClick={handlePasswordShowClick}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Show password
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? <h6>Loading... </h6> : <h6>Submit</h6>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
