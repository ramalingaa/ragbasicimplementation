
const button = document.getElementById('button');
button.addEventListener('click', function() {
  console.log('button clicked');
  var inputText = document.getElementById('input').value;
  var outputDiv = document.getElementById('output');
  var newPTag = document.createElement('p');
  newPTag.textContent = inputText;
  outputDiv.appendChild(newPTag);
});