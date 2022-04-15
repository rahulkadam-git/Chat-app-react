import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ChatLoading from "../Loading/ChatLoading";

function Register(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile_pic, setProfilePic] = useState("");
  const [show, setShow] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const history = useHistory();

  const handlePasswordShowClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  const handleConfirmPasswordShowClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error("Please select a picture", {
        position: "top-center",
      });
      return;
    }
    if (pics.type === "type/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat-app");
      data.append("cloud_name", "dkh3nvhkt");
      fetch("https://api.cloudinary.com/v1_1/dkh3nvhkt/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString());
         
          setPicLoading(false);
        })
        .catch((err) => {
          
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an Image!", {
        position: "top-center",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (
      !name ||
      !surname ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.warning("Fill all the details", {
        position: "top-center",
      });
    }
    if (password !== confirmPassword) {
      toast.warning("Check password again", {
        position: "top-center",
      });
    }

    const newUser = {
      name,
      surname,
      email,
      username,
      password,
      profile_pic,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/register",
        newUser
      );
      // const {token} = data;
      //     localStorage.setItem("token", token);
      setPicLoading(false);
      if (data) {
        history.push("/");
      }

      toast.success("Registration successful", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Error while registration", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="main">
      <div className="header">
        <h4 className="text-white">Please register here</h4>
      </div>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="fullname">
              <div className="name mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="name"
                  className="form-control"
                  placeholder="Name"
                  id="username"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="surname mb-3">
                <label htmlFor="surname" className="form-label">
                  Surname
                </label>
                <input
                  type="name"
                  className="form-control"
                  placeholder="Surname"
                  id="username"
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="name"
                className="form-control"
                placeholder="Username"
                id="username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <div className="password-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                id="exampleInputPassword1"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="showpass" onClick={handlePasswordShowClick}>
                show
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputConfirmPassword1"
              className="form-label"
            >
              Confirm Password
            </label>
            <div className="password-input">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Confirm password"
                id="exampleInputConfirmPassword1"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="showpass"
                onClick={handleConfirmPasswordShowClick}
              >
                show
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="customFile">
              Please select a photo
            </label>
            <input
              type="file"
              className="form-control"
              id="customFile"
              accept="images/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </div>

          <button type="submit" className="submit btn btn-primary">
            {picLoading ? <ChatLoading /> : <>Submit</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
