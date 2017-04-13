// //配置不用数组
// let movieClipData={
//     name:"hero",
//     frame:{
//         "1":{"image":"1.jpg"}

//     }
// }

namespace engine {

    export type Ticker_Listener_Type = (deltaTime: number) => void;

    export class Ticker {

        private static instance: Ticker;

        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }

        listeners: Ticker_Listener_Type[] = [];

        register(listener: Ticker_Listener_Type) {
            this.listeners.push(listener);
        }

        unregister(listener: Ticker_Listener_Type) {

        }

        notify(deltaTime: number) {
            for (let listener of this.listeners) {
                listener(deltaTime);
            }
        }
    }
}