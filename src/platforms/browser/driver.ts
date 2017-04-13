namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let lastNow = Date.now();
        let renderer = new CanvasRenderer(stage, context2D);
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update();
            renderer.render();
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

        //鼠标点击
    window.onmousedown = (e) => {//onclick buyong youwenti  buyaoyong
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mousedown";//mousemove
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        console.log("x:"+x+"y"+y);
        console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }
    window.onmousemove = (e) => {
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mousemove";
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        //console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }

    window.onmouseup = e => {
        let x = e.offsetX;
        let y = e.offsetY;
        let type = "mouseup";
        let target: DisplayObject = stage.hitTest(x, y);
        let result = target;
        //console.log(result)
        if (result) {
            result.dispatchEvent(e);
            while (result.parent) {
                let currentTarget = result.parent;
                let e = { type, target, currentTarget };
                result = result.parent;
                result.dispatchEvent(e);
            }
        }
    }
        return stage;
    }

    class CanvasRenderer {

        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.children) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
            this.context2D.drawImage(bitmap.img, 0, 0);
        }

        renderTextField(textField: TextField) {

        }
    }
}