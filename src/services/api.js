import axios from 'axios';


const api = axios.create({
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
timeout: 10000,
});


api.interceptors.request.use(config => {
const raw = localStorage.getItem('cgp_user');
if(raw){
const user = JSON.parse(raw);
if(user?.token) config.headers.Authorization = `Bearer ${user.token}`;
}
return config;
});


export default api;