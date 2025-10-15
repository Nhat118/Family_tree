import api from './api';


export async function login(email, password){
// Replace with real API call
// return await api.post('/auth/login', { email, password });
if(email === 'admin@example.com'){
return { user: { id:1, name:'Admin', email, role:'admin', token: 'admintoken' } };
}
return { user: { id:2, name:'User', email, role:'user', token: 'usertoken' } };
}
export async function register(payload){
// return await api.post('/auth/register', payload);
return { ok: true };
}
export async function fetchUsers(){
// return await api.get('/users');
return [{ id:1, name:'Admin', email:'admin@example.com', role:'admin' }];
}