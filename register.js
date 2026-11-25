import {setToken, getToken, removeToken} from './tokenHandler.js';

const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const token = getToken();
if (token) {
  window.location.replace('/index.html'); 
}

async function register(user) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Register failed");
  return data;
}



const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (event) => {
    
  event.preventDefault();

  const username = document.getElementById('username').value;
  const itsonid = document.getElementById('itsonid').value;
  const emailadd = document.getElementById('email').value;
  const spassword = document.getElementById('password').value;

  try {
      
    await register({
          name: username,
          email: emailadd,
          itsonId: itsonid,
          password: spassword
        })
    
    alert('Registered! Try logging in.');
    window.location.href = '/login.html';
    
  } catch (error) {
    console.error('Registration error:', error);
    alert('Invalid data.');
  }
});