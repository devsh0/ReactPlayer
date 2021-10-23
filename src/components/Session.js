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
        console.log('Cleaning up resources for ' + this.name);
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
    constructor(element, onSessionUpdate, triggerPlay, triggerPlaybackReset) {
        this._element = element;
        this._currentMedia = null;
        this._shuffle = false;
        this._loop = false;
        this._repeat = false;
        this._playlist = [];
        this.onSessionUpdate = onSessionUpdate;
        this.triggerPlay = triggerPlay;
        this.triggerPlaybackReset = triggerPlaybackReset;
    }

    playlistEmpty() {
        return this.playlist.length === 0;
    }

    enqueueMedia(media) {
        const exists = this.playlist.some(m => m.id === media.id);
        const queueable = !exists && (media instanceof MediaResource);
        if (queueable)
            this.playlist.push(media);
        if (!this.currentMedia)
            this.currentMedia = media;
        this.onSessionUpdate();
    }

    dequeueMedia(media) {
        media.dispose();
        this._playlist = this.playlist.filter(m => m.id !== media.id);
        if (media.equals(this.currentMedia)) {
            this._currentMedia = null;
            this.triggerPlaybackReset();
        }
        this.onSessionUpdate();
    }

    get playlist() {
        return this._playlist;
    }

    get loop() {
        return this._loop;
    }

    enableLoop() {
        console.log('Enabling loop');
        this._loop = true;
        this.onSessionUpdate();
    }

    disableLoop() {
        console.log('Disabling loop');
        this._loop = false;
        this.onSessionUpdate();
    }

    get shuffle() {
        return this._shuffle;
    }

    enableShuffle() {
        console.log('Enabling shuffle');
        this._shuffle = true;
        this.onSessionUpdate();
    }

    disableShuffle() {
        console.log('Disabling shuffle');
        this._shuffle = false;
        this.onSessionUpdate();
    }

    toggleShuffle() {
        if (this.shuffle) {
            this.disableShuffle();
        } else this.enableShuffle();
    }

    get repeat() {
        return this._repeat;
    }

    playlistExhausted() {
        let exhausted = true;
        this.playlist.filter(media => exhausted = exhausted && media.played)
        return exhausted;
    }

    enableRepeat() {
        console.log('Enabling repeat');
        this._repeat = true;
        this.onSessionUpdate();
    }

    disableRepeat() {
        console.log('Disabling repeat');
        this._repeat = false;
        this.onSessionUpdate();
    }

    toggleLoop() {
        if (!this.loop && !this.repeat) {
            this.enableLoop();
            return;
        }

        if (this.repeat) {
            this.disableRepeat();
            this.disableLoop();
            return;
        }

        if (this.loop) {
            this.disableLoop();
            this.enableRepeat();
        }
    }

    get currentMedia() {
        return this._currentMedia;
    }

    set currentMedia(media) {
        if (!this._element) return;
        this._currentMedia = media;
        this._element.src = media.object;
        this.markPlayed(this.currentMedia);
        this.onSessionUpdate();
    }

    markAllUnplayed() {
        this.playlist.forEach(media => this.markUnplayed(media));
        this.onSessionUpdate();
    }

    getIndexOfCurrentMedia() {
        for (let i = 0; i < this.playlist.length; i++) {
            const media = this.playlist[i];
            if (media.equals(this.currentMedia))
                return i;
        }
        return -1;
    }

    loadNext() {
        if (this.playlistEmpty())
            return;

        let index = this.getIndexOfCurrentMedia();
        index = index >= 0 ? index : 0;
        index = (index + 1) % this.playlist.length;
        this.currentMedia = this.playlist[index];
    }

    loadPrev() {
        if (this.playlistEmpty())
            return;

        let index = this.getIndexOfCurrentMedia();
        index = index >= 0 ? index : 0;
        index = (index === 0 ? this.playlist.length : index) - 1;
        this.currentMedia = this.playlist[index];
    }

    loadAuto() {
        if (this.repeat) {
            this.currentMedia = this.currentMedia;
            return;
        }

        if (this.shuffle) {
            let unplayed = this.playlist.filter(media => !(media.played));
            const randomIndex = Math.floor(Math.random() * unplayed.length)
            this.currentMedia = unplayed[randomIndex];
            return;
        }

        this.loadNext();
    }

    handleAudioEnded() {
        if (!this.playlistExhausted()) {
            this.loadAuto();
            this.triggerPlay();
        } else {
            if (this.repeat) {
                this.loadAuto();
                this.triggerPlay();
                return;
            }
            if (this.loop) {
                this.markAllUnplayed();
                this.handleAudioEnded();
                return;
            }

            this._currentMedia = null;
            this.triggerPlaybackReset();
        }
    }

    handleAudioSelected(media) {
        this.markAllUnplayed();
        this.currentMedia = media;
        this.triggerPlay();
    }

    markPlayed(media) {
        media.markPlayed();
        this.onSessionUpdate();
    }

    markUnplayed(media) {
        media.markUnplayed();
        this.onSessionUpdate();
    }

    canPlay() {
        return this.currentMedia !== null;
    }

    reset() {
        this._currentMedia = null;
        this.playlist.forEach(media => media.dispose());
        this.triggerPlaybackReset();
        this._playlist = [];
        this.onSessionUpdate();
    }
}
