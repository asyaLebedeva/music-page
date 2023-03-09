const playerBtn = document.querySelector('.play-button')
const audio = document.querySelector('.audio')
const timeline = document.querySelector('.timeline')
const controlBtn = document.querySelector('.play-pause');

function playPause() {
    if (audio.paused) {
        audio.play();
        controlBtn.className = "play";
    } else { 
        audio.pause();
        controlBtn.className = "pause";
    }
}

controlBtn.addEventListener("click", playPause);
audio.addEventListener("ended", function() {
  controlBtn.className = "play";
});

function changeTimelinePosition () {
  const percentagePosition = (100*audio.currentTime) / audio.duration;
  timeline.style.backgroundSize = `${percentagePosition}% 100%`;
  timeline.value = percentagePosition;
}

audio.ontimeupdate = changeTimelinePosition;

function audioEnded () {
  playerBtn.innerHTML = playBtnIcon;
}

audio.onended = audioEnded;

function changeSeek () {
  const time = (timeline.value * audio.duration) / 100;
  audio.currentTime = time;
}

timeline.addEventListener('change', changeSeek);

const playCont = document.querySelector('.player-container')
const durationCont= document.querySelector('.duration-time');
const currentCont = document.querySelector('.current-time');
let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationCont.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    timeline.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    const bufferedAmount = audio.buffered.length - 1;
    playCont.style.setProperty('--buffered-width', `${(bufferedAmount / timeline.max) * 100}%`);
}

const whilePlaying = () => {
    timeline.value = Math.floor(audio.currentTime);
    currentCont.textContent = calculateTime(timeline.value);
    playCont.style.setProperty('--seek-before-width', `${timeline.value / timeline.max * 100}%`);
    raf = requestAnimationFrame(whilePlaying);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('progress', displayBufferedAmount);

timeline.addEventListener('input', () => {
    currentCont.textContent = calculateTime(timeline.value);
    if(!audio.paused) {
      cancelAnimationFrame(raf);
  }
});

timeline.addEventListener('change', () => {
    audio.currentTime = timeline.value;
    if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
  }
});
