import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {  Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Route  path="/" component={HomePage} exact/>
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
