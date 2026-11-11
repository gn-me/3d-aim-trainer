/* Created by Alexander Pen
this is the file for the functionality of the authentication menu */

// Define API endpoint
const API = 'http://localhost:3000/api';
// Get register button
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

import { showProfile } from './menu.js';

// Register new user
registerBtn.addEventListener('click', async () => {
  // Get input values
  const username = document.getElementById('authUser').value;
  const password = document.getElementById('authPass').value;

  // Basic validation
  if (username.length < 3 || password.length < 6 || username.length > 20) {
    alert('Username must be >= 3 and < 20 chars and password >= 6 chars.');
    return;
  }  
  // If contains spaces, show alert and return
  if (username.includes(' ') || password.includes(' ')) {
    alert('Username and password cannot contain spaces.');
    return;
  }


  // Disable button to prevent multiple submissions
  registerBtn.disabled = true;

  // Send registration request
  try {   
    // Make API call
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    // Parse response
    const data = await res.json();

    // Handle response
    if (res.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', String(data.user.id));
      document.getElementById('logoutBtn').style.display = "block";
      document.getElementById('authUser').value = '';
      document.getElementById('authPass').value = '';
      alert('Registration successful!');
    } else {
      alert(data.error || 'Registration failed');
    }

  } catch (err) { // Handle errors
    console.error('Error registering user:', err);
    alert('Network or server error. Check console.');
  } finally { // Re-enable button
    registerBtn.disabled = false;
  }
});


// Login existing user
loginBtn.addEventListener('click', async () => {
  // Get input values
  const username = document.getElementById('authUser').value;
  const password = document.getElementById('authPass').value;

  // Basic validation
  if (!username || !password) {
    alert('Username and password are required.');
    return;
  }

  // If contains spaces, show alert and return
  if (username.includes(' ') || password.includes(' ')) {
    alert('Username and password cannot contain spaces.');
    return;
  }

  // Disable button to prevent multiple submissions
  loginBtn.disabled = true;

  // Send login request
  try {
    // Make API call
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    // Parse response
    const data = await res.json();

    // Handle response
    if (res.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', String(data.user.id));
      document.getElementById('logoutBtn').style.display = "block";
      document.getElementById('authUser').value = '';
      document.getElementById('authPass').value = '';
      alert('Login successful!');
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) { // Handle errors
    console.error('Error logging in user:', err);
    alert('Network or server error. Check console.');
  } finally { // Re-enable button
    loginBtn.disabled = false;
  }
})