namespace engine {

    export type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[]
    }
    export type MovieClipFrameData = {
        "image": string
    }

    export enum TouchType {
        TOUCH_TAP,
        TOUCH_MOVE,
        TOUCH_DRAG
    }

    export interface Drawable {

        update();
    }

    export abstract class DisplayObject implements Drawable {

        type = "DisplayObject";

        x: number = 0;
        y: number = 0;
        scaleX: number = 1;
        scaleY: number = 1;
        rotation: number = 0;
        width: number = 100;
        height: number = 100;
        relativeAlpha: number = 1;
        globalAlpha: number = 1;
        relativeMatrix: Matrix;
        globalMatrix: Matrix;

        parent: DisplayObject;

        touchEnabled: boolean = false;

        constructor(type: string) {
            this.type = type;
            this.relativeMatrix = new Matrix();
            this.globalMatrix = new Matrix();
        }
        update() {
            this.relativeMatrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
            if (this.parent) {
                this.globalMatrix = matrixAppendMatrix(this.relativeMatrix, this.parent.globalMatrix);
            }
            else {
                this.globalMatrix = this.relativeMatrix;
            }
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.relativeAlpha;
            }
            else {
                this.globalAlpha = this.relativeAlpha;
            }
        }
        //捕获冒泡机制
        //消息机制
        //模板方法方式
        // draw(context: CanvasRenderingContext2D) {
        //     var localMat: Matrix = new Matrix;
        //     localMat.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);
        //     if (this.parent) {
        //         this.globalAlpha = this.parent.globalAlpha * this.localAlpha;
        //         this.globalMat = matrixAppendMatrix(localMat, this.parent.globalMat);
        //     } else {
        //         this.globalAlpha = this.localAlpha;
        //         this.globalMat = localMat;
        //     }
        //     context.save();
        //     context.globalAlpha = this.globalAlpha;
        //     context.setTransform(this.globalMat.a, this.globalMat.b, this.globalMat.c, this.globalMat.d, this.globalMat.tx, this.globalMat.ty);
        //     this.render(context);
        //     context.restore();
        // }


        abstract hitTest(x, y): DisplayObject;

        touchType: TouchType[] = [];
        function: Function[] = [];
        useCapture: boolean[] = [];
        isMouseDown: boolean = false;

        addEventListener(_type: TouchType, listener: (e: MouseEvent) => void, _useCapture?: boolean) {
            this.touchType.push(_type);
            this.function.push(listener);
            this.useCapture.push(_useCapture);
        }

        dispatchEvent(e: any) {
            //console.log(e.type);
            if (e.type == "mousedown") {
                this.isMouseDown = true;
            } else if (e.type == "mouseup" && this.isMouseDown == true) {
                for (let i = 0; i < this.type.length; i++) {
                    if (this.touchType[i] == TouchType.TOUCH_TAP) {
                        this.function[i](e);
                    }
                }
                this.isMouseDown = false;
            } else if (e.type == "mousemove") {
                for (let i = 0; i < this.type.length; i++) {
                    if (this.touchType[i] == TouchType.TOUCH_MOVE) {
                        this.function[i](e);
                    }
                }
            }
        }
    }

    export class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[] = [];

        constructor() {
            super("DisplayObjectContainer");
        }
        //render
        // render(context: CanvasRenderingContext2D) {

        //     for (let drawable of this.array) {
        //         drawable.draw(context);
        //     }
        // }

        update() {
            super.update();
            for (let drawable of this.children) {
                drawable.update();
            }
        }

        addChild(obj: DisplayObject) {
            obj.parent = this;
            this.children.push(obj);
        }

        removeChild(obj: DisplayObject) {
            obj.parent = null;
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i] == obj) {
                    this.children[i] = null;
                }
            }
        }

        hitTest(x, y) {
            //console.log(this+" children length: "+this.children.length);
            if (this.useCapture[0] == true) {/////////////////////////////////////////////
                return this;
            }
            for (let i = this.children.length - 1; i >= 0; i--) {
                let child = this.children[i];
                let point = new Point(x, y);
                let invertChildGlobalMatrix = invertMatrix(child.globalMatrix);
                let pointBaseOnChild = pointAppendMatrix(point, invertChildGlobalMatrix);//stage不能动 其他container可以
                if (child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y)) {
                    return child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);
                }
            }
            if (this.touchEnabled) {
                return this;//所有child都没有点到就返回container
            }
        }
    }

    var fonts = {

        "name": "Arial",
        "font": {
            "A": [0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
            "B": []
        }

    }

    export class TextField extends DisplayObject {

        text: string = "";
        parent: DisplayObjectContainer;
        textColor: string;

        private _measureTextWidth: number = 0;

        constructor() {
            super("TextField");
        }

        // render(context: CanvasRenderingContext2D) {
        //     context.fillStyle = this.textColor;
        //     context.fillText(this.text, 0, 0);
        //     context.fillStyle = null;//unsure
        //     this._measureTextWidth = context.measureText(this.text).width;
        // }

        hitTest(x: number, y: number) {
            var rect = new Rectangle();
            rect.y = -10
            rect.width = 7 * this.text.length;
            rect.height = 10;
            if (rect.isPointInRectangle(new Point(x, y)) && this.touchEnabled) {
                return this;
            } else {
                return null;
            }
        }
    }

    export class Shape extends DisplayObjectContainer {
        graphics: Graphics = new Graphics("Graphics");

        constructor() {
            super();
        }

    }

    export class Graphics extends DisplayObject {

        fillColor = "#000000";
        alpha = 1;
        globalAlpha = 1;
        strokeColor = "#000000";
        lineWidth = 1;
        lineColor = "#000000";
        x: number = 0;
        y: number = 0;
        width: number = 100;
        height: number = 100;
        context: CanvasRenderingContext2D;

        // render(context2D: CanvasRenderingContext2D) {
        //     this.context = context2D;
        //     context2D.globalAlpha = this.alpha;
        //     context2D.fillStyle = this.fillColor;
        //     context2D.fillRect(this.x, this.y, this.width, this.height);
        //     context2D.fill();
        // }

        hitTest(x: number, y: number) {
            let rect = new engine.Rectangle();
            rect.width = this.width;
            rect.height = this.height;
            let result = rect.isPointInRectangle(new engine.Point(x, y));
            //console.log("bitmap", rect.height, rect.width, x, y);
            if (result) {
                return this;
            }
            else {
                return null;
            }
        }

        beginFill(color, alpha) {
            this.fillColor = color;
            this.alpha = alpha;
        }

        endFill() {
            this.fillColor = "#000000";
            this.alpha = 1;
        }

        drawRect(x1, y1, x2, y2) {
            this.x = x1;
            this.y = y1;
            this.width = x2;
            this.height = y2;
        }

        clear() {
            // this.context.clearRect(this.x, this.y, this.width, this.height);
            console.log("clear")
        }
    }

    export class Bitmap extends DisplayObject {

        img = new Image();
        parent: DisplayObjectContainer;

        constructor() {
            super("Bitmap");
        }

        // render(context: CanvasRenderingContext2D) {
        //     context.drawImage(this.img, 0, 0, this.width, this.height);
        // }

        hitTest(x: number, y: number) {
            if (this.img) {
                let rect = new Rectangle();
                rect.x = rect.y = 0;
                rect.width = this.img.width;
                rect.height = this.img.height;
                if (rect.isPointInRectangle(new Point(x, y)) && this.touchEnabled) {
                    return this;
                } else {
                    return null;
                }
            }
        }
    }

    export class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 10;

        private currentFrameIndex: number;

        private data: MovieClipData;

        constructor(data: MovieClipData) {
            super();
            this.setMovieClipData(data);
            this.play();
        }

        ticker = (deltaTime) => {
            // this.removeChild();
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            let frameData = data.frames[this.currentFrameIndex];
            let url = frameData.image;
        }

        play() {
            Ticker.getInstance().register(this.ticker);
        }

        stop() {
            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;
            // 创建 / 更新 

        }
    }
}