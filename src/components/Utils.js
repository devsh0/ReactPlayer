import {MediaResource} from "./Session";

// Fixme: media files will be loaded into memory even if they were previously loaded.
//  Session would reject including such files in the playlist if they already are in the
//  playlist and we'll end up with hanging resources that cannot be referenced.
export function fileToMediaResource(files) {
    const element = new Audio();
    const mediaResources = [];
    let index = 0;

    const promise = new Promise((resolve) => {
        element.addEventListener('loadedmetadata', () => {
            if (index < files.length) {
                const file = files[index];
                const object = URL.createObjectURL(file);
                const media = new MediaResource(object, file.name, element.duration)
                mediaResources.push(media);
                index += 1;
                // This second check can probably be eliminated. Just tryin not to be too fancy :^)
                if (index < files.length)
                    element.src = URL.createObjectURL(files[index]);
                else {
                    console.log('All files loaded!');
                    resolve(mediaResources);
                }
            }
        })
    })

    element.src = URL.createObjectURL(files[index]);
    return promise;
}

// Fixme: Hours...huh?
export function getFormattedMediaTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const minuteString = minutes < 10 ? `0${minutes}` : minutes + '';
    const secondString = seconds < 10 ? `0${seconds}` : seconds + '';
    return `${minuteString}:${secondString}`;
}

export function getFormattedMediaName(name) {
    name = name[0].toUpperCase() + name.slice(1);
    name = name.length > 40 ? name.slice(0, 40) + '...' : name;
    return name;
}

// Slower than grandma but who cares..?!
export function filterMedia(key, mediaNames) {
    key = key.trim().toLowerCase();
    if (!key) {
        let i = 0;
        return mediaNames.map(_ => {
            return {index: i++, matchIndices: []};
        });
    }

    const matches = [];
    for (let i = 0; i < mediaNames.length; i++) {
        let name = mediaNames[i].toLowerCase();
        const matchIndices = [];
        while (name.length < key.length)
            name += '$';

        for (let j = 0; j <= name.length - key.length; j++) {
            const piece = name.slice(j, j + key.length);
            if (piece === key) {
                // We aren't really using these indices though.
                matchIndices.push({
                    start: j,
                    end: j + key.length
                })
            }
        }

        if (matchIndices.length > 0) {
            matches.push({
                index: i,
                matchIndices: matchIndices
            })
        }
    }

    return matches;
}