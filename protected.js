// Retrieve the token from localStorage
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/'; // Redirect to login if token is not available
}

fetch('/protected', {
  method: 'GET',
  headers: {
    'Authorization': token
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error('Not authorized');
  }
  return response.text();
})
.then(data => {
  document.getElementById('content').textContent = data;
})
.catch(error => {
  console.error('Error:', error);
  // Redirect or display error message for unauthorized access
});
