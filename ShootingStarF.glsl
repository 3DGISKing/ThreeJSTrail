precision highp float;
precision highp int;

#define GLSLIFY 1

// uniform float uProgress;
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
}