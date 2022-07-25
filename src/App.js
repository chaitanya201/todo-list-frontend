import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null);
  console.log("user is ", user);
  const [cookie] = useCookies();
  useEffect(() => {
    setUser(cookie.user);
  }, [cookie.user]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/home" element={ <Home /> }></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
