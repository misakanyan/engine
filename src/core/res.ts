namespace engine.res {



    export interface Processor {

        load(url: string, callback: Function): void;

    }

    export class ImageProcessor implements Processor {

        load(url: string, callback: Function) {
            let image = document.createElement("img");
            image.src = url;
            image.onload = () => {
                callback();
            }
        }
    }

    export class TextProcessor implements Processor {
        load(url: string, callback: Function) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url);
            xhr.send();
            xhr.onload = () => {
                callback(xhr.responseText);
            }
        }
    }

    export function mapTypeSelector(typeSelector: (url: string) => string) {
        getTypeByURL = typeSelector;
    }

    var cache = {};

    export function load(url: string, callback: (data: any) => void) {
        let type = getTypeByURL(url);
        let processor = createProcessor(type);
        if (processor != null) {
            processor.load(url, (data) => {
                cache[url] = data;
                callback(data);
            });
        }
    }

    export function get(url: string): any {
        return cache[url];
    }

    var getTypeByURL = (url: string): string => {
        if (url.indexOf(".jpg") >= 0) {
            return "image";
        }
        else if (url.indexOf(".mp3") >= 0) {
            return "sound";
        }
        else if (url.indexOf(".json") >= 0) {
            return "text";
        }
    }

    let hashMap = {
        "image": new ImageProcessor(),
        "text": new TextProcessor()
    }
    function createProcessor(type: string) {
        let processor: Processor = hashMap[type];
        return processor;
    }

    export function map(type: string, processor: Processor) {
        hashMap[type] = processor;
    }
}

//  class SoundProcessor implements Processor {
//         load(url: string, callback: Function) { }
//     }
//     mapTypeSelector((url) => {
//         return "image";
//     })
//     map("sound", new SoundProcessor())

//     load("1.mp3", () => {

//     })