
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4994",
});

export default api;