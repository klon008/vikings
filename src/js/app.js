const $ = require('jquery'); //jquery
const jQuery = $;
const _ = require('underscore'); //библиотека андерскора
const bootstrap = require('bootstrap'); //подключаю бутстрап
const wavesjs = require('./undr/waves.js'); // библиотека для анимации волн при клике
const TweenMax = require('./undr/TweenMax.min.js'); //Крутая либа для анимаций. Необходима для счетчика
const countdown = require('./undr/_countdown.js'); //Код счетчика
/*const main = require('./undr/main.js'); //Мой код*/
import "bootstrap/scss/bootstrap.scss"; //css часть бутстрапа
import 'flag-icon-css/sass/flag-icon.scss'; //Флаги
import '../scss/scss.scss'; //Мой css

let text = 'или нет';
$('#timeline').html(`Все работает ${text}`);