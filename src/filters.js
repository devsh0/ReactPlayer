// Boost/attenuate frequencies below `frequency`.
export class LowShelfFilter {
    constructor(context, frequency, gain) {
        this.context = context;
        this.frequency = frequency;
        this.gain = gain;
    }
}

// Boost/attenuate frequencies above `frequency`.
export class HighShelfFilter {
    constructor(context, frequency, gain) {
        this.context = context;
        this.frequency = frequency;
        this.gain = gain;
    }
}

// Boost/attenuate frequencies around `frequency`.
export class PeakingFilter {
    constructor(context, frequency, gain, q) {
        this.constext = context;
        this.frequency = frequency;
        this.gain = gain;
        this.q = q;
    }
}