import { Controller } from "./Controller.js";
import { THREERoot } from "./THREERoot.js";
import { ShootingStar } from "./ShootingStar.js";
import { Text } from "./Text.js";

function animate(fn) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$begin = options.begin,
        begin = _options$begin === void 0 ? 0 : _options$begin,
        _options$finish = options.finish,
        finish = _options$finish === void 0 ? 1 : _options$finish,
        _options$duration = options.duration,
        duration = _options$duration === void 0 ? 500 : _options$duration,
        _options$easing = options.easing,
        easing = _options$easing === void 0 ? "easeInOutCubic" : _options$easing,
        _options$isRoop = options.isRoop,
        isRoop = _options$isRoop === void 0 ? false : _options$isRoop,
        onAfter = options.onAfter;
    var change = finish - begin;
    var easingFunction = g_var2[easing];
    var startTime;

    function tick(timestamp) {
        var time = Math.min(duration, timestamp - startTime);
        var position = easingFunction(time, begin, change, duration);
        fn(position, time);

        if (time === duration) {
            if (isRoop) {
                startTime = timestamp;
                requestAnimationFrame(tick);
            } else {
                onAfter && onAfter();
            }
        } else {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(function (timestamp) {
        startTime = timestamp;
        tick(timestamp);
    });
}

class WebGL {
    constructor({ canvas, container = document.body }) {
        const controller = new Controller({
            closed: true
        });
        g_var1.controller = controller;

        const initialClientWidth = (g_var1.initialClientWidth = container.clientWidth);
        const initialClientHeight = (g_var1.initialClientHeight = container.clientHeight);
        // store.initialRatio = container.clientWidth / container.clientHeight
        g_var1.initialRatio = 1;

        const MAX_CAMERA_Z = 5000;
        const CAMERA_Z = 5000;

        const root =
            (this.root =
            g_var1.root =
                new THREERoot({
                    isDev: true,
                    container,
                    fov: Math.atan(initialClientHeight / 2 / CAMERA_Z) * (180 / Math.PI) * 2,
                    zFar: MAX_CAMERA_Z,
                    cameraPosition: [0, 0, CAMERA_Z],
                    aspect: window.innerWidth / window.innerHeight,
                    canvas
                }));

        this.setSize();
        root.addResizeCallback(() => {
            this.setSize();
        });

        // this.background = new Background()
        this.text = new Text();
        this.shootingStar = new ShootingStar();

        const data = {
            play: {
                value: null
            }
        };

        data["play"].value = () => {
            this.textStart();
        };

        controller.addData(data, {
            folder: this.text.folder
        });

        // root.initPostProcessing([
        //   new THREE.BloomPass(),
        //   new THREE.ShaderPass(THREE.CopyShader)
        // ])
    }

    setSize() {
        const clientWidth = (g_var1.clientWidth = this.root.canvas.clientWidth);
        const clientHeight = (g_var1.clientHeight = this.root.canvas.clientHeight);
        g_var1.clientHalfWidth = clientWidth / 2;
        g_var1.clientHalfHeight = clientHeight / 2;
        g_var1.resolution = new THREE.Vector2(clientWidth, clientHeight);
        g_var1.ratio = clientWidth / clientHeight;
    }

    start() {
        const period = Math.PI * 3;
        const amplitude = Math.min(Math.max(g_var1.clientWidth * 0.1, 100), 180);

        const FIRST_DURATION = 1080;

        animate(
            (progress) => {
                this.shootingStar.draw({
                    clientX: Math.cos(progress * period) * amplitude,
                    clientY: (progress * g_var1.clientHeight - g_var1.clientHalfHeight) * 1.3
                });
            },
            {
                duration: FIRST_DURATION,
                onAfter: () => {
                    this.shootingStar.draw({
                        clientX: -g_var1.clientHalfWidth,
                        clientY: g_var1.clientHeight - g_var1.clientHalfHeight
                    });

                    this.shootingStar.draw({
                        clientX: -g_var1.clientHalfWidth * 1.1,
                        clientY: 0
                    });

                    setTimeout(() => {
                        this.textStart();
                    }, 300);
                }
            }
        );
    }

    textStart() {
        animate(
            (progress) => {
                this.shootingStar.draw({
                    clientX: progress,
                    clientY: 0
                });

                this.text.update(progress - g_var1.clientWidth * 0.08);
            },
            {
                begin: -g_var1.clientHalfWidth * 1.1,
                finish: g_var1.clientHalfWidth * 1.1,
                duration: this.text.datData.duration,
                easing: this.text.datData.easing,
                onAfter: () => {
                    this.shootingStar.start();
                    document.body.classList.add("o-start");
                }
            }
        );
    }
}

export { WebGL };
