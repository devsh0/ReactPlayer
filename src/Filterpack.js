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
        if (this.type === 'peaking')
            this.node.q = (this.frequency < 2000 ? 3 : 5);
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
        this.enabled = true;
        this.count = 10;
        this.bands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.lowshelf = new Filter(context, 'lowshelf', this.bands[0], 0);
        this.highshelf = new Filter(context, 'highshelf', this.bands[this.count - 1], 0);
        this.peakingFilterArray = this.bands
            .filter((f, i) => i > 0 && i < this.count - 1)
            .map(freq => new Filter(context, 'peaking', freq, 0));
        this.filterArray = [this.lowshelf, ...this.peakingFilterArray, this.highshelf];
        this.gainsWhenDisabled = [];
        this.presets = {
            custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bass: [4, 4, 4, 3, 2, 1, 0, 0, 0, 0],
            'bass 2x': [6, 6, 4, 2, 0, 0, 0, 0, 0, 0],
            ballad: [-8.4, -7.2, -5, -1.2, -0.8, 0.7, 1, 2.1, 3, 4.4],
            classic: [-2, -2, -2.4, 0.2, 0.5, 1.5, 1.5, 0, 2.5, 9],
            club: [0, 0, 8, 6, 5.5, 5, 3, 0, 0, 0],
            dance: [9.6, 7.0, 2.5, 0, 0, -5.6, -7.0, -7.0, 0, 0],
            party: [4.5, 1.7, 1, 0, 3.2, 4.5, 6.91, 8.8, 9.3, 10],
            pop: [-1.6, 4.5, 7, 8, 5.6, 0, -2.5, -2, -1.6, -1.5],
            rock: [8, 5, -5.5, -8, -3, 4, 8, 11, 11, 11.5],
            techno: [8, 5.5, 0, -5.5, -5, 0, 8, 10, 10, 9]
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

    enable() {
        if (!this.enabled) {
            this.gainsWhenDisabled.forEach((gain, i) => this.filterArray[i].setGain(gain));
            this.enabled = true;
        }
    }

    disable() {
        if (this.enabled) {
            this.gainsWhenDisabled = this.filterArray.map(filter => filter.gain);
            this.filterArray.forEach(filter => filter.setGain(0));
            this.enabled = false;
        }
    }

    setEnabled(enabled) {
        if (enabled)
            this.enable();
        else this.disable();
    }

    reset() {
        if (this.enabled)
            this.presets.custom = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    getPreset(key) {
        return this.presets[key];
    }

    registerCustomPreset() {
        this.presets.custom = this.filterArray.map(filter => filter.gain);
        console.log(this.presets.custom);
    }
}
