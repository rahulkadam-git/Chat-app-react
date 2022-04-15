import React, { useEffect } from "react";
import Login from "../component/Forms/Login";
import Register from "../component/Forms/Register";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useHistory } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

function HomePage(props) {
  const history = useHistory();
  const {

    token
  } = ChatState();

  useEffect(() => {
   
    if (token) history.push("/chats");
  }, [history,token]);

  return (
    <div className="homepage">
      <div className="homepage-cover">
        <div className="side-content">
          <h3>Get in</h3>
          <h2>touch </h2>

          <h5>with others..</h5>
        </div>
      </div>
      <div className="forms">
        <div className="select-tab">
          <Tabs
            defaultActiveKey="login"
            id="uncontrolled-tab-example"
            className="mb-3 w-100"
          >
            <Tab eventKey="login" title="Login" className="login">
              <Login />
            </Tab>
            <Tab eventKey="register" title="Register" className="register">
              <Register />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
