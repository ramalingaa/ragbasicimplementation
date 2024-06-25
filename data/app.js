const input = document.getElementById('input');
const button = document.getElementById('button');
const container = document.getElementById('input-container');

input.addEventListener('input', function () {
  const value = input.value.trim();
  const isValid = /^\d+$/.test(value);
  const error = container.querySelector('.error');

  if (!isValid) {
    if (!error) {
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Please enter a valid number';
      errorMessage.classList.add('error');
      container.appendChild(errorMessage);
    }
  } else {
    if (error) {
      container.removeChild(error);
    }
  }
});

button.addEventListener('click', function() {
  console.log('button clicked');
  const inputText = input.value;
  const outputDiv = document.getElementById('output');
  const newPTag = document.createElement('p');
  newPTag.textContent = inputText;
  outputDiv.appendChild(newPTag);
});