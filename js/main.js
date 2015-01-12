(function(){

   var params = getParams();
   var countdown = params.interval;
   var repCounter = params.reps;
   var restCountdown = params.rest;

   var sounds = {};
   var repSoundUrl = './sounds/gong.mp3';
   var completeSoundUrl = './sounds/chinese-gong-2.mp3';
   var audioContext;
   var timerEl, timerWrapEl, repEl, repWrapEl;
   var intervalLoop, restLoop;

   window.addEventListener('load', init, false);

   function init() {
      audioContext = new webkitAudioContext();
      loadSound(repSoundUrl, 'repSound', onSoundLoad);
   }

   function prepareDom() {
      timerEl = document.getElementById('timer');
      timerWrapEl = document.getElementById('timer-wrap');
      restEl = document.getElementById('rest');
      restWrapEl = document.getElementById('rest-wrap');
      repEl = document.getElementById('reps');
      repWrapEl = document.getElementById('reps-wrap');
      if (typeof restCountdown !== 'undefined') {
         restWrapEl.style.display = 'block';
      }
   }

   function onSoundLoad() {
      prepareDom();
      loadSound(completeSoundUrl, 'completeSound');
      playSound();
      updateDisplay();
      initCountdown();
   }

   function initRestCountdown(){
      restLoop = setInterval(function(){
         restCountdown--;
         updateDisplay();
         if (restCountdown == 0) {
            clearInterval(restLoop);
            playSound();
            initCountdown();
            restCountdown = params.rest;
         }
      }, 1000);
   }

   function initCountdown(){
      intervalLoop = setInterval(function(){
         countdown--;
         if (countdown == 0 && repCounter > 1) {
            playSound();
            clearInterval(intervalLoop);
            countdown = params.interval;
            repCounter--;
            if (typeof restCountdown !== 'undefined') {
               initRestCountdown();
            } else {
               initCountdown();
            }
         } else if (countdown == 0 && repCounter == 1) {
            playCompleteSound();
            updateDisplayComplete();
            clearInterval(intervalLoop);
            return;
         }
         updateDisplay(countdown);
      }, 1000);
   }

   function playSound(buffer) {
     var source = audioContext.createBufferSource(); // creates a sound source
     source.buffer = buffer || sounds.repSound; // tell the source which sound to play
     source.connect(audioContext.destination); // connect the source to the context's destination (the speakers)
     source.start(0); // play the source now
   }

   function playCompleteSound(){
      playSound(sounds.completeSound);
   }

   function loadSound(url, bufferName, callback) {
     var request = new XMLHttpRequest();
     request.open('GET', url, true);
     request.responseType = 'arraybuffer';

     // Decode asynchronously
     request.onload = function() {
       audioContext.decodeAudioData(request.response, function(decodedBuffer) {
         sounds[bufferName] = decodedBuffer;
         callback && callback();
       });
     }
     request.send();
   }

   function updateDisplay() {
      timerEl.innerHTML = countdown;
      repEl.innerHTML = repCounter;
      restEl.innerHTML = restCountdown;
   }

   function updateDisplayComplete() {
      timerWrapEl.innerHTML = '';
      repWrapEl.innerHTML = '';
      timerWrapEl.innerHTML = "Good goin' buddy :]";
   }

   function getParams(){
      var arr = window.location.search.substr(1).split("&");
      var params = {};
      var i, tmpArr;
      for (i = 0; i < arr.length; i++) {
          tmpArr = arr[i].split("=");
          params[tmpArr[0]] = tmpArr[1];
      }
      return params;
   }

})();
