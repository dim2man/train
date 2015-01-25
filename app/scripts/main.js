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
    wagonsPlaced/*,
    audio*/;

  // if (Audio) {
  //   audio = new Audio();
  // }

  // function play(sound) {
  //   if (!audio) {
  //     return;
  //   }
  //   audio.src = sound;
  //   audio.play();
  // }

  function enableDrag($img, ondragged) {
    var curDragImg;
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

        ondragged($img, freeze);
      }); 
      $win.on('click', function() {
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
      var bind = wagonsPlaced > 0 ? bindWagon : bindTrain;
      wagonsPlaced++;
      $img.addClass('freeze').off('click');
      var pos = $target.position();
      pos.top += bind.top;
      pos.left += bind.left;
      $img.css({
        top: pos.top,
        left: pos.left
      });
      $target = $img;
      if (wagonsPlaced >= stage) {
        // stage completed
        stage++;
        if (stage > 5) {
          stage = 1;
        }
        $('.wagon').off('click');
        var path = pos.left + $img.width();
        $('.train').add('.freeze').animate({
          left: '-='+path
        }, path*3.3 /*~300px per sec*/, init);
      }
    }
  }

  function init() {
    $target = $('.train');
    wagonsPlaced = 0;
    
    $('.train')
    .removeClass('tr1 tr2 tr3 tr4 tr5')
    .addClass('tr'+stage)
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
      enableDrag($(this), dragged);  
    });
  }
  init();


});