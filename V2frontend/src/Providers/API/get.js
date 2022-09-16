
import axios from "axios";
const rootUrl = import.meta.env.VITE_API;


const client = axios.create({
  baseURL: rootUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`
  }

})

export default client;