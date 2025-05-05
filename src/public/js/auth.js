document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      }),
      credentials: 'include'
    });
  
    if (response.ok) {
      window.location.href = '/';
    } else {
      alert('Login failed');
    }
  });