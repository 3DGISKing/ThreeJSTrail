class Animation {
    constructor(fn, options) {
        const {
            begin = 0,
            finish = 1,
            duration = 500,
            easing = "easeInOutCubic",
            isRoop = false,
            isAuto = true,
            onBefore,
            onAfter,
            onStop
        } = options;

        this.fn = fn;
        this.duration = duration;
        this.easingFunction = g_var2[easing];
        this.originalFrom = begin;
        this.originalTo = finish;
        this.isRoop = isRoop;
        this.onBefore = onBefore;
        this.onAfter = onAfter;
        this.onStop = onStop;
        isAuto && this.start();
    }

    tick(timestamp) {
        const time = Math.min(this.duration, timestamp - this.startTime);
        const position = this.easingFunction(time, this.begin, this.change, this.duration);
        this.fn(position, time);

        if (time === this.duration) {
            if (this.isRoop) {
                this.animate();
            } else {
                this.onAfter && this.onAfter();
            }
        } else {
            this.id = requestAnimationFrame(this.tick.bind(this));
        }
    }

    animate() {
        this.id = requestAnimationFrame((timestamp) => {
            this.startTime = timestamp;
            this.tick(timestamp);
        });
    }

    start() {
        this.onBefore && this.onBefore();
        this.begin = this.originalFrom;
        this.finish = this.originalTo;
        this.change = this.finish - this.begin;
        this.id && this.stop();
        this.animate();
    }

    reverse() {
        this.onBefore && this.onBefore();
        this.begin = this.originalTo;
        this.finish = this.originalFrom;
        this.change = this.finish - this.begin;
        this.id && this.stop();
        this.animate();
    }

    play() {
        this.animate();
    }

    stop() {
        cancelAnimationFrame(this.id);
        this.id = null;
        this.onStop && this.onStop();
    }

    set easing(easing) {
        this.easingFunction = g_var2[easing];
    }
}
