import Axios from 'axios'

Axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
 

const axios = Axios.create({
    baseURL: 'http://localhost:3000',
})
 
export default axios