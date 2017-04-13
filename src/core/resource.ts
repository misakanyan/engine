namespace engine.res {

    var __cache = {};

    export function loadConfig() {

    }

    export function loadRes(name) {
        var resource = getRes(name);
        resource.load();
    }

    export function getRes(name: string) {
        if (__cache[name]) {
            return __cache[name]
        }
        else {
            __cache[name] = new ImageResource(name);
            return __cache[name];
        }
    }

    export class ImageResource {

        private url: string;
        constructor(name: string) {
            this.bitmapData = document.createElement("img");
            this.bitmapData.src = "loading.png";
        }

        public load() {
            var realResource = document.createElement("img");
            realResource.src = this.url;
            realResource.onload = () => {
                this.bitmapData = realResource;
            }
        }
        bitmapData: HTMLImageElement;

        width: number;

        height: number;


    }


}