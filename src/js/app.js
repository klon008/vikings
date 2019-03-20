const $ = require('jquery'); //jquery
const jQuery = $;

const bootstrap = require('bootstrap'); //подключаю бутстрап
const wavesjs = require('./undr/waves.js'); // библиотека для анимации волн при клике
const TweenMax = require('./undr/TweenMax.min.js'); //Крутая либа для анимаций. Необходима для счетчика
const countdown = require('./undr/_countdown.js'); //Код счетчика
/*const main = require('./undr/main.js'); //Мой код*/
import "bootstrap/scss/bootstrap.scss"; //css часть бутстрапа
//import 'flag-icon-css/sass/flag-icon.scss'; //Флаги
const OverlayScrollbars = require('overlayscrollbars');
import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'material-design-icons/iconfont/material-icons.css'; //Иконки в стиле Материал
import '../scss/material-icons-outline/_outline.scss'; //Иконки в стиле Материал Обводка
import '../scss/scss.scss'; //Мой css



document.addEventListener('DOMContentLoaded', function () {
  let bookmare = document.getElementById('add_to_fav');
  bookmare.addEventListener('click', () => {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  })
  $('[data-toggle="tooltip"]').tooltip({container: 'body', boundary: 'window', paddingAbsolute: true});
  var instanceOverlay = OverlayScrollbars(document.getElementById('sidebar'), {
    overflowBehavior: {
      x: "hidden"
    },
    scrollbars: {
      autoHide: "leave"
    }
  });
})
var instanceOverlay = OverlayScrollbars(document.getElementById('right-side-chat'), {
  overflowBehavior: {
    x: "hidden"
  },
  scrollbars: {
    autoHide: "leave"
  }
});