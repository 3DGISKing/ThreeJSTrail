import { WebGL } from "./WebGL.js";

var parcelRequire = (function (init) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof parcelRequire === "function" && parcelRequire;
    var nodeRequire = typeof require === "function" && require;
    var modules = {};

    function localRequire(name, jumped) {
        if (name in modules) {
            return modules[name];
        }

        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === "function" && parcelRequire;
        if (!jumped && currentRequire) {
            return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
            return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === "string") {
            return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = "MODULE_NOT_FOUND";
        throw err;
    }

    localRequire.register = function register(id, exports) {
        modules[id] = exports;
    };

    modules = init(localRequire);
    localRequire.modules = modules;
    return localRequire;
})(function (require) {
    // ES5 helper functions removed - using native ES6 classes // import * as THREE from 'three'
    // import TrackballControls from 'three-trackballcontrols'
    // import './three/postprocessing'
    // THREE.TrackballControls = TrackballControls

    // ES5 helper functions removed - using native ES6

    // ASSET: scripts/modules/easing.js
    window.g_var2 = {};
    /*!
     * Terms of Use: Easing Functions (Equations)
     *
     * Open source under the MIT License and the 3-Clause BSD License.
     * Copyright © 2001 Robert Penner
     * http://robertpenner.com/easing_terms_of_use.html
     */

    /**
     * linear
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    function linear(t, b, c, d) {
        return (c * t) / d + b;
    }
    /**
     * easeInQuad
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.linear = linear;

    function easeInQuad(t, b, c, d) {
        return c * (t /= d) * t + b;
    }
    /**
     * easeOutQuad
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInQuad = easeInQuad;

    function easeOutQuad(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    }
    /**
     * easeInOutQuad
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutQuad = easeOutQuad;

    function easeInOutQuad(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    }
    /**
     * easeInCubic
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutQuad = easeInOutQuad;

    function easeInCubic(t, b, c, d) {
        return c * Math.pow(t / d, 3) + b;
    }
    /**
     * easeOutCubic
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInCubic = easeInCubic;

    function easeOutCubic(t, b, c, d) {
        return c * (Math.pow(t / d - 1, 3) + 1) + b;
    }
    /**
     * easeInOutCubic
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutCubic = easeOutCubic;

    function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 3) + b;
        return (c / 2) * (Math.pow(t - 2, 3) + 2) + b;
    }
    /**
     * easeInQuart
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutCubic = easeInOutCubic;

    function easeInQuart(t, b, c, d) {
        return c * Math.pow(t / d, 4) + b;
    }
    /**
     * easeOutQuart
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInQuart = easeInQuart;

    function easeOutQuart(t, b, c, d) {
        return -c * (Math.pow(t / d - 1, 4) - 1) + b;
    }
    /**
     * easeInOutQuart
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutQuart = easeOutQuart;

    function easeInOutQuart(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 4) + b;
        return (-c / 2) * (Math.pow(t - 2, 4) - 2) + b;
    }
    /**
     * easeInQuint
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutQuart = easeInOutQuart;

    function easeInQuint(t, b, c, d) {
        return c * Math.pow(t / d, 5) + b;
    }
    /**
     * easeOutQuint
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInQuint = easeInQuint;

    function easeOutQuint(t, b, c, d) {
        return c * (Math.pow(t / d - 1, 5) + 1) + b;
    }
    /**
     * easeInOutQuint
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutQuint = easeOutQuint;

    function easeInOutQuint(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(t, 5) + b;
        return (c / 2) * (Math.pow(t - 2, 5) + 2) + b;
    }
    /**
     * easeInSine
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutQuint = easeInOutQuint;

    function easeInSine(t, b, c, d) {
        return c * (1 - Math.cos((t / d) * (Math.PI / 2))) + b;
    }
    /**
     * easeOutSine
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInSine = easeInSine;

    function easeOutSine(t, b, c, d) {
        return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    }
    /**
     * easeInOutSine
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutSine = easeOutSine;

    function easeInOutSine(t, b, c, d) {
        return (c / 2) * (1 - Math.cos((Math.PI * t) / d)) + b;
    }
    /**
     * easeInExpo
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutSine = easeInOutSine;

    function easeInExpo(t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    }
    /**
     * easeOutExpo
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInExpo = easeInExpo;

    function easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    }
    /**
     * easeInOutExpo
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutExpo = easeOutExpo;

    function easeInOutExpo(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
        return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    }
    /**
     * easeInCirc
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInOutExpo = easeInOutExpo;

    function easeInCirc(t, b, c, d) {
        return c * (1 - Math.sqrt(1 - (t /= d) * t)) + b;
    }
    /**
     * easeOutCirc
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeInCirc = easeInCirc;

    function easeOutCirc(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }
    /**
     * easeInOutCirc
     *
     * @param {number} t time: 現在時刻 (0 ~ duration)
     * @param {number} b begin: 開始位置
     * @param {number} c change: 開始位置から終了位置までの変化量 (finish - begin)
     * @param {number} d duration: 全体時間
     * @returns {number} 現在位置
     */

    g_var2.easeOutCirc = easeOutCirc;

    function easeInOutCirc(t, b, c, d) {
        if ((t /= d / 2) < 1) return (c / 2) * (1 - Math.sqrt(1 - t * t)) + b;
        return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }

    g_var2.easeInOutCirc = easeInOutCirc;

    // g_var2.easingList = easingList;

    // ES5 helper functions removed - using native ES6
    /**
     * アニメーション関数
     *
     * @param {AnimationCallback} fn アニメーションフレーム毎に実行するコールバック
     * @param {Object} [options={}] オプション
     * @param {number} [options.begin=0] 開始位置
     * @param {number} [options.finish=1] 終了位置
     * @param {number} [options.duration=500] 全体時間
     * @param {string} [options.easing='easeInOutCubic'] Easing function
     */

    window.g_var1 = {};

    const DELAY = 300;

    const webGL = new WebGL({
        canvas: document.getElementById("canvas")
    });

    setTimeout(() => {
        webGL.start();
    }, DELAY);
});
