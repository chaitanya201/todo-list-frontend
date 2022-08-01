import axios from "axios";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import {  useNavigate } from "react-router-dom";
import ClosingAlert from "../components/Alert";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);
  const [alterMsgColor, setAlertMsgColor] = useState('red');

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const [cookie] = useCookies();
  document.title = "Login"

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setAlertMsg("Checking Credentials")
    setAlertMsgColor('yellow')
    const user = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        user,
        {
          withCredentials: true,
          headers: {
            Authorization: cookie.token ? "Bearer " + cookie.token : null,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
  
      if (response.data.status) {
        console.log("data after login is ", response.data);
        navigate("/home");
      } else {
        console.log("failed to login");
        setAlertMsg("Email or Password is incorrect");
        setAlertMsgColor('red')
      }
    } catch (error) {
      setAlertMsg("Server Error.")
      setAlertMsgColor('red')
    }
  };

  return (
    <div>
      {alertMsg ? (
        <ClosingAlert msg={alertMsg} alertColor={alterMsgColor} />
      ) : (
        <div> </div>
      )}
      <div className="h-screen flex bg-gray-100">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Login 🔐
          </h1>
          <form method="post" onSubmit={onFormSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={onEmailChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <br />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onPasswordChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <div className="flex justify-center items-center mt-6">
              <input
                type="submit"
                value="Login"
                className="w-full px-6 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-blue-900"
              />
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
