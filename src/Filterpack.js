class Filter {
    constructor(context, type, frequency, gain) {
        this.enabled = true;
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
            this.node.q = (this.frequency <= 2000 ? 3 : 5);
    }

    setGain(gain) {
        if (this.enabled) {
            this.gain = gain;
            this.node.gain.value = gain;
        }
    }

    connect(source, destination) {
        source.connect(this.node).connect(destination);
    }

    disable() {
        this.enabled = false;
    }

    enable() {
        this.enabled = true;
    }
}

const getPresets = () => {
    return {
        custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        bass: [5.8, 4.5, 4, 2.9, .5, 0, 0, 0, 0, 0],
        'bass 2x': [6, 6, 5, 3, 1, 0, 0, 0, 0, 0],
        classic: [5.2, 3.1, 3, 2.9, -1.5, -1.5, 0, 2.9, 3.1, 3.3],
        dance: [3.2, 6.2, 5.8, 0, 2.6, 4.4, 5.7, 3.5, 3.2, 0],
        party: [4.5, 1.7, 1, 0, 0, 2.5, 4, 5, 5, 6],
        pop: [-2, -1.8, 0, 1.2, 4.2, 4.2, 1.2, 0, -1.8, -2],
        rock: [5, 3, 2, 1.8, -1.8, -2, 0, 1.6, 3, 3.8],
        jazz: [4.5, 2.9, 1.5, 1.8, -1.5, -1.5, 0, 1.6, 2.8, 3.8]
    }
}

export default class Filterpack {
    constructor(context) {
        this.enabled = true;
        this.count = 10;
        this.bands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.lowshelf = new Filter(context, 'lowshelf', this.bands[0], 0);
        this.highshelf = new Filter(context, 'highshelf', this.bands[this.count - 1], 0);
        this.peakingFilterArray = this.bands.filter((f, i) => i > 0 && i < this.count - 1)
            .map(freq => new Filter(context, 'peaking', freq, 0));
        this.filterArray = [this.lowshelf, ...this.peakingFilterArray, this.highshelf];

        this.presets = getPresets();
        this.currentPreset = {key: 'custom', value: this.presets.custom};
        this.gainsWhenDisabled = [];
    }

    connect(source, destination) {
        let node = source.connect(this.lowshelf.node);
        this.peakingFilterArray.forEach(peaking => node = node.connect(peaking.node))
        node.connect(this.highshelf.node).connect(destination);
    }

    disconnect() {
        this.lowshelf.node.disconnect();
        this.peakingFilterArray.forEach(peaking => peaking.node.disconnect());
        this.highshelf.node.disconnect();
    }

    setGain(filterIndex, gain) {
        if (this.enabled) {
            if (filterIndex >= 0 && filterIndex < this.count)
                this.filterArray[filterIndex].setGain(gain);
        }
    }

    getPresets() {
        return this.presets;
    }

    enable() {
        if (!this.enabled) {
            this.gainsWhenDisabled.forEach((gain, i) => {
                const filter = this.filterArray[i];
                filter.enable();
                filter.setGain(gain)
            });
            this.enabled = true;
        }
    }

    disable() {
        if (this.enabled) {
            this.gainsWhenDisabled = this.filterArray.map(filter => filter.gain);
            this.filterArray.forEach(filter => {
                filter.setGain(0);
                filter.disable()
            });
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

    getCurrentPreset() {
        return this.currentPreset;
    }

    setCurrentPreset(key) {
        if (this.enabled) {
            this.currentPreset = {key: key, value: this.presets[key]};
        }
    }

    registerCustomPreset() {
        if (this.enabled) {
            this.presets.custom = this.filterArray.map(filter => filter.gain);
        }
    }

    isEnabled() {
        return this.enabled;
    }
}
