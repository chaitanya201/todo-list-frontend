import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClosingAlert from "../components/Alert";

// Register component
export default function Register() {
  const navigate = useNavigate(); // creating navigate object

  // declaring variables to store user info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingState, setLoadingState] = useState(false);

  // collecting user info
  const changeName = (event) => {
    setName(event.target.value);
  };
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  const changePassword = (event) => {
    setPassword(event.target.value);
  };
  document.title= "Register"
  // alert part
  const [alertMsg, setAlertMsg] = useState(null);
  const [alterMsgColor, setAlertMsgColor] = useState('red');

  // defining what would happen after form submission
  const onFormSubmit = async (event) => {
    event.preventDefault();
    setLoadingState(true);
    setAlertMsg("Checking credentials")
    setAlertMsgColor('yellow')
    if (!name.trim()) {
      setAlertMsg("Provide Valid name");
      return;
    }
    if (password.length < 8) {
      setAlertMsg("Password length is less than 8");
      return;
    }
    const user = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    console.log("user is ", user);

    try {
      const response = await axios.post(
        "https://todo-list-examrat.herokuapp.com/auth/register",
        user,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("after registrations in form function");
    if (response.data.status) {
      console.log("registration is successful in same function");
      console.log("this is the user after login ");
      navigate("/home");
    } else {
      console.log("registration failed", response.data.msg);
      const msg = response.data.msg;
      setAlertMsg(msg);
      setAlertMsgColor('green')
      console.log("alert msg is ", alertMsg);
    }
    } catch (error) {
      setAlertMsg("Server Error.Try again later.")
      setAlertMsgColor('red')
    }
    
    setLoadingState(false);
  };
  return (
    <div>
      
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Register
        </h1>
        <form method="post" onSubmit={onFormSubmit}>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            onChange={changeName}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={changeEmail}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={changePassword}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="submit"
            value="Register"
            className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
          />
        </form>
      </div>
    </div>
  );
}
