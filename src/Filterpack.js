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
        this.bands = [31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.lowshelf = new Filter(context, 'lowshelf', this.bands[0], 0);
        this.highshelf = new Filter(context, 'highshelf', this.bands[this.count - 1], 0);
        this.peakingFilterArray = this.bands
            .filter((f, i) => 0 < i < this.count)
            .map(freq => new Filter(context, 'peaking', freq, 0));
        this.filterArray = [this.lowshelf, ...this.peakingFilterArray, this.highshelf];
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

    setGainAround(frequency, gain) {
        if (frequency < 30) {
            this.filterArray[0].setGain(gain);
            return;
        }
        if (frequency > 16000) {
            this.filterArray[this.count - 1].setGain(gain);
            return;
        }

        for (let i = 1; i < this.count - 2; i++) {
            const filter = this.filterArray[i];
            if (frequency < filter.frequency) {
                filter.setGain(gain);
                return;
            }
        }
    }
}