export class MediaResource {
    constructor(object, name, duration) {
        this._object = object;
        this._name = name;
        this._duration = duration;
        this._played = false;
        this._id = MediaResource.getIdForName(name);
    }

    get id() {
        return this._id;
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

    get played() {
        return this._played;
    }

    equals(other) {
        if (!(other instanceof MediaResource))
            return false;
        return this.id === other.id;
    }

    dump() {
        console.log(JSON.stringify(this));
    }

    dispose() {
        URL.revokeObjectURL(this._object);
    }

    markPlayed() {
        this._played = true;
    }

    markUnplayed() {
        this._played = false;
    }

    static getIdForName(name) {
        return name.trim().toLowerCase();
    }
}

export default class Session {
    constructor(element) {
        this._element = element;
        this._currentMedia = null;
        this._shuffle = false;
        this._loop = false;
        this._repeat = false;
        this._playlist = [];
    }

    playlistEmpty() {
        return this._playlist.length === 0;
    }

    findMediaById(id) {
        return this._playlist.find(media => media.id === id);
    }

    set element(element) {
        if (element instanceof HTMLAudioElement) {
            this._element = element;
        } else {
            console.warn('Attempted setting session audio element that is not an HTMLAudioElement');
        }
    }

    enqueueMedia(media) {
        const exists = this._playlist.some(m => m.id === media.id);
        const valid = !exists && (media instanceof MediaResource);
        if (valid) this._playlist.push(media);
    }

    dequeueMediaById(id) {
        // todo: dequeue media might trigger a playback change.
        const media = this.findMediaById(id);
        if (media) {
            media.dispose();
            this._playlist = this._playlist.filter(m => m.id !== media.id);
        }
    }

    dequeueMedia(media) {
        this.dequeueMediaById(media.id);
    }

    get playlist() {
        return this._playlist;
    }

    get loop() {
        return this._loop;
    }

    enableLoop() {
        this._loop = true;
    }

    disableLoop() {
        this._loop = false;
    }

    get shuffle() {
        return this._shuffle;
    }

    enableShuffle() {
        this._shuffle = true;
    }

    disableShuffle() {
        this._shuffle = false;
    }

    get repeat() {
        return this._repeat;
    }

    enableRepeat() {
        this.markUnplayed(this._currentMedia.name);
        this._repeat = true;
    }

    disableRepeat() {
        this.markPlayed(this._currentMedia.name);
        this._repeat = false;
    }

    // Not meant to be called from outside of this class.
    setCurrentMedia(media) {
        if (!this._element) return;
        this._currentMedia = media;
        this._element.src = media.object;
        this._currentMedia.markPlayed();
    }

    markAllUnplayed() {
        this._playlist.forEach(media => this.markUnplayed(media.name));
    }

    getIndexOfCurrentMedia() {
        for (let i = 0; i < this._playlist.length; i++) {
            const media = this._playlist[i];
            if (media.equals(this._currentMedia))
                return i;
        }
        return -1;
    }

    loadNext() {
        if (this.playlistEmpty())
            return;

        let index = this.getIndexOfCurrentMedia();
        index = index >= 0 ? index : 0;
        index = (index + 1) % this._playlist.length;
        this.setCurrentMedia(this._playlist[index]);
    }

    loadPrev() {
        if (this.playlistEmpty())
            return;

        let index = this.getIndexOfCurrentMedia();
        index = index >= 0 ? index : 0;
        index = (index === 0 ? this._playlist.length : index) - 1;
        this.setCurrentMedia(this._playlist[index]);
    }

    loadAuto() {
        let unplayed = this._playlist.filter(media => !media.played);
        if (unplayed.length === 0) {
            // No unplayed media left. Test if looping is enabled.
            if (this.loop) {
                this.markAllUnplayed();
                this.playAuto();
                return;
            }
        }

        const index = Math.floor(this.shuffle ? Math.random() * unplayed.length : 0);
        this.setCurrentMedia(unplayed[index]);
    }

    markPlayed(name) {
        const id = MediaResource.getIdForName(name);
        const media = this.findMediaById(id);
        if (media)
            media.markPlayed();
    }

    markUnplayed(name) {
        const id = MediaResource.getIdForName(name);
        const media = this.findMediaById(id);
        if (media)
            media.markUnplayed();
    }

    reset() {
        this._currentMedia = null;
        this._playlist.forEach(media => media.dispose());
        this._playlist = [];
        this.disableShuffle();
        this.disableRepeat();
        this.disableLoop();
    }
}
