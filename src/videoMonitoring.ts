function getVideoMonitoring() {

    document.addEventListener("DOMContentLoaded", onLoaded);

    function onLoaded() {
        videoMonitoring.init();
    }

    interface IVideo {
        audioCtx: AudioContext | null;
        mapMediaElements: WeakMap<HTMLElement, null>;
        audioSource: MediaElementAudioSourceNode | null;
        boxes: HTMLDivElement[];
        video1: HTMLVideoElement | null;
        video2: HTMLVideoElement | null;
        video3: HTMLVideoElement | null;
        video4: HTMLVideoElement | null;
        init: () => void;
        setupVideo: () => void;
        closeFull: (boxEl: HTMLDivElement) => void;
        openFull: (boxEl: HTMLDivElement) => void;
        initElementEvents: () => void;
        drawVolumeGraphic: (videoEl: HTMLMediaElement, canv: string) => void;
        changeVideoFilter: (videoEl: HTMLVideoElement, val: string, type: string) => void;
        videoClick: (currentBox: HTMLDivElement, videoEl: HTMLVideoElement, canvasId: string) => void;
        initVideo: (video: HTMLVideoElement | null, url: string) => void;
    }

    const videoMonitoring: IVideo = {
        audioSource: null, audioCtx: null,
        mapMediaElements: new WeakMap(),
        boxes: [],
        video1: null, video2: null, video3: null, video4: null,

        openFull(boxEl: HTMLDivElement) {
            boxEl.classList.add("full-page");
            boxEl.style.animationName = "zoomScale";
            boxEl.style.animationDuration = "0.2s";
            boxEl.style.gridColumn = "span 6";
        },

        closeFull(boxEl: HTMLDivElement) {
            boxEl.style.gridColumn = "span 3";
            boxEl.classList.remove("full-page");
            boxEl.style.animationName = "unZoomScale";
            boxEl.style.animationDuration = "0.2s";
            boxEl.style.gridColumn = "";
        },

        drawVolumeGraphic(videoEl: HTMLMediaElement, canv: string) {
            if (this.audioCtx) {
                const canvas: HTMLCanvasElement | null = document.querySelector(canv);
                const canvasCtx = canvas && canvas.getContext("2d");

                const audioAnalyser = this.audioCtx.createAnalyser();

                // audioSourceSet
                if (this.mapMediaElements.has(videoEl)) {
                    this.audioSource = this.mapMediaElements.get(videoEl);
                } else {
                    this.audioSource = this.audioCtx.createMediaElementSource(videoEl);
                    this.mapMediaElements.set(videoEl, this.audioSource);
                }

                audioAnalyser.connect(this.audioCtx.destination);
                if (this.audioSource) {
                    this.audioSource.connect(audioAnalyser);
                    audioAnalyser.fftSize = 2048;

                    const frequencyBinArray = new Uint8Array(audioAnalyser.frequencyBinCount);

                    function averageByFrequency(frequency: Uint8Array) {
                        const length = frequency.length;
                        const values = frequencyBinArray.reduce((sum, value) => sum + value, 0);
                        return values / length;
                    }

                    function drawGraph() {
                        requestAnimationFrame(drawGraph);
                        audioAnalyser.getByteFrequencyData(frequencyBinArray);
                        const average: number = averageByFrequency(frequencyBinArray);
                        if (canvasCtx) {
                            canvasCtx.clearRect(0, 0, 250, 130);
                            canvasCtx.fillStyle = "#000000";
                            canvasCtx.fillRect(0, 120 - average, 250, 250);
                        }
                    }
                    drawGraph();
                }
            }
        },

        videoClick(currentBox: HTMLDivElement, videoEl: HTMLVideoElement, canvasId: string) {
            if (currentBox.classList.contains("full-page")) {
                for (const i in this.boxes) {
                    if (this.boxes[i] !== currentBox) {
                        this.boxes[i].style.display = "block";
                        this.boxes[i].style.animationName = "";
                    }
                }
                this.closeFull(currentBox);
                videoEl.muted = true;
                if (this.audioSource) {
                    this.audioSource.disconnect();
                }
            } else {
                for (const i in this.boxes) {
                    if (this.boxes[i] !== currentBox) {
                        this.boxes[i].style.display = "none";
                        this.boxes[i].style.animationName = "";
                    }
                }
                this.openFull(currentBox);
                videoEl.muted = false;
                this.drawVolumeGraphic(videoEl, canvasId);
            }
        },

        changeVideoFilter(videoEl: HTMLVideoElement, val: string, type: string) {
            if (videoEl && videoEl.style && videoEl.style.filter !== null) {
                const previousValue = videoEl.style.filter.match(/\w+-?[\d+\.]*/g);
                switch (type) {
                    case "brightness":
                        if (previousValue && previousValue.indexOf("contrast") !== -1) {
                            videoEl.style.filter = `${type}(${val})
                                contrast(${previousValue[previousValue.indexOf("contrast") + 1]})`;
                        } else {
                            videoEl.style.filter = `${type}(${val})`;
                        }
                        break;
                    case "contrast":
                        if (previousValue && previousValue.indexOf("brightness") !== -1) {
                            videoEl.style.filter = `${type}(${val})
                                brightness(${previousValue[previousValue.indexOf("brightness") + 1]})`;
                        } else {
                            videoEl.style.filter = `${type}(${val})`;
                        }
                        break;
                }
            }
        },

        initElementEvents() {

            this.boxes = [
                document.querySelector("#box-1") as HTMLDivElement,
                document.querySelector("#box-2") as HTMLDivElement,
                document.querySelector("#box-3") as HTMLDivElement,
                document.querySelector("#box-4") as HTMLDivElement,
            ];

            this.video1 = document.querySelector("#video-1");
            this.video2 = document.querySelector("#video-2");
            this.video3 = document.querySelector("#video-3");
            this.video4 = document.querySelector("#video-4");

            const brightness1: HTMLInputElement | null = document.querySelector("#brightness-1");
            const brightness2: HTMLInputElement | null = document.querySelector("#brightness-2");
            const brightness3: HTMLInputElement | null = document.querySelector("#brightness-3");
            const brightness4: HTMLInputElement | null = document.querySelector("#brightness-4");

            const contrast1: HTMLInputElement | null = document.querySelector("#contrast-1");
            const contrast2: HTMLInputElement | null = document.querySelector("#contrast-2");
            const contrast3: HTMLInputElement | null = document.querySelector("#contrast-3");
            const contrast4: HTMLInputElement | null = document.querySelector("#contrast-4");

            //#region brightnessRangeEvents
            if (brightness1) {
                brightness1.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video1) {
                        this.changeVideoFilter(this.video1, tg.value, "brightness");
                    }
                }).bind(this);
            }

            if (brightness2) {
                brightness2.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video2) {
                        this.changeVideoFilter(this.video2, tg.value, "brightness");
                    }
                }).bind(this);
            }

            if (brightness3) {
                brightness3.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video3) {
                        this.changeVideoFilter(this.video3, tg.value, "brightness");
                    }
                }).bind(this);
            }

            if (brightness4) {
                brightness4.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video4) {
                        this.changeVideoFilter(this.video4, tg.value, "brightness");
                    }
                }).bind(this);
            }

            //#endregion

            //#region contrastRangeEvents

            if (contrast1) {
                contrast1.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video1) {
                        this.changeVideoFilter(this.video1, tg.value, "contrast");
                    }
                }).bind(this);
            }

            if (contrast2) {
                contrast2.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video2) {
                        this.changeVideoFilter(this.video2, tg.value, "contrast");
                    }
                }).bind(this);
            }

            if (contrast3) {
                contrast3.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video3) {
                        this.changeVideoFilter(this.video3, tg.value, "contrast");
                    }
                }).bind(this);
            }

            if (contrast4) {
                contrast4.oninput = ((e: Event) => {
                    const tg = e.target as HTMLInputElement;
                    if (this.video4) {
                        this.changeVideoFilter(this.video4, tg.value, "contrast");
                    }
                }).bind(this);
            }

            //#endregion

            if (this.video1) {
                this.video1.onclick = ((e: Event) => {
                    this.videoClick(this.boxes[0], e.target, "#volume-graph-1");
                }).bind(this);
            }

            if (this.video2) {
                this.video2.onclick = ((e: Event) => {
                    this.videoClick(this.boxes[1] as HTMLDivElement, e.target, "#volume-graph-2");
                }).bind(this);
            }

            if (this.video3) {
                this.video3.onclick = ((e: Event) => {
                    this.videoClick(this.boxes[2], e.target, "#volume-graph-3");
                }).bind(this);
            }

            if (this.video4) {
                this.video4.onclick = ((e: Event) => {
                    this.videoClick(this.boxes[3], e.target, "#volume-graph-4");
                }).bind(this);
            }
        },

        init() {
            this.setupVideo();
            this.initElementEvents();
            const audioCtx: AudioContext = new AudioContext();
            this.audioCtx = audioCtx;
        },

        initVideo(video: HTMLVideoElement | null, url: string) {
            if (video && url) {
                if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        video.play();
                    });
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = "https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8";
                    video.addEventListener("loadedmetadata", () => {
                        video.play();
                    });
                }
            }
        },

        setupVideo() {
            this.initVideo(
                document.querySelector("#video-1"),
                "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8",
            );

            this.initVideo(
                document.querySelector("#video-2"),
                "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8",
            );

            this.initVideo(
                document.querySelector("#video-3"),
                "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8",
            );

            this.initVideo(
                document.querySelector("#video-4"),
                "http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8",
            );
        },
    };
}
getVideoMonitoring();
