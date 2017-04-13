declare namespace engine {
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInRectangle(point: Point): boolean;
    }
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    function isInRange(min: number, testNum: number, max: number): boolean;
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    enum TouchType {
        TOUCH_TAP = 0,
        TOUCH_MOVE = 1,
        TOUCH_DRAG = 2,
    }
    interface Drawable {
        update(): any;
    }
    abstract class DisplayObject implements Drawable {
        type: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        width: number;
        height: number;
        relativeAlpha: number;
        globalAlpha: number;
        relativeMatrix: Matrix;
        globalMatrix: Matrix;
        parent: DisplayObject;
        touchEnabled: boolean;
        constructor(type: string);
        update(): void;
        abstract hitTest(x: any, y: any): DisplayObject;
        touchType: TouchType[];
        function: Function[];
        useCapture: boolean[];
        isMouseDown: boolean;
        addEventListener(_type: TouchType, listener: (e: MouseEvent) => void, _useCapture?: boolean): void;
        dispatchEvent(e: any): void;
    }
    class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[];
        constructor();
        update(): void;
        addChild(obj: DisplayObject): void;
        removeChild(obj: DisplayObject): void;
        hitTest(x: any, y: any): any;
    }
    class TextField extends DisplayObject {
        text: string;
        parent: DisplayObjectContainer;
        textColor: string;
        private _measureTextWidth;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class Shape extends DisplayObjectContainer {
        graphics: Graphics;
        constructor();
    }
    class Graphics extends DisplayObject {
        fillColor: string;
        alpha: number;
        globalAlpha: number;
        strokeColor: string;
        lineWidth: number;
        lineColor: string;
        x: number;
        y: number;
        width: number;
        height: number;
        context: CanvasRenderingContext2D;
        hitTest(x: number, y: number): this;
        beginFill(color: any, alpha: any): void;
        endFill(): void;
        drawRect(x1: any, y1: any, x2: any, y2: any): void;
        clear(): void;
    }
    class Bitmap extends DisplayObject {
        img: HTMLImageElement;
        parent: DisplayObjectContainer;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private static TOTAL_FRAME;
        private currentFrameIndex;
        private data;
        constructor(data: MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
}
declare namespace engine.res {
    interface Processor {
        load(url: string, callback: Function): void;
    }
    class ImageProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    class TextProcessor implements Processor {
        load(url: string, callback: Function): void;
    }
    function mapTypeSelector(typeSelector: (url: string) => string): void;
    function load(url: string, callback: (data: any) => void): void;
    function get(url: string): any;
    function map(type: string, processor: Processor): void;
}
declare namespace engine.res {
    function loadConfig(): void;
    function loadRes(name: any): void;
    function getRes(name: string): any;
    class ImageResource {
        private url;
        constructor(name: string);
        load(): void;
        bitmapData: HTMLImageElement;
        width: number;
        height: number;
    }
}
declare namespace engine {
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
