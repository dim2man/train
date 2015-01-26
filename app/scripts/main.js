$(function() {
  'use strict';
  var $win = $(window), 
    stage = 1,
    bindTrain = {
      top: 18,
      left: 140
    },
    bindWagon = {
      top: 0,
      left: 136
    },
    bindPadding = 20,
    $target,
    wagonsPlaced,
    audio,
    AUDIO_CLICK = 'sound/receive.wav',
    AUDIO_YOUCANNOT = 'sound/youcannot.wav',
    AUDIO_GO = 'sound/train.wav';

  if (Audio) {
    audio = new Audio();
  }

  function play(sound) {
    if (!audio) {
      return;
    }
    audio.src = sound;
    audio.play();
  }

  function enableDrag($img) {
    var curDragImg, freezed;
    function freeze() {
      curDragImg = null;
      $img.removeClass('active');
      $win.off('mousemove');
      $win.off('click');
    }
    $img.off('click');
    $img.on('click', function(e) {
      // start drag
      var prevX, prevY;
      if ($img === curDragImg) {
        return;
      }
      if ($img.hasClass('freeze')) {
        freezed = true;
        wagonsPlaced.pop();
        if (wagonsPlaced.length > 0) {
          $target = wagonsPlaced[wagonsPlaced.length - 1];
          enableDrag(wagonsPlaced[wagonsPlaced.length - 1]);
          $target.addClass('last');
        } else {
          $target = $('.train');          
        }
        $img.removeClass('freeze');
      } else {
        freezed = false;
      }
      prevX = e.pageX;
      prevY = e.pageY;
      $img.addClass('active');
      curDragImg = $img;
      e.stopPropagation();

      $win.on('mousemove', function(e) {
        //move
        var pos = $img.position();
        $img.css({
          top: (pos.top + e.pageY - prevY)+'px',
          left: (pos.left + e.pageX - prevX)+'px'
        });
        prevX = e.pageX;
        prevY = e.pageY;

        if (!freezed) {
          dragged($img, freeze);
        }
      }); 
      $win.on('click', function() {
        if (freezed) {
          dragged($img, freeze);
        }
        freeze();
      });
    });
  }

  function targetMatch($img) {
    var imgPos = $img.position(),
      targetPos = $target.position(),
      // imgWidth = $img.width(),
      imgHeigh = $img.height(),
      targetWidth = $target.width(),
      targetHeight = $target.height(),
      il = imgPos.left + bindPadding,
      // ir = il +imgWidth - bindPadding,
      it = imgPos.top + bindPadding,
      ib = it + imgHeigh - bindPadding,
      tl = targetPos.left + bindPadding,
      tr = tl + targetWidth - bindPadding,
      tt = targetPos.top + bindPadding,
      tb = tt + targetHeight - bindPadding;

    if ( (tr - bindPadding <= il && il <= tr + bindPadding) && ( (tt <= it && it <= tb) || (tt <= ib && ib <= tb) ) ) {
      return true;
    } else {
      return false;
    }
  }

  function dragged($img, freeze) {
    if (targetMatch($img)) {
      freeze();
      var bind;
      if (wagonsPlaced.length > 0) {
        bind = bindWagon;
        wagonsPlaced[wagonsPlaced.length - 1].off('click').removeClass('last');
      } else {
        bind = bindTrain;
      }
      wagonsPlaced.push($img);
      $img.addClass('freeze last');
      var pos = $target.position();
      pos.top += bind.top;
      pos.left += bind.left;
      $img.css({
        top: pos.top,
        left: pos.left
      });
      $target = $img;
      play(AUDIO_CLICK);
    }
  }

  function init() {
    $target = $('.train');
    wagonsPlaced = [];
    
    $('.train')
    .removeClass('tr1 tr2 tr3 tr4 tr5')
    .addClass('clickable tr'+stage)
    .css({
      left: 'calc(50% - '+(150+150*stage)/2+'px)'
    });
    
    $('.wagon')
    .css({
      top: '',
      left: ''
    })
    .removeClass('freeze')
    .removeClass('active')
    .each(function(){
      enableDrag($(this));  
    });
  }

  $('.train').on('click', function() {
    if (!$('.train').hasClass('clickable')) {
      return;
    }
    if (wagonsPlaced.length === stage) {
      // stage completed
      stage++;
      if (stage > 5) {
        stage = 1;
      }
      $('.wagon').off('click');
      var path = $target.position().left + $target.width();
      play(AUDIO_GO);
      $('.train')
      .removeClass('clickable')
      .add('.freeze')
      .animate({
        left: '-='+path
      }, path*3.3 /*~300px per sec*/, init);
    } else {
      play(AUDIO_YOUCANNOT);
    }
  });

  $('#btnstart').on('click', function() {
    $('.banner').hide();
    $('.wagon').addClass('visible');
    init();
  });

});