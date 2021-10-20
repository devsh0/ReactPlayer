export class AudioFile {
    constructor(object, name, duration) {
        this._object = object;
        this._name = name;
        this._duration = duration;
    }

    get object() {
        return this._object;
    }

    get name() {
        return this._name;
    }

    get duration() {
        return this._duration;
    }

    dump() {
        console.log(JSON.stringify(this));
    }
}

