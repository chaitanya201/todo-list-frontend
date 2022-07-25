import axios from 'axios';
import { useCookies } from "react-cookie";

console.log("cookie ", document.cookie.token);

const AxiosInstance = () => {
    const [cookie] = useCookies()
    console.log(cookie.token, "............")
    return axios.create({
        baseURL: "http://localhost:5000/",
        withCredentials:true,
        headers: {
          Authorization: cookie.token
            ? 'Bearer ' + cookie.token
            : null,
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*" 
        },
      });

}

export default AxiosInstance;