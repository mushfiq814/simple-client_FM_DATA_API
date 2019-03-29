
let codePlaceHolder = document.getElementById('codePlaceHolder');

// get code from url
let url = new URLSearchParams(window.location.search);

// if (url.has('code')) {
  let gCode = url.get('code');
  gCode = 'Hello all fczxczxczxczxdasdasdor now';
  codePlaceHolder.innerText = gCode;
  codePlaceHolder.setAttribute('readonly', '');
// }

function copyToClipBoard() {
  codePlaceHolder.select();
  document.execCommand('copy');
}