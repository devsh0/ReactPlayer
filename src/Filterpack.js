class Filter {
    constructor(context, type, frequency, gain) {
        this.filter = context.createBiquadFilter();
        this.filter.type = type;
        this.filter.frequency.value = frequency;
        this.filter.gain.value = gain;
    }

    setGain(gain) {
        this.filter.gain.value = gain;
    }

    connect(source, destination) {
        source.connect(this.filter).connect(destination);
    }
}

export default class Filterpack {
    constructor(context) {
        this.count = 10;
        this.bands = [31.25, 63.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.lowshelf = new Filter(context, 'lowshelf', this.bands[0], 0);
        this.highshelf = new Filter(context, 'highshelf', this.bands[this.count - 1], 0);
        this.peakingFilterArray = this.bands
            .filter((f, i) => 0 < i < this.count)
            .map(freq => new Filter(context, 'peaking', freq, 0));
    }

    connect(source, destination) {
        let node = source.connect(this.lowshelf.filter);
        this.peakingFilterArray.forEach(peaking => node = node.connect(peaking.filter))
        node.connect(this.highshelf.filter).connect(destination);
    }
}