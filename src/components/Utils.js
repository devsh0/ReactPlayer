import {MediaResource} from "./Session";

// Fixme: media files will still be loaded if they were previously loaded.
//  Session would reject including such files in the playlist and we'll end up
//  with hanging resources that cannot be referenced.
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
                if (index < files.length) {
                    // Load next audio.
                    element.src = URL.createObjectURL(files[index]);
                } else {
                    console.log('All files loaded!');
                    resolve(mediaResources);
                }
            }
        })
    })

    element.src = URL.createObjectURL(files[index]);
    return promise;
}

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