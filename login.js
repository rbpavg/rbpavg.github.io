import {setToken, getToken, removeToken} from './tokenHandler.js';

const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const token = getToken();
if (token) {
  window.location.replace('/index.html'); 
}

async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  setToken(data.token);
  return data;
}

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      
    await login({email, password});
    
    alert('Logged in! Token saved.');
    window.location.href = '/index.html';
    
  } catch (error) {
    console.error('Login error:', error);
    alert('Invalid email or password.');
  }
});