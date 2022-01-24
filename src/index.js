import './style.css';

const copyright = document.querySelector('#copyright-year');
copyright.textContent = (new Date()).getFullYear();

