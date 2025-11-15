import axios from 'axios';
const API = axios.create({
  baseURL: 'https://mock-p9w7.onrender.com',
  timeout: 5000
});
export default API;



