import {MediaResource} from "./Session";

// Fixme: media files would still be loaded if they have been previously loaded.
//  Session would reject including such media files into the playlist and we'll end
//  up with dangling resources.
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