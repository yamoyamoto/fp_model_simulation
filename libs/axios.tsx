import Axios from "axios";

Axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const production = process.env.NODE_ENV === "production";

const axios = Axios.create({
  baseURL: production
    ? "https://fp-sumilation.herokuapp.com/"
    : "https://fp-sumilation.herokuapp.com/",
    // : "http://172.18.187.246:8000/",
});

export default axios;
