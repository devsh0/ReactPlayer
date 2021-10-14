class Filter {
    constructor(context, type, frequency, gain) {
        this.node = context.createBiquadFilter();
        this.type = type;
        this.frequency = frequency;
        this.gain = gain;
        this.configureNode();
    }

    configureNode() {
        this.node.type = this.type;
        this.node.frequency.value = this.frequency;
        this.node.gain.value = this.gain;
    }

    setGain(gain) {
        this.gain = gain;
        this.node.gain.value = gain;
    }

    connect(source, destination) {
        source.connect(this.node).connect(destination);
    }
}

export default class Filterpack {
    constructor(context) {
        this.count = 10;
        this.bands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.lowshelf = new Filter(context, 'lowshelf', this.bands[0], 0);
        this.highshelf = new Filter(context, 'highshelf', this.bands[this.count - 1], 0);
        this.peakingFilterArray = this.bands
            .filter((f, i) => i > 0 && i < this.count - 1)
            .map(freq => new Filter(context, 'peaking', freq, 0));
        this.filterArray = [this.lowshelf, ...this.peakingFilterArray, this.highshelf];
        this.presets = {
            custom : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bass: [6, 5, 4, 3, 2, 1, 0, 0, 0, 0]
        }
    }

    connect(source, destination) {
        let node = source.connect(this.lowshelf.node);
        this.peakingFilterArray.forEach(peaking => node = node.connect(peaking.node))
        node.connect(this.highshelf.node).connect(destination);
    }

    setGain(filterIndex, gain) {
        if (filterIndex >= 0 && filterIndex < this.count)
            this.filterArray[filterIndex].setGain(gain);
    }

    getPresets() {
        return this.presets;
    }

    getPreset(key) {
        return this.presets[key];
    }

    registerCustomPreset() {
        this.presets.custom = this.filterArray.map(filter => filter.gain);
        console.log(this.presets.custom);
    }
}
