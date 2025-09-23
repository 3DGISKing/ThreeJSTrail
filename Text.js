var easingList = [
    "linear",
    "easeInSine",
    "easeOutSine",
    "easeInOutSine",
    "easeInQuad",
    "easeOutQuad",
    "easeInOutQuad",
    "easeInCubic",
    "easeOutCubic",
    "easeInOutCubic",
    "easeInQuart",
    "easeOutQuart",
    "easeInOutQuart",
    "easeInQuint",
    "easeOutQuint",
    "easeInOutQuint",
    "easeInExpo",
    "easeOutExpo",
    "easeInOutExpo",
    "easeInCirc",
    "easeOutCirc",
    "easeInOutCirc"
];

const data = {
    visible: {
        value: true
    },
    duration: {
        value: 1080,
        range: [0, 5000]
    },
    easing: {
        value: "easeOutQuint",
        range: [easingList]
    }
};

const TEXT = "Shooting Star";
const FONT_SIZE = 30;
const FONT_SIZE_SP = 24;
const FONT_SIZE_MIN = 20;
const LETTER_SPACING = 0.18;
const LETTER_SPACING_SP = 0.1;
const FONT = "Georgia, serif";
const COLOR = "#fff";
const uniformData = {
    alpha: {
        value: 0.8,
        range: [0, 1]
    }
};
const dataKeys = Object.keys(uniformData);

function getTextCoordinate(option) {
    var text = option.text,
        fontSize = option.fontSize,
        _option$letterSpacing = option.letterSpacing,
        letterSpacing = _option$letterSpacing === void 0 ? 0 : _option$letterSpacing,
        _option$font = option.font,
        font = _option$font === void 0 ? "Open sans" : _option$font,
        _option$color = option.color,
        color = _option$color === void 0 ? "#000000" : _option$color,
        _option$width = option.width,
        width =
            _option$width === void 0
                ? fontSize * text.length + fontSize * letterSpacing * (text.length - 1)
                : _option$width,
        _option$height = option.height,
        height = _option$height === void 0 ? fontSize : _option$height,
        _option$pixelRatio = option.pixelRatio,
        pixelRatio = _option$pixelRatio === void 0 ? window.devicePixelRatio : _option$pixelRatio;
    fontSize *= pixelRatio;
    width *= pixelRatio;
    height *= pixelRatio;
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.fontSize = fontSize + "px";
    canvas.style.letterSpacing = letterSpacing + "em";
    canvas.style.display = "none";
    document.body.appendChild(canvas); // letter-spacing を有効にするために必要

    var ctx = canvas.getContext("2d");
    ctx.font = "".concat(fontSize, "px ").concat(font);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // \n で改行して複数行にする

    var textLines = text.split("\n");
    textLines.forEach(function (text, i) {
        var x = width / 2;
        var y = height / 2 + fontSize * i - (fontSize / 2) * (textLines.length - 1);
        ctx.fillText(text, x, y);
    });
    return canvas;
}
class Text {
    constructor() {
        const { root, controller } = g_var1;
        const folder = (this.folder = controller.addFolder("Text"));
        this.datData = controller.addData(data, {
            folder
        });

        const fontSize = g_var1.clientWidth < 360 ? FONT_SIZE_MIN : g_var1.clientWidth < 768 ? FONT_SIZE_SP : FONT_SIZE;
        const letterSpacing = g_var1.clientWidth < 768 ? LETTER_SPACING_SP : LETTER_SPACING;
        const textNormalWidth = TEXT.length + letterSpacing * (TEXT.length - 1);
        const textWidth = fontSize * textNormalWidth;
        const textHeight = fontSize * 1.2;
        const pixelRatio = window.devicePixelRatio;
        const textCanvas = getTextCoordinate({
            text: TEXT,
            fontSize,
            height: textHeight,
            letterSpacing,
            font: FONT,
            color: COLOR,
            pixelRatio
        });

        const width = textCanvas.width / pixelRatio;
        const height = textCanvas.height / pixelRatio;
        const halfWidth = width / 2;
        const texture = new THREE.Texture(textCanvas);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;

        const geometry = new THREE.PlaneBufferGeometry(width, height);
        const uniforms = {
            map: {
                value: texture
            },
            uProgress: {
                value: -g_var1.clientHalfWidth
            },
            uStartX: {
                value: g_var1.clientHalfWidth - halfWidth
            },
            uRatio: {
                value: width / height
            }
        };

        this.datUniformData = controller.addUniformData(uniformData, uniforms, {
            folder
        });

        const vertexShader =
            "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\nattribute vec3 position;\nattribute vec2 uv;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nvarying vec2 vUv;\n\nvoid main () {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);\n}\n";

        const fragShader =
            "precision highp float;\nprecision highp int;\n#define GLSLIFY 1\n\nuniform sampler2D map;\nuniform float uProgress;\nuniform float uStartX;\nuniform float uRatio;\nuniform float alpha;\n\nvarying vec2 vUv;\n\nvoid main(){\n\tvec4 textureColor = texture2D(map, vUv);\n\tfloat angle = uRatio / 3.;\n\tfloat isShow = step(1., 1. - vUv.x + (uProgress / uStartX * 0.5 + 0.5) - abs(vUv.y - 0.5) / angle);\n\tgl_FragColor = vec4(textureColor.rgb, textureColor.a * alpha * isShow);\n\t// gl_FragColor = vec4(isShow);\n}\n";

        const material = (this.material = new THREE.RawShaderMaterial({
            uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragShader,
            transparent: true
        }));

        const mesh = (this.mesh = new THREE.Mesh(geometry, material));
        mesh.frustumCulled = false;
        mesh.visible = this.datData.visible;
        mesh.position.setZ(0.1);
        root.add(mesh);

        root.addUpdateCallback((timestamp) => {
            this.mesh.visible = this.datData.visible;
            dataKeys.forEach((key) => {
                this.material.uniforms[key].value = this.datUniformData[key];
            });
        });
    }

    update(progress) {
        this.material.uniforms["uProgress"].value = progress;
    }
}

export { Text };
