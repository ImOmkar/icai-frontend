import axios from 'axios';
const API = axios.create({
  baseURL: 'https://icai-frontend.vercel.app/',
  // baseURL: 'http://localhost:4000',
  timeout: 5000
});
export default API;
