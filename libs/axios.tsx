import Axios from "axios";

Axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const production = process.env.NODE_ENV === "production";

const axios = Axios.create({
  baseURL: production ? "http://localhost:8000" : "https://fp-sumilation.herokuapp.com/",
});

export default axios;
