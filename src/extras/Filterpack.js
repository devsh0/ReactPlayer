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
    if (this.type === "peaking") this.node.q = this.frequency <= 2000 ? 3 : 5;
  }

  getFrequency() {
    return this.frequency;
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

export default class Filterpack {
  static bands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  constructor(context) {
    this.enabled = true;
    this.count = 10;
    this.lowshelf = new Filter(context, "lowshelf", Filterpack.bands[0], 0);
    this.highshelf = new Filter(
      context,
      "highshelf",
      Filterpack.bands[this.count - 1],
      0
    );

    this.peakingFilterArray = Filterpack.bands
      .filter((f, i) => i > 0 && i < this.count - 1)
      .map((freq) => new Filter(context, "peaking", freq, 0));

    this.filterArray = [
      this.lowshelf,
      ...this.peakingFilterArray,
      this.highshelf,
    ];

    this.presets = [
      { key: "custom", gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { key: "bass", gains: [5.8, 4.5, 4, 2.9, 0.5, 0, 0, 0, 0, 0] },
      { key: "bass 2x", gains: [6, 6, 5, 3, 1, 0, 0, 0, 0, 0] },
      {
        key: "classic",
        gains: [5.2, 3.1, 3, 2.9, -1.5, -1.5, 0, 2.9, 3.1, 3.3],
      },
      { key: "dance", gains: [3.2, 6.2, 5.8, 0, 2.6, 4.4, 5.7, 3.5, 3.2, 0] },
      { key: "party", gains: [4.5, 1.7, 1, 0, 0, 2.5, 4, 5, 5, 6] },
      { key: "pop", gains: [-2, -1.8, 0, 1.2, 4.2, 4.2, 1.2, 0, -1.8, -2] },
      { key: "rock", gains: [5, 3, 2, 1.8, -1.8, -2, 0, 1.6, 3, 3.8] },
      {
        key: "jazz",
        gains: [4.5, 2.9, 1.5, 1.8, -1.5, -1.5, 0, 1.6, 2.8, 3.8],
      },
    ];

    this.currentPreset = this.presets[0];
    this.gainsWhenDisabled = [];
  }

  connect(source, destination) {
    let node = source.connect(this.lowshelf.node);
    this.peakingFilterArray.forEach(
      (peaking) => (node = node.connect(peaking.node))
    );
    node.connect(this.highshelf.node).connect(destination);
  }

  disconnect() {
    this.lowshelf.node.disconnect();
    this.peakingFilterArray.forEach((peaking) => peaking.node.disconnect());
    this.highshelf.node.disconnect();
  }

  getFilters() {
    return this.filterArray;
  }

  getFilter(index) {
    return this.filterArray[index];
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
        filter.setGain(gain);
      });
      this.enabled = true;
    }
  }

  disable() {
    if (this.enabled) {
      this.gainsWhenDisabled = this.filterArray.map((filter) => filter.gain);
      this.filterArray.forEach((filter) => {
        filter.setGain(0);
        filter.disable();
      });
      this.enabled = false;
    }
  }

  setEnabled(enabled) {
    if (enabled) this.enable();
    else this.disable();
  }

  reset() {
    if (this.enabled) {
      const custom = this.getPreset("custom");
      custom.gains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  }

  getPreset(key) {
    key = key.toLowerCase();
    return this.presets.filter((preset) => preset.key === key)[0];
  }

  getCurrentPreset() {
    return this.currentPreset;
  }

  setCurrentPreset(key) {
    if (this.enabled) {
      const preset = this.getPreset(key);
      this.filterArray.forEach((filter, i) => filter.setGain(preset.gains[i]));
      this.currentPreset = preset;
    }
  }

  commitCustomPreset() {
    if (this.enabled) {
      const custom = this.getPreset("custom");
      custom.gains = this.filterArray.map((filter) => filter.gain);
    }
  }

  isEnabled() {
    return this.enabled;
  }
}
