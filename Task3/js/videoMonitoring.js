document.addEventListener('DOMContentLoaded', onLoaded);

function onLoaded() {
    videoMonitoring.init();
}

var videoMonitoring = {
    init: function () {
        this.setupVideo();
        this.initElementEvents();
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    },

    setupVideo: function () {
        this.initVideo(
            document.getElementById('video-1'),
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
        );
        
        this.initVideo(
            document.getElementById('video-2'),
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
        );
        
        this.initVideo(
            document.getElementById('video-3'),
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
        );
        
        this.initVideo(
            document.getElementById('video-4'),
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
        ); 
    },

    audioSource: {},

    audioCtx: {},

    drawVolumeGraphic: function (videoEl, canv) {
        let canvas = document.getElementById(canv);
        let canvasCtx = canvas.getContext("2d");
        let audioAnalyser = this.audioCtx.createAnalyser();

        //audioSourceSet
        if (this.mapMediaElements.has(videoEl)) {
            this.audioSource = this.mapMediaElements.get(videoEl);
        } else {
            this.audioSource = this.audioCtx.createMediaElementSource(videoEl);
            this.mapMediaElements.set(videoEl, this.audioSource);
        }

        audioAnalyser.connect(this.audioCtx.destination);
        this.audioSource.connect(audioAnalyser);
        audioAnalyser.fftSize = 2048;

        let frequencyBinArray = new Uint8Array(audioAnalyser.frequencyBinCount);

        function averageByFrequency(frequencyBinArray) {
            let values = 0;
            let length = frequencyBinArray.length;
            for (let i = 0; i < length; i++) {
                values += frequencyBinArray[i];
            }
            return values / length;
        }

        function drawGraph() {
            requestAnimationFrame(drawGraph);
            audioAnalyser.getByteFrequencyData(frequencyBinArray);
            let average = averageByFrequency(frequencyBinArray);
            canvasCtx.clearRect(0, 0, 250, 130);
            canvasCtx.fillStyle = "#000000";
            canvasCtx.fillRect(0, 120 - average, 250, 250);
        }
        drawGraph();
    },

    initVideo: function (video, url) {
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    },

    initElementEvents: function () {
        this.video1 = document.getElementById('video-1');
        this.video2 = document.getElementById('video-2');
        this.video3 = document.getElementById('video-3');
        this.video4 = document.getElementById('video-4');

        this.boxes = [
            box1 = document.getElementById('box-1'),
            box2 = document.getElementById('box-2'),
            box3 = document.getElementById('box-3'),
            box4 = document.getElementById('box-4')
        ];

        let brightness1 = document.getElementById('brightness-1');
        let brightness2 = document.getElementById('brightness-2');
        let brightness3 = document.getElementById('brightness-3');
        let brightness4 = document.getElementById('brightness-4');

        let contrast1 = document.getElementById('contrast-1');
        let contrast2 = document.getElementById('contrast-2');
        let contrast3 = document.getElementById('contrast-3');
        let contrast4 = document.getElementById('contrast-4');

        //#region brightnessRangeEvents
        brightness1.oninput = (function(e) {
            this.changeVideoFilter(this.video1, e.target.value, 'brightness');
        }).bind(this);
        
        brightness2.oninput = (function(e) {
            this.changeVideoFilter(this.video2, e.target.value, 'brightness');
        }).bind(this);

        brightness3.oninput = (function(e) {
            this.changeVideoFilter(this.video3, e.target.value, 'brightness');
        }).bind(this);

        brightness4.oninput = (function(e) {
            this.changeVideoFilter(this.video4, e.target.value, 'brightness');
        }).bind(this);

        //#endregion

        //#region contrastRangeEvents

        contrast1.oninput = (function(e) {
            this.changeVideoFilter(this.video1, e.target.value, 'contrast');
        }).bind(this);

        contrast2.oninput = (function(e) {
            this.changeVideoFilter(this.video2, e.target.value, 'contrast');
        }).bind(this);

        contrast3.oninput = (function(e) {
            this.changeVideoFilter(this.video3, e.target.value, 'contrast');
        }).bind(this);

        contrast4.oninput = (function(e) {
            this.changeVideoFilter(this.video4, e.target.value, 'contrast');
        }).bind(this);

        //#endregion

        this.video1.onclick = (function(e) {
            this.videoClick(this.boxes[0], e.target, "volume-graph-1");
        }).bind(this);

        this.video2.onclick = (function(e) {
            this.videoClick(this.boxes[1], e.target, "volume-graph-2");
        }).bind(this);

        this.video3.onclick = (function(e) {
            this.videoClick(this.boxes[2], e.target, "volume-graph-3");
        }).bind(this);

        this.video4.onclick = (function(e) {
            this.videoClick(this.boxes[3], e.target, "volume-graph-4");
        }).bind(this);
    },

    videoClick: function(currentBox, videoEl, canvasId) {
        if (currentBox.classList.contains("full-page")) {
            for (let i = 0; i < this.boxes.length; i++) {
                if (this.boxes[i] != currentBox) {
                    this.boxes[i].style.display = "block";
                    this.boxes[i].style.animationName = "";
                }
            }
            this.closeFull(currentBox);
            videoEl.muted = true;
            this.audioSource.disconnect();
        }
        else {
            for (let i = 0; i < this.boxes.length; i++) {
                if (this.boxes[i] != currentBox) {
                    this.boxes[i].style.display = "none";
                    this.boxes[i].style.animationName = "";
                }
            }
            this.openFull(currentBox);
            videoEl.muted = false;
            this.drawVolumeGraphic(videoEl, canvasId);
        }
    },

    openFull: function (boxEl) {
        boxEl.classList.add('full-page');
        boxEl.style.animationName = "zoomScale";
        boxEl.style.animationDuration = '0.2s';
        boxEl.style.gridColumn = "span 6";
    },

    closeFull: function (boxEl) {
        boxEl.style.gridColumn = "span 3";
        boxEl.classList.remove('full-page');
        boxEl.style.animationName = "unZoomScale";
        boxEl.style.animationDuration = '0.2s';
        boxEl.style.gridColumn = "";
    },

    mapMediaElements: new WeakMap(),

    changeVideoFilter: function (videoEl, val, type) {
        let previousValue = videoEl.style.filter.match(/\w+-?[\d+\.]*/g);
        switch (type) {
            case 'brightness':
                if (previousValue && previousValue.indexOf('contrast') !== -1) {
                    videoEl.style.filter = `${type}(${val}) contrast(${previousValue[previousValue.indexOf('contrast') + 1]})`;
                }
                else {
                    videoEl.style.filter = `${type}(${val})`;
                }
                break;
            case 'contrast':
                if (previousValue && previousValue.indexOf('brightness') !== -1) {
                    videoEl.style.filter = `${type}(${val}) brightness(${previousValue[previousValue.indexOf('brightness') + 1]})`;
                }
                else {
                    videoEl.style.filter = `${type}(${val})`;
                }
                break;
        }
    },
     
}
