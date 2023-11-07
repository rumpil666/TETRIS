import '../assets/styles/index.css';

import Game from './Game.js';
import View from './View';
import Controller from './Controller.js';

const element = document.querySelector('.content')

const game = new Game();
const view = new View(element, 480, 640, 20, 10);
const controller = new Controller(game, view);
