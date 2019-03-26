const $ = require('jquery'); //jquery
const bootstrap = require('bootstrap'); //подключаю бутстрап
const wavesjs = require('./undr/waves.js'); // библиотека для анимации волн при клике
const TweenMax = require('./undr/TweenMax.min.js'); //Крутая либа для анимаций. Необходима для счетчика
const countdown = require('./undr/_countdown.js'); //Код счетчика
const slickCarousel = require('slick-carousel');
/*const main = require('./undr/main.js'); //Мой код*/

//import 'flag-icon-css/sass/flag-icon.scss'; //Флаги убрал и оставил только 2 флага. все подключается в scss.scss
const OverlayScrollbars = require('overlayscrollbars'); //кастомный скроллбар
import 'overlayscrollbars/css/OverlayScrollbars.css'; //кастомный скроллбар
import 'material-design-icons/iconfont/material-icons.css'; //Иконки в стиле Материал
import '../scss/material-icons-outline/_outline.scss'; //Иконки в стиле Материал Обводка
import "bootstrap/scss/bootstrap.scss"; //css часть бутстрапа
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css'
import '../scss/scss.scss' //Мой css
import '../img/icons/icons.css' //Подгружаем иконки @FIXME перенисти все иконки в ЛИЧНЫЙ иконочный шрифт

import './undr/leftbar.js'
import './undr/rightbar_chat.js'

document.addEventListener('DOMContentLoaded', () => {
  let body = document.getElementsByTagName("body")[0];
  body.classList.remove('load');
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
      alert('Нажмите ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D чтобы добавить сайт в закладки.');
    }
  })
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body',
    boundary: 'window',
    paddingAbsolute: true
  });
  for (var scrl of ['left_bar_wrapper', 'right-side-chat']) {
    OverlayScrollbars(document.getElementById(scrl), {
      overflowBehavior: {
        x: "hidden"
      },
      scrollbars: {
        autoHide: "leave"
      }
    });
  }

  var MainContentOverlay = OverlayScrollbars(document.querySelector('main .scroll-content'), {
    scrollbars: {
      autoHide: "leave",
    },
    overflowBehavior: {
      x: "hidden"
    },
    paddingAbsolute: false
  });
  $(".slick").slick({
    slidesToShow: 11,
    infinite: true,
    dots: false,
    centerMode: true,
    autoplay: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1355,
        settings: {
          slidesToShow: 9,
        }
      },
      {
        breakpoint: 1161,
        settings: {
          slidesToShow: 7,
        }
      },
      {
        breakpoint: 999,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 832,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 814,
        settings: {
          slidesToShow: 4,
        }
      },
      
      {
        breakpoint: 753,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 692,
        settings: {
          slidesToShow: 2,
          centerMode: true,
        }
      },
      
      {
        breakpoint: 572,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        }
      },
    ]
  });
})

