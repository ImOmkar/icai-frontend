import axios from 'axios';
const API = axios.create({
  baseURL: 'https://icai-frontend.vercel.app',
  timeout: 5000
});
export default API;
