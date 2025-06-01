class LioPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const src = this.getAttribute('src') || '';

    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '12px';
    wrapper.innerHTML = `
        <div class="player-container" id="main">
            <div>
                <a href="javascript:void(0);" id="playPause"><img id="playImg" src="https://radio-onlineapp.web.app/LioSound/images/play.svg" alt="Play_Button"></a>
            </div>
            <div>
                <div class="timetext" id="currenttime">00:00</div>
            </div>
            <div>
                <input id="timebar" type="range" class="progress-bar" min="0" value="0" max="300">
            </div>
            <div>
                <div class="timetext" id="totaltime">00:00</div>
            </div>
            <div>
                <a href="javascript:void(0);" id="soundloud"><img id="soundImg" src="https://radio-onlineapp.web.app/LioSound/images/sound-loud.svg" alt="mute"></a>
            </div>
            <div>
                <input id="soundloudbar" type="range" class="volume-bar" min="0" value="100">
            </div>
            <div>
                <a href="javascript:void(0);" id="fileUrl" target="_blank"><img src="https://radio-onlineapp.web.app/LioSound/images/signal.svg" alt="mute"></a>
            </div>
        </div>
        <audio id="audio" src="${src}"></audio>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .player-container {
            overflow: hidden;
            border-radius: 10px;
            display: flex;
            align-items: center;
            background-color: #333;
            width:max-content;
            height: 40px;
        }
        /* Formato de imágenes para botones */
        .player-container div a img {
            width: 35px;
            padding-left: 5px;
            padding-right: 5px;
        }
        /* Formato de los divs del reproductor */
        .player-container div .timetext {
            float: left;
            color: #f2f2f2;
            text-align: center;
            font-size: 20px;
            padding-left: 3px;
            padding-right: 3px;
            font-family: 'Times New Roman', Times, serif;
        }
        /* Formato de la barra de progreso */
        .progress-bar {
            float: left;
            width: 75px;
        }
        .volume-bar {
            float: left;
            width: 60px;
        }
        /* Responsive */
        @media only screen and (max-width: 382px) {
            .player-container {width: fit-content;}
            .volume-bar {display: none !important;}
        }
    `;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://www.w3schools.com/w3css/5/w3.css';

    this.shadowRoot.appendChild(link);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(wrapper);

    // Element references
    const audio = wrapper.querySelector('#audio');
    const playPauseBtn = wrapper.querySelector('#playPause');
    const totaltime = wrapper.querySelector('#totaltime');
    const volumeSlider = wrapper.querySelector('#soundloudbar');
    const progress = wrapper.querySelector('#timebar');
    const timer = wrapper.querySelector('#currenttime');
    const playImg = wrapper.querySelector('#playImg');
    const soundloud = wrapper.querySelector('#soundImg');


    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
      totaltime.innerHTML = formatoTiempo(audio.duration);
      progress.max = audio.duration;
      
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    // Volume control
    volumeSlider.addEventListener('input', () => {
      audio.volume = parseFloat(volumeSlider.value) / 100;
      if(audio.volume <= 0) {
        soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-off.svg';
      } else if(audio.volume > 0 && audio.volume <= 0.5) {
        soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-quiet.svg';
      } else {
        soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-loud.svg';
      }
    });

    soundloud.addEventListener('click', () => {
        if(!audio.muted) {
            soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-off.svg';
            audio.muted = true;
        } else {
            if(audio.volume > 0.5) {
                soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-loud.svg';
            } else {
                soundloud.src = 'https://radio-onlineapp.web.app/LioSound/images/sound-quiet.svg';
            }
            audio.muted = false;
        }
    });

    // Progress bar
    progress.addEventListener('input', () => {
        audio.currentTime = progress.value;
        
    });

    audio.addEventListener('timeupdate', () => {
      timer.innerHTML = formatoTiempo(audio.currentTime);
      progress.value = audio.currentTime;
    });

    audio.addEventListener('play', () => {
        playImg.src = 'https://radio-onlineapp.web.app/LioSound/images/pause.svg';
    });

    audio.addEventListener('pause', () => {
        playImg.src = 'https://radio-onlineapp.web.app/LioSound/images/play.svg';
    });

    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.pause();        
    });

    audio.addEventListener('error', (e) => {
        console.log(e.error);
        
    });

    function formatoTiempo(segundos) {
        let aux = segundos % 6000;
        const mins = Math.floor(aux / 60);
        const secs = Math.floor(aux % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }
}

customElements.define('lio-player', LioPlayer);
