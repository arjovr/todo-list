import './style.css';
import * as projectController from './project-controller';

const copyright = document.querySelector('#copyright-year');
copyright.textContent = new Date().getFullYear();

projectController.init();
