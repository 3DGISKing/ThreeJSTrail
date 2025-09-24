const uniformData = {
    size: {
        value: 0.05,
        range: [0, 1]
    },
    minSize: {
        value: 1,
        range: [0, 5]
    },
    speed: {
        value: 0.012,
        range: [0, 0.05]
    },
    fadeSpeed: {
        value: 1.1,
        range: [1, 2]
    },
    shortRangeFadeSpeed: {
        value: 1.3,
        range: [1, 5]
    },
    minFlashingSpeed: {
        value: 0.1,
        range: [0, 1]
    },
    spread: {
        value: 7,
        range: [0, 20]
    },
    maxSpread: {
        value: 5,
        range: [1, 20]
    },
    maxZ: {
        value: 100,
        range: [0, 500]
    },
    blur: {
        value: 1,
        range: [0, 1]
    },
    far: {
        value: 10,
        range: [0, 100]
    },
    maxDiff: {
        value: 100,
        range: [0, 1000]
    },
    diffPow: {
        value: 0.24,
        range: [0, 10]
    }
};

const uniformKeys = Object.keys(uniformData);
const PARTICLE_COUNT_PER_MOUSE = 800;
const COUNT = PARTICLE_COUNT_PER_MOUSE * 400;
const MOUSE_ATTRIBUTE_COUNT = 4;

class ShootingStar {
    constructor() {
        const { root, controller } = g_var1;
        this.root = root;
        this.rate = 1;
        this.setSize();

        const folder = controller.addFolder("Shooting Star");

        const $a87C$var$data = {
            visible: {
                value: true
            }
        };

        this.datData = controller.addData($a87C$var$data, {
            folder
        });

        const front = new THREE.Vector2();
        const uniforms = {
            resolution: {
                value: g_var1.resolution
            },
            pixelRatio: {
                value: root.renderer.getPixelRatio()
            },
            timestamp: {
                value: 0
            }
        };

        this.datUniformData = controller.addUniformData(uniformData, uniforms, {
            folder
        });

        const geometry = (this.geometry = new THREE.BufferGeometry());
        const positions = [];
        const mouse = [];
        const aFront = [];
        const random = [];

        for (let i = 0; i < COUNT; i++) {
            positions.push(Math.random(), Math.random(), Math.random());
            mouse.push(-1, -1, 0, 0);
            aFront.push(front.x, front.y);
            random.push(Math.random());
        }

        const FRONT_ATTRIBUTE_COUNT = 2;

        geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute("mouse", new THREE.Float32BufferAttribute(mouse, MOUSE_ATTRIBUTE_COUNT));
        geometry.addAttribute("aFront", new THREE.Float32BufferAttribute(aFront, FRONT_ATTRIBUTE_COUNT));
        geometry.addAttribute("random", new THREE.Float32BufferAttribute(random, 1));

        const vertexShader = `
                        precision highp float;
                        precision highp int;

                        #define GLSLIFY 1

                        attribute vec3 position;
                        attribute vec4 mouse;
                        attribute vec2 aFront;
                        attribute float random;

                        uniform mat4 modelViewMatrix;
                        uniform mat4 projectionMatrix;

                        // uniform float uProgress;
                        uniform vec2 resolution;
                        uniform float pixelRatio;
                        uniform float timestamp;
                        uniform float size;
                        uniform float minSize;
                        // uniform float delay;
                        uniform float speed;
                        uniform float far;
                        uniform float spread;
                        uniform float maxSpread;
                        uniform float maxZ;
                        uniform float maxDiff;
                        uniform float diffPow;

                        varying float vProgress;
                        varying float vRandom;
                        varying float vDiff;
                        varying float vSpreadLength;
                        varying float vPositionZ;

                        float cubicOut(float t) {
                            float f = t - 1.0;
                            return f * f * f + 1.0;
                        }

                        // #pragma glslify: cubicBezier = require(../../modules/cubicBezier.glsl)

                        const float PI = 3.1415926;
                        const float PI2 = PI * 2.;

                        vec2 cartesianToPolar(vec2 p) {
                            return vec2((atan(p.y, p.x) + PI) / PI2, length(p));
                        }

                        vec2 polarToCartesian(vec2 p) {
                            float r = p.x * PI2 - PI;
                            float l = p.y;
                            return vec2(cos(r) * l, sin(r) * l);
                        }

                        void main() {
                            float progress = clamp((timestamp - mouse.z) * speed, 0., 1.);
                            progress *= step(0., mouse.x);

                            float startX = mouse.x - resolution.x / 2.;
                            float startY = mouse.y - resolution.y / 2.;
                            vec3 startPosition = vec3(startX, startY, random);

                            float diff = clamp(mouse.w / maxDiff, 0., 1.);
                            diff = pow(diff, diffPow);

                            vec3 cPosition = position * 2. - 1.;

                            float radian = cPosition.x * PI2 - PI;
                            vec2 xySpread = vec2(cos(radian), sin(radian)) * spread * mix(1., maxSpread, diff) * cPosition.y;

                            vec3 endPosition = startPosition;
                            endPosition.xy += xySpread;
                            endPosition.xy -= aFront * far * random;
                            endPosition.z += cPosition.z * maxZ * (pixelRatio > 1. ? 1.2 : 1.);

                            float positionProgress = cubicOut(progress * random);
                            vec3 currentPosition = mix(startPosition, endPosition, positionProgress);

                            vProgress = progress;
                            vRandom = random;
                            vDiff = diff;
                            vSpreadLength = cPosition.y;
                            vPositionZ = position.z;

                            gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.);
                            gl_PointSize = max(currentPosition.z * size * diff * pixelRatio, minSize * (pixelRatio > 1. ? 1.3 : 1.));
                        }
                        `;

        const fragmentShader = `
                precision highp float;
                precision highp int;

                #define GLSLIFY 1

                uniform float fadeSpeed;
                uniform float shortRangeFadeSpeed;
                uniform float minFlashingSpeed;
                uniform float blur;

                varying float vProgress;
                varying float vRandom;
                varying float vDiff;
                varying float vSpreadLength;
                varying float vPositionZ;

                highp float random(vec2 co) {
                    highp float a = 12.9898;
                    highp float b = 78.233;
                    highp float c = 43758.5453;
                    highp float dt = dot(co.xy, vec2(a, b));
                    highp float sn = mod(dt, 3.14);
                    return fract(sin(sn) * c);
                }

                float quadraticIn(float t) {
                    return t * t;
                }

                #ifndef HALF_PI
                #define HALF_PI 1.5707963267948966
                #endif

                float sineOut(float t) {
                    return sin(t * HALF_PI);
                }

                const vec3 baseColor = vec3(170., 133., 88.) / 255.;

                void main() {
                    vec2 p = gl_PointCoord * 2. - 1.;
                    float len = length(p);

                    float cRandom = random(vec2(vProgress * mix(minFlashingSpeed, 1., vRandom)));
                    cRandom = mix(0.3, 2., cRandom);

                    float cBlur = blur * mix(1., 0.3, vPositionZ);
                    float shape = smoothstep(1. - cBlur, 1. + cBlur, (1. - cBlur) / len);
                    shape *= mix(0.5, 1., vRandom);

                    if (shape == 0.) discard;

                    float darkness = mix(0.1, 1., vPositionZ);

                    float alphaProgress = vProgress * fadeSpeed * mix(2.5, 1., pow(vDiff, 0.6));
                    alphaProgress *= mix(shortRangeFadeSpeed, 1., sineOut(vSpreadLength) * quadraticIn(vDiff));
                    float alpha = 1. - min(alphaProgress, 1.);
                    alpha *= cRandom * vDiff;

                    gl_FragColor = vec4(baseColor * darkness * cRandom, shape * alpha);
                }`;

        const material = (this.material = new THREE.RawShaderMaterial({
            uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        }));

        const mesh = (this.mesh = new THREE.Points(geometry, material));

        mesh.frustumCulled = false;
        mesh.visible = this.datData.visible;

        root.add(mesh);

        // root.initPostProcessing([
        //   new THREE.BloomPass(1.3, 25, 3.1, 256),
        //   new THREE.ShaderPass(THREE.CopyShader)
        // ])

        this.mouseI = 0;
        this.lineCoordinateList = [];
        this.enableSaveCoordinate = false;

        root.addResizeCallback(() => {
            this.setSize();
            material.uniforms["resolution"].value = g_var1.resolution;
            // let scale
            // if (store.ratio > store.initialRatio) {
            //   scale = store.clientHeight / store.initialClientHeight
            // } else {
            //   scale = store.clientWidth / store.initialClientWidth
            // }
            // console.log(scale)
            // mesh.scale.set(scale, scale, 1)
        });

        root.addUpdateCallback((timestamp) => {
            this.update(timestamp);
        });
    }

    setSize() {
        this.rate = Math.min(
            g_var1.ratio > g_var1.initialRatio
                ? g_var1.clientHeight / g_var1.initialClientHeight
                : g_var1.clientWidth / g_var1.initialClientWidth,
            1
        );

        this.rate *= 1 / (g_var1.clientHeight / g_var1.initialClientHeight);
    }

    update(timestamp) {
        this.timestamp = timestamp;
        this.material.uniforms["timestamp"].value = timestamp;
        this.mesh.visible = this.datData.visible;

        uniformKeys.forEach((key) => {
            this.material.uniforms[key].value = this.datUniformData[key];
        });
    }

    draw({ clientX, clientY }) {
        this.enableSaveCoordinate &&
            this.lineCoordinateList.push({
                clientX,
                clientY
            });

        const x = clientX * this.rate + g_var1.clientHalfWidth;
        const y = g_var1.clientHeight - (clientY * this.rate + g_var1.clientHalfHeight);

        const newPosition = new THREE.Vector2(x, y);
        const diff = this.oldPosition ? newPosition.clone().sub(this.oldPosition) : new THREE.Vector2();
        const length = diff.length();
        const front = diff.clone().normalize();

        for (let i = 0; i < PARTICLE_COUNT_PER_MOUSE; i++) {
            const ci = (this.mouseI % (COUNT * MOUSE_ATTRIBUTE_COUNT)) + i * MOUSE_ATTRIBUTE_COUNT;

            const position = this.oldPosition
                ? this.oldPosition.clone().add(diff.clone().multiplyScalar(i / PARTICLE_COUNT_PER_MOUSE))
                : newPosition;

            this.geometry.attributes["mouse"].array[ci] = position.x;
            this.geometry.attributes["mouse"].array[ci + 1] = position.y;
            this.geometry.attributes["mouse"].array[ci + 2] = this.timestamp;
            this.geometry.attributes["mouse"].array[ci + 3] = length;
            this.geometry.attributes["aFront"].array[ci] = front.x;
            this.geometry.attributes["aFront"].array[ci + 1] = front.y;
        }

        this.oldPosition = newPosition;
        this.geometry.attributes["mouse"].needsUpdate = true;
        this.geometry.attributes["aFront"].needsUpdate = true;
        this.mouseI += MOUSE_ATTRIBUTE_COUNT * PARTICLE_COUNT_PER_MOUSE;
    }

    start() {
        this.oldPosition = null;

        window.addEventListener("pointermove", (e) => {
            const { clientX, clientY } = e;

            this.draw({
                clientX: clientX - g_var1.clientHalfWidth,
                clientY: clientY - g_var1.clientHalfHeight
            });
        });

        window.addEventListener("touchmove", (e) => {
            const { clientX, clientY } = e.touches[0];

            this.draw({
                clientX: clientX - g_var1.clientHalfWidth,
                clientY: clientY - g_var1.clientHalfHeight
            });
        });
    }
}

export { ShootingStar };
