function makeGesture() {
    const evCache = new Array();
    let multiTouchPointerEvents = new Array();
    let prevDiff = -1;

    interface IСurrentGesture {
        startX: number;
        rotateAction: boolean;
    }

    let currentGesture: IСurrentGesture | null = null;
    const transformState = {
        scale: 1.8,
        lastPosition: 0,
    };

    const webcam: HTMLImageElement | null = document.querySelector("#webcam");
    const lightLabel: HTMLElement | null = document.querySelector("#light");
    const zoomLabel: HTMLElement | null = document.querySelector("#zoom");

    const maxValues = {
        imageWidth: webcam && webcam.width,
        minScale: 1,
        maxScale: 5,
        maxBrightness: 1,
        minBrightness: 0,
        constDrop: 25,
        constAngle: 15,
    };

    if (webcam) {
        webcam.addEventListener("pointerdown", pointDown);
        webcam.addEventListener("pointerup", cancelTouch);
        webcam.addEventListener("pointercancel", cancelTouch);
        webcam.addEventListener("pointermove", move);
        webcam.addEventListener("pointerout", cancelTouch);
        webcam.addEventListener("pointerleave", cancelTouch);
    }

    function move(event: PointerEvent) {
        if (!currentGesture) {
            return;
        }
        for (let i = 0; i < evCache.length; i++) {
            if (event.pointerId === evCache[i].pointerId) {
                evCache[i] = event;
                break;
            }
        }

        if (evCache.length === 1) {
            const { x } = event;
            const dx = x - currentGesture.startX;
            if (webcam && (((webcam.offsetWidth * transformState.scale) - webcam.offsetWidth) /
                (transformState.scale * 2) * transformState.scale) > Math.abs(dx + transformState.lastPosition)) {
                webcam.style.transform = `
                translateX(${dx + transformState.lastPosition}px)
                scale(${transformState.scale})`;
                webcam.style.webkitTransform = `
                translateX(${dx + transformState.lastPosition}px)
                scale(${transformState.scale})`;
            }
        } else if (webcam && lightLabel && zoomLabel && evCache.length === 2) {
            const curDiffX = Math.abs(evCache[0].clientX - evCache[1].clientX);
            const curDiffY = Math.abs(evCache[0].clientY - evCache[1].clientY);
            const diffCtn = Math.atan2(curDiffY, curDiffX) * 180 / Math.PI;
            const dropBeetwPoints = Math.sqrt(Math.pow(curDiffX, 2) * 2 + Math.pow(curDiffY, 2) * 2);

            multiTouchPointerEvents.push({ drop: dropBeetwPoints.toFixed(6), angle: diffCtn.toFixed(6) });
            if (multiTouchPointerEvents.length >= 2) {
                if (Math.abs(diffCtn - multiTouchPointerEvents[0].angle) > maxValues.constAngle &&
                    Math.abs(dropBeetwPoints - multiTouchPointerEvents[multiTouchPointerEvents.length - 2].drop) <
                    maxValues.constDrop) {
                    currentGesture.rotateAction = true;
                    webcam.style.filter = `brightness(${(Math.abs(diffCtn - multiTouchPointerEvents[0].angle)) / 20})`;
                    webcam.style.webkitFilter =
                        `brightness(${(Math.abs(diffCtn - multiTouchPointerEvents[0].angle)) / 20})`;
                    lightLabel.innerText =
                        `Яркость: ${Math.round(Math.abs(diffCtn - multiTouchPointerEvents[0].angle) * 1.1)}%`;
                    console.log("rotate");
                } else {
                    if (prevDiff > 0 && !currentGesture.rotateAction) {
                        if (curDiffX > prevDiff &&
                            ((transformState.scale * (curDiffX / prevDiff)) < maxValues.maxScale)) {
                            transformState.scale *= curDiffX / prevDiff;
                            webcam.style.transform =
                                `translateX(${transformState.scale < 2 ? 0 : transformState.lastPosition}px)
                             scale(${transformState.scale})`;
                            webcam.style.webkitTransform =
                                `translateX(${transformState.scale < 2 ? 0 : transformState.lastPosition}px)
                            scale(${transformState.scale})`;
                        }
                        if (curDiffX < prevDiff &&
                            ((transformState.scale * (curDiffX / prevDiff)) > maxValues.minScale)) {
                            transformState.scale *= curDiffX / prevDiff;
                            webcam.style.transform =
                                `translateX(${transformState.scale < 2 ? 0 :
                                    (transformState.lastPosition / transformState.scale)}px)
                            scale(${transformState.scale})`;
                            webcam.style.webkitTransform =
                                `translateX(${transformState.scale < 2 ? 0 :
                                    (transformState.lastPosition / transformState.scale)}px)
                            scale(${transformState.scale})`;
                        }
                        zoomLabel.innerText = `Приближение: ${Math.round(transformState.scale * 100) - 100}%`;
                        console.log("pinch");
                    }
                    prevDiff = curDiffX;
                }
            }
        }
    }

    function cancelTouch(event: PointerEvent) {
        console.log("up", event);
        currentGesture = null;
        if (webcam) {
            const webCamStyleTransform: any = webcam.style.transform ? webcam.style.transform : "";
            transformState.lastPosition = webCamStyleTransform !== "" ?
                Number(webCamStyleTransform.match(/-?[\d+\.]+/g)[0]) : 0;
            remove_event(event);
            if (evCache.length < 2) {
                prevDiff = -1;
                multiTouchPointerEvents = [];
            }
        }
    }

    function pointDown(event: PointerEvent) {
        console.log("down", event);
        evCache.push(event);
        if (webcam) {
            webcam.setPointerCapture(event.pointerId);
            currentGesture = {
                startX: event.x,
                rotateAction: false,
            };
        }
    }

    function remove_event(event: PointerEvent) {
        for (let i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId === event.pointerId) {
                evCache.splice(i, 1);
                break;
            }
        }
    }
}
makeGesture();
