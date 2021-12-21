// BalderJS
// version 3.0 (2022-01-) 
// Mattias Steinwall
// Baldergymnasiet, Skellefteå, Sweden


// preload vs preloadImage, preloadsound
// behövs ens preloadImage nu?

// createIndexFrames baserat på setFrames?
// setFrames direkt i konstruktorn?
// behövs den senare? nej va?

// ta bort style överallt. byt tillbaka till color? Jo enklare! Går ändp skapa avanacerat

// cell.color enklare än style?

// placeDiv() - "north", "south", "west"    Ev 3.1?
// - flexDirection ? "row", "column", Nej

// kolla scale - avrundingsfel 3.1


// addSVG i div?

// Vector2D - Martins (och Felix´) exempel på en inspirationssida!!!!
// vector - scale? vs multiplyScalar vs multiply

// Alla exempel på github? Eller skelamp?
// API på github

// Turtle - fill() (eller -path) 3.1?

// Cell inner class?

// record vs index signatures

// kolla pixel() - bort? 3.1?



//
// Initialize
//

export let W: number;
export let H: number;
export let ctx: CanvasRenderingContext2D;

const _lbltags = ["input", "meter", "output", "progress", "select", "textarea"] as const;
type _LabelableTag = (typeof _lbltags)[number];
const _bgcolor = getComputedStyle(document.body).getPropertyValue("background-color");
const _color = getComputedStyle(document.body).getPropertyValue("color");

let _scaleX = 1;
let _scaleY = 1;

const _codes = new Set<string>();
const _keyboard: { [key: string]: boolean | null } = {};
const _mouse: { [key: string]: boolean | null } = {};
let _touched: boolean | null = null;

class BalderCanvas extends HTMLCanvasElement {
    constructor() {
        super();

        this.addEventListener("keydown", event => {
            event.preventDefault();
            _key = event.key;

            if (_keyboard[event.code] !== false) {
                _keyboard[event.code] = true;
                _codes.add(event.code);
            }
        });

        this.addEventListener("keyup", event => {
            _key = null;
            _keyboard[event.code] = null;
            _codes.delete(event.code);
        });

        this.addEventListener("mousedown", event => {
            event.preventDefault();
            canvas.focus();

            if (_mouse[event.button] !== false) {
                _mouse[event.button] = true;
            }
        });

        this.addEventListener("mouseup", event => {
            _mouse[event.button] = null;
        });

        this.addEventListener("mousemove", event => {
            const rect = canvas.getBoundingClientRect();

            mouse.x = (event.clientX - rect.left) * _scaleX;
            mouse.y = (event.clientY - rect.top) * _scaleY;
            mouse.over = true;
        });

        this.addEventListener("mouseout", () => {
            mouse.over = false;
            _mouse[0] = _mouse[1] = _mouse[2] = null;
        });

        this.addEventListener("contextmenu", event => {
            event.preventDefault();
        });

        function touchHandler(event: TouchEvent) {
            event.preventDefault();
            canvas.focus();

            const rect = canvas.getBoundingClientRect();
            touchscreen.touches = [];

            if (_touched !== false) {
                _touched = null;

                for (let i = 0; i < event.touches.length; i++) {
                    touchscreen.touches[i] = {
                        x: event.touches[i].clientX - rect.left,
                        y: event.touches[i].clientY - rect.top,
                        id: event.touches[i].identifier
                    };

                    if (i === 0) {
                        _touched = true;
                        touchscreen.x = touchscreen.touches[0].x;
                        touchscreen.y = touchscreen.touches[0].y;
                    }
                }

                return;
            }

            if (event.touches.length === 0) {
                _touched = null;
            }
        }

        this.addEventListener("touchstart", touchHandler);
        this.addEventListener("touchend", touchHandler);
        this.addEventListener("touchmove", touchHandler);

        this.addEventListener("blur", () => {
            for (const code of _codes) {
                _keyboard[code] = null;
            }

            _key = null;
            _codes.clear();
            _touched = null;
        })

        ctx = this.getContext("2d")!;
        ctx.strokeStyle = _color;
        ctx.fillStyle = _color;

        this.tabIndex = 0;
    }

    connectedCallback() {
        W = parseInt(getComputedStyle(this).width);
        H = parseInt(getComputedStyle(this).height);
        canvas = this;
    }
}

customElements.define('balder-canvas', BalderCanvas, { extends: 'canvas' });

export let canvas: BalderCanvas;     // 3.0

const _initUpdateables: any[] = [];
let _update = () => { };

export function setUpdate(handler = () => { }) {
    _update = handler;
}

function _updateHandler() {
    for (let iu of _initUpdateables) {
        iu.initUpdate();
    }

    _update();
    requestAnimationFrame(_updateHandler);
}

_updateHandler();

let _key: string | null;

let _errNr = 0;
let _errorElt: HTMLOutputElement | null;

window.onerror = (message) => {
    if (!_errorElt) {
        _errorElt = add("output", document.body);
    }

    _errorElt.value = `(#${++_errNr}) ${String(message)}`;
    _errorElt.style.color = "white";
    _errorElt.style.backgroundColor = "red";
    _errorElt.style.position = "fixed";
    _errorElt.style.bottom = "0";
    _errorElt.style.left = "0";
    _errorElt.style.width = "100%";
    _errorElt.style.zIndex = "2147483647";
    _errorElt.focus();

    _errorElt.onclick = () => {
        _errorElt?.remove();
        _errorElt = null;
    }
};

window.addEventListener("unhandledrejection", event => {        // ?
    throw event.reason;
});

export function resetCanvas() {
    _scaleX = 1;
    _scaleY = 1;

    let W0 = parseInt(getComputedStyle(canvas).width);
    let H0 = parseInt(getComputedStyle(canvas).height);

    canvas.width = 0;
    canvas.height = 0;

    let W1 = parseInt(getComputedStyle(canvas).width);
    let H1 = parseInt(getComputedStyle(canvas).height);

    W = W1 > 0 ? W1 : W0;
    H = H1 > 0 ? H1 : H0;

    canvas.width = W;
    canvas.height = H;
}

window.addEventListener("resize", () => {
    _scaleX = W / canvas.getBoundingClientRect().width;
    _scaleY = H / canvas.getBoundingClientRect().height;
});

let _outputElt: HTMLDivElement | null;
let _inputLines: string[] = [];
let _inputLineIndex = 0;

export async function input(prompt = "Prompt", value?: string): Promise<string> {
    let inputElt = add("input", prompt);
    inputElt.parentElement!.style.display = "block";
    inputElt.parentElement!.style.fontFamily = "monospace";
    inputElt.style.fontFamily = "inherit";
    inputElt.style.backgroundColor = "inherit";
    inputElt.style.color = "inherit";

    inputElt.style.boxSizing = "border-box";
    inputElt.style.width = "100%";

    if (value) {
        inputElt.value = value;
        inputElt.select();
    }

    inputElt.focus();    // 3.0? 

    return await new Promise<string>((resolve) => {
        let line = _inputLines[_inputLineIndex++];
        if (line) {
            resolve(line);
            inputElt.value = line;
            inputElt.readOnly = true;
            return;
        }

        inputElt.addEventListener("keydown", event => {
            if (event.code == "Enter") {
                event.preventDefault();
                resolve(inputElt.value);
                inputElt.setSelectionRange(0, 0);
                inputElt.disabled = true;
            }
        })
    }).catch(() => { throw new Error() })       // reject?
}

let _outputValue = "";      // 2.01

export function output(...values: any[]): void;
export function output(...args: [...values: any[], end: " "]): void;
export function output(...args: any[]) {
    if (!_outputElt) {
        _outputElt = add("div");
        _outputElt.style.fontFamily = "monospace";
        _outputElt.style.whiteSpace = "pre-wrap";
        _outputElt.style.wordWrap = "break-word";
    }

    if (args.length > 1 && /^\s*$/.test(args[args.length - 1])) {
        _outputElt.textContent += args.slice(0, -1).map(v => str(v)).join(" ");
        _outputElt.textContent += args[args.length - 1];
    } else {
        _outputElt.textContent += args.map(v => str(v)).join(" ");
        _outputElt.textContent += "\n";
    }
}

export function str(value: any): string {
    if (typeof value === "object" && value != null && (value.toString === Object.prototype.toString || value.toString === Array.prototype.toString)) {
        if (typeof value[Symbol.iterator] === "function") {
            value = Array.from(value);
        }

        try { return JSON.stringify(value); } catch { }
    }

    return String(value);
}

const params = new URL(location.href).searchParams;
const iParam = params.get("i");        // input

if (iParam != null) {
    _inputLines = decodeURIComponent(iParam).split("\n");
}


//
// Load
//

window.addEventListener("load", () => {
    const oParam = params.get("o");        // output

    if (oParam != null) {
        const resp = add("div");
        resp.style.fontFamily = "monospace";
        resp.style.whiteSpace = "pre-wrap";
        resp.style.wordWrap = "break-word";
        resp.style.color = "black";

        const oValue = decodeURIComponent(oParam);
        _outputValue = _outputValue.trimEnd();

        if (_outputValue == oValue) {
            resp.style.backgroundColor = "palegreen";
            resp.textContent = _outputValue;
        } else {
            let offset = 0;
            while (_outputValue[offset] == oValue[offset]) {
                offset++
            }

            resp.style.backgroundColor = "lightsalmon";
            const match = add("span", oValue.slice(0, offset), { parent: resp, newline: false });
            match.style.backgroundColor = "palegreen";
            add("span", oValue.slice(offset), resp);
        }
    }
});


//
// Drawing functions
//

export type Style = string | CanvasGradient | CanvasPattern;

export function pixel(x: number, y: number, color = _color) {           // 3.0 ?
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

export function line(
    x1: number, y1: number,
    x2: number, y2: number,
    style: Style = _color,
    lineWidth = 1
) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = style;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function circle(
    x: number, y: number,
    radius: number,
    // style: Style = _color,
    color = _color,
    lineWidth?: number
) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI)

    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    } else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}

export function rectangle(
    x: number, y: number,
    width: number,
    height: number,
    style: Style = _color,
    lineWidth?: number
) {
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = style;
        ctx.strokeRect(x, y, width, height);
    } else {
        ctx.fillStyle = style;
        ctx.fillRect(x, y, width, height);
    }
}

export function triangle(
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    style: Style = _color,
    lineWidth?: number
) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();

    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = style;
        ctx.stroke();
    } else {
        ctx.fillStyle = style;
        ctx.fill();
    }
}

export function text(
    value: any,
    x = 0, y = 24,
    font: number | string = 24,
    style: Style = _color,
    lineWidth?: number
) {
    if (typeof font == "number") {
        ctx.font = font + "px monospace";
    } else {
        ctx.font = font;
    }

    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = style;
        ctx.strokeText(str(value), x, y);
    } else {
        ctx.fillStyle = style;
        ctx.fillText(str(value), x, y);
    }
}

let _images: any = [];      // Array of Images ?

export async function preloadImage(path: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        if (_images[path] === undefined) {
            _images[path] = new Image();
            _images[path].src = path;

            _images[path].addEventListener("load", () => resolve());

            _images[path].addEventListener("error", () => reject(new Error(`'${path}' can not be loaded`)));
        } else if (_images[path].complete) {
            resolve();
        } else {
            _images[path].addEventListener("load", () => resolve());
        }
    })
}

export async function image(path: string, x = 0, y = 0, width?: number, height = width): Promise<void> {
    await preloadImage(path);

    if (width) {
        ctx.drawImage(_images[path], x, y, width, height!);
    } else {
        ctx.drawImage(_images[path], x, y);
    }
}

export function clear(x = 0, y = 0, width = W, height = H) {
    ctx.clearRect(x, y, width, height);
}

export function fill(style: Style = _bgcolor, x = 0, y = 0, width = W, height = H) {
    ctx.fillStyle = style;
    ctx.fillRect(x, y, width, height);
}

//
// Vector2
// 

export class Vector2 {

    // chaining
    // Vector2D.add()

    constructor(
        public x: number,
        public y: number
    ) {
    }

    static fromPolar(length: number, angle: number): Vector2 {
        return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length)
    }

    public get length() {
        return Math.hypot(this.x, this.y);
    }

    public set length(value: number) {

    }

    public get lengthSquared() {
        return this.x ** 2 + this.y ** 2;
    }

    public get angle() {
        return Math.atan2(this.y, this.x)
    }

    public set angle(value: number) {
        this.x = Math.cos(value);
        this.y = Math.sin(value);
    }

    public add(v: Vector2) {
        this.x += v.x
        this.y += v.y
    }

    public subtract(v: Vector2) {
        this.x -= v.x
        this.y -= v.y
    }

    public multiply(v: Vector2) {

    }

    public divide(v: Vector2) {

    }

    public scalarMultiply(s: number) {
        this.x *= s
        this.y *= s
    }

    // public multiply(scalar: number) {
    //     this.x *= scalar
    //     this.y *= scalar
    // }

    public clone() {
        return new Vector2(this.x, this.y)
    }

    // public getDistance(v: Vector2) {    // To? get? // onödig ? == (subtract, length) nej 

    // }

    static distance(v1: Vector2, v2: Vector2) {
        return 0
    }

    static distanceSquared(v1: Vector2, v2: Vector2) {
        return 0
    }

    // public getDistanceSquared(v: Vector2) {
    //     // distanceSquared
    // }

    public dot(v: Vector2) {

    }

    // public negate() {

    // }

    public normalize() {        // d ?

    }

    // public random() {       // Behövs ej? randomangle, unit vector

    // }

    public rotate(angle: number) {

    }
}


//
// Hitbox
//

export class Hitbox {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {
    }

    intersects(other: Hitbox): boolean {
        return (
            this.x + this.width > other.x &&
            this.x < other.x + other.width &&
            this.y + this.height > other.y &&
            this.y < other.y + other.height
        );
    }

    contains(x: number, y: number): boolean {
        return (
            this.x + this.width > x &&
            this.x <= x &&
            this.y + this.height > y &&
            this.y <= y
        );
    }

    drawOutline(color = _color) {
        rectangle(this.x, this.y, this.width, this.height, color, 1);
    }
}


//
// Sprite
//

export class Sprite extends Hitbox {
    public tag: any = {};
    private index = 0;
    private frames: number[] = [];
    private counter = 0;
    public updatesPerFrame = 10;
    public loop = true;
    [key: number]: string;      // 3.0 

    constructor(
        private path: string,
        private rows = 1,
        private columns = 1
    ) {
        super(0, 0, 0, 0);
        this.setFrames(...range(rows * columns));

        preloadImage(path);
    }

    public async createIndexedImages(): Promise<void> {
        const _frameCanvas = document.createElement("canvas");
        const _frameCtx = _frameCanvas.getContext("2d")!;

        await new Promise<void>((resolve, reject) => {
            const _setIndexes = () => {
                const frameWidth = _images[this.path].width / this.columns;
                const frameHeight = _images[this.path].height / this.rows;

                _frameCanvas.width = frameWidth;
                _frameCanvas.height = frameHeight;

                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.columns; j++) {
                        _frameCtx.drawImage(_images[this.path],
                            j * frameWidth, i * frameHeight, frameWidth, frameHeight,
                            0, 0, frameWidth, frameHeight)
                        this[i * this.columns + j] = _frameCanvas.toDataURL("image/png");
                    }
                }

                resolve()
            }

            if (_images[this.path].complete) {
                _setIndexes();
            } else {
                _images[this.path].addEventListener("load", _setIndexes);
            }
        });
    }

    public setFrames(...value: number[]) {
        this.frames = value;
        this.index = 0;
        this.counter = 0;

        if (value.length > 1 && !_initUpdateables.includes(this)) {
            _initUpdateables.push(this);
        } else if (value.length == 1 && _initUpdateables.includes(this)) {
            _initUpdateables.splice(_initUpdateables.indexOf(this), 1);
        }
    }

    private initUpdate() {
        if (this.counter == (this.updatesPerFrame - 1)) {
            this.index++;
            if (this.index == this.frames.length) {
                if (this.loop) {
                    this.index = 0;
                } else {
                    _initUpdateables.splice(_initUpdateables.indexOf(this), 1);
                }
            }
        }

        this.counter = (this.counter + 1) % this.updatesPerFrame;
    }

    public async draw(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            const draw = () => {
                const frameWidth = _images[this.path].width / this.columns;
                const frameHeight = _images[this.path].height / this.rows;

                if (this.width == 0) this.width = frameWidth;
                if (this.height == 0) this.height = frameHeight;

                const sx = frameWidth * (this.frames[this.index] % this.columns);
                const sy = frameHeight * Math.floor(this.frames[this.index] / this.columns);

                ctx.drawImage(
                    _images[this.path],
                    sx, sy,
                    frameWidth, frameHeight,
                    this.x, this.y,
                    this.width, this.height
                );

                resolve();
            }

            if (_images[this.path].complete) {
                draw();
            } else {
                _images[this.path].addEventListener("load", draw);
            }
        });
    }
}


//
// Keyboard
//

export const keyboard = {
    get shiftLeft() { return !!_keyboard["ShiftLeft"]; }, set shiftLeft(value: boolean) { _keyboard["ShiftLeft"] = value; },
    get shiftRight() { return !!_keyboard["ShiftRight"]; }, set shiftRight(value: boolean) { _keyboard["ShiftRight"] = value; },
    get backspace() { return !!_keyboard["Backspace"]; }, set backspace(value: boolean) { _keyboard["Backspace"] = value; },
    get enter() { return !!_keyboard["Enter"]; }, set enter(value: boolean) { _keyboard["Enter"] = value; },
    get space() { return !!_keyboard["Space"]; }, set space(value: boolean) { _keyboard["Space"] = value; },
    get left() { return !!_keyboard["ArrowLeft"]; }, set left(value: boolean) { _keyboard["ArrowLeft"] = value; },
    get up() { return !!_keyboard["ArrowUp"]; }, set up(value: boolean) { _keyboard["ArrowUp"] = value; },
    get right() { return !!_keyboard["ArrowRight"]; }, set right(value: boolean) { _keyboard["ArrowRight"] = value; },
    get down() { return !!_keyboard["ArrowDown"]; }, set down(value: boolean) { _keyboard["ArrowDown"] = value; },
    get digit0() { return !!_keyboard["Digit0"]; }, set digit0(value: boolean) { _keyboard["Digit0"] = value; },
    get digit1() { return !!_keyboard["Digit1"]; }, set digit1(value: boolean) { _keyboard["Digit1"] = value; },
    get digit2() { return !!_keyboard["Digit2"]; }, set digit2(value: boolean) { _keyboard["Digit2"] = value; },
    get digit3() { return !!_keyboard["Digit3"]; }, set digit3(value: boolean) { _keyboard["Digit3"] = value; },
    get digit4() { return !!_keyboard["Digit4"]; }, set digit4(value: boolean) { _keyboard["Digit4"] = value; },
    get digit5() { return !!_keyboard["Digit5"]; }, set digit5(value: boolean) { _keyboard["Digit5"] = value; },
    get digit6() { return !!_keyboard["Digit6"]; }, set digit6(value: boolean) { _keyboard["Digit6"] = value; },
    get digit7() { return !!_keyboard["Digit7"]; }, set digit7(value: boolean) { _keyboard["Digit7"] = value; },
    get digit8() { return !!_keyboard["Digit8"]; }, set digit8(value: boolean) { _keyboard["Digit8"] = value; },
    get digit9() { return !!_keyboard["Digit9"]; }, set digit9(value: boolean) { _keyboard["Digit9"] = value; },
    get a() { return !!_keyboard["KeyA"]; }, set a(value: boolean) { _keyboard["KeyA"] = value; },
    get b() { return !!_keyboard["KeyB"]; }, set b(value: boolean) { _keyboard["KeyB"] = value; },
    get c() { return !!_keyboard["KeyC"]; }, set c(value: boolean) { _keyboard["KeyC"] = value; },
    get d() { return !!_keyboard["KeyD"]; }, set d(value: boolean) { _keyboard["KeyD"] = value; },
    get e() { return !!_keyboard["KeyE"]; }, set e(value: boolean) { _keyboard["KeyE"] = value; },
    get f() { return !!_keyboard["KeyF"]; }, set f(value: boolean) { _keyboard["KeyF"] = value; },
    get g() { return !!_keyboard["KeyG"]; }, set g(value: boolean) { _keyboard["KeyG"] = value; },
    get h() { return !!_keyboard["KeyH"]; }, set h(value: boolean) { _keyboard["KeyH"] = value; },
    get i() { return !!_keyboard["KeyI"]; }, set i(value: boolean) { _keyboard["KeyI"] = value; },
    get j() { return !!_keyboard["KeyJ"]; }, set j(value: boolean) { _keyboard["KeyJ"] = value; },
    get k() { return !!_keyboard["KeyK"]; }, set k(value: boolean) { _keyboard["KeyK"] = value; },
    get l() { return !!_keyboard["KeyL"]; }, set l(value: boolean) { _keyboard["KeyL"] = value; },
    get m() { return !!_keyboard["KeyM"]; }, set m(value: boolean) { _keyboard["KeyM"] = value; },
    get n() { return !!_keyboard["KeyN"]; }, set n(value: boolean) { _keyboard["KeyN"] = value; },
    get o() { return !!_keyboard["KeyO"]; }, set o(value: boolean) { _keyboard["KeyO"] = value; },
    get p() { return !!_keyboard["KeyP"]; }, set p(value: boolean) { _keyboard["KeyP"] = value; },
    get q() { return !!_keyboard["KeyQ"]; }, set q(value: boolean) { _keyboard["KeyQ"] = value; },
    get r() { return !!_keyboard["KeyR"]; }, set r(value: boolean) { _keyboard["KeyR"] = value; },
    get s() { return !!_keyboard["KeyS"]; }, set s(value: boolean) { _keyboard["KeyS"] = value; },
    get t() { return !!_keyboard["KeyT"]; }, set t(value: boolean) { _keyboard["KeyT"] = value; },
    get u() { return !!_keyboard["KeyU"]; }, set u(value: boolean) { _keyboard["KeyU"] = value; },
    get v() { return !!_keyboard["KeyV"]; }, set v(value: boolean) { _keyboard["KeyV"] = value; },
    get w() { return !!_keyboard["KeyW"]; }, set w(value: boolean) { _keyboard["KeyW"] = value; },
    get x() { return !!_keyboard["KeyX"]; }, set x(value: boolean) { _keyboard["KeyX"] = value; },
    get y() { return !!_keyboard["KeyY"]; }, set y(value: boolean) { _keyboard["KeyY"] = value; },
    get z() { return !!_keyboard["KeyZ"]; }, set z(value: boolean) { _keyboard["KeyZ"] = value; },

    poll: () => {
        return _key;
    }
};

window.addEventListener("blur", () => {     // TODO, remove? add more?
    _keyboard["AltLeft"] = false;
})


//
// Mouse
//

export const mouse = {
    x: -1,
    y: -1,
    over: false,

    get left() { return !!_mouse[0]; }, set left(value: boolean) { _mouse[0] = value },
    get middle() { return !!_mouse[1]; }, set middle(value: boolean) { _mouse[1] = value },
    get right() { return !!_mouse[2]; }, set right(value: boolean) { _mouse[2] = value }
};


//
// Touchscreen
//

export const touchscreen = {
    x: -1,
    y: -1,
    touches: [] as {
        x: number;
        y: number;
        id: number;
    }[],

    get touched(): boolean { return !!_touched; }, set touched(value: boolean) { _touched = value }
};


//
// Turtle
//

export class Turtle {
    private turtleContainer = addSVG("svg", { width: 20, height: 20 });
    private turtle: SVGPolygonElement;
    private pen = true;
    private visible = true;
    // private path: [x: number, y: number][] = [];

    public delay = 100;
    public penSize = 1;

    constructor(
        public x = W / 2,      
        public y = H / 2,
        public heading = 0
    ) {
        this.turtleContainer.style.position = "absolute";
        this.turtle = addSVG("polygon", { points: "0,0 10,10, 0,20", fill: _color }, this.turtleContainer);

        this.right(0);
        this.forward(0);
    }

    get penColor() {
        return this.turtle.getAttribute("fill")!;
    }
    set penColor(value: string) {
        this.turtle.setAttribute("fill", value);
    }

    async forward(length: number): Promise<void> {
        await sleep(this.delay);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.x += Math.cos(radians(this.heading)) * length;
        this.y += Math.sin(radians(this.heading)) * length;
        // this.path.push([this.x, this.y]);

        if (this.pen) {
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.penColor;
            ctx.lineWidth = this.penSize;
            ctx.stroke();
        } else {
            ctx.moveTo(this.x, this.y);
        }

        if (this.visible) {
            this.turtleContainer.style.left = (canvas.offsetLeft + (this.x - 10)) / _scaleX + "px";
            this.turtleContainer.style.top = (canvas.offsetTop + (this.y - 10)) / _scaleY + "px";
        }
    }

    async backward(length: number): Promise<void> {
        await this.forward(-length);
    }

    async right(degAngle = 90): Promise<void> {
        await sleep(this.delay);

        this.heading += degAngle;

        let [x1, y1] = fromPolar(10, this.heading + 150, 10, 10);
        let [x2, y2] = fromPolar(6, this.heading + 180, 10, 10);
        let [x3, y3] = fromPolar(10, this.heading - 150, 10, 10);

        this.turtle.setAttribute("points", `10,10 ${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    }

    async left(degAngle = 90): Promise<void> {
        await this.right(-degAngle);
    }

    penUp() {
        this.pen = false;
    }

    penDown() {
        this.pen = true;
    }

    hide() {
        this.visible = false;
        this.turtleContainer.style.display = "none";
    }

    show() {
        this.visible = true;
        this.turtleContainer.style.display = "block";
    }
}


//
// Grid
//

export class Cell {
    public tag: any = {};

    private _style: Style | null = null;
    private _image: string | null = null;
    private _custom: ((cell: Cell) => void) | null = null;

    constructor(
        private _grid: _Grid,
        readonly row: number,
        readonly column: number,
        readonly x: number,
        readonly y: number,
        readonly width: number,
        readonly height: number
    ) {
    }

    public get grid() {
        return this._grid as Grid;
    }

    public get style() {
        return this._style;
    }

    public set style(value: Style | null) {
        this._style = value;
        this.draw();
    }

    public get image() {
        return this._image;
    }

    public set image(value: string | null) {
        this._image = value;
        this.draw();
    }

    public get custom() {
        return this._custom;
    }

    public set custom(value: ((cell: Cell) => void) | null) {
        this._custom = value;
        this.draw();
    }

    public async draw(): Promise<void> {
        clear(this.x, this.y, this.width, this.height);

        if (this._style) {
            fill(this._style, this.x, this.y, this.width, this.height);
        }

        if (this._image) {
            await image(this._image, this.x, this.y, this.width, this.height);
        }

        if (this._custom) {
            this._custom(this);
        }
    }
}

class _Grid {
    protected cellWidth: number;
    protected cellHeight: number;
    [row: number]: { [column: number]: Cell; };

    constructor(rows: number, columns: number, x: number, y: number, width: number, height: number, lineWidth: number) {
        this.cellWidth = (width - (columns + 1) * lineWidth) / columns;
        this.cellHeight = (height - (rows + 1) * lineWidth) / rows;

        for (let i = 0; i < rows; i++) {
            this[i] = [];
            for (let j = 0; j < columns; j++) {
                this[i][j] = new Cell(
                    this, i, j,
                    x + j * (this.cellWidth + lineWidth) + lineWidth,
                    y + i * (this.cellHeight + lineWidth) + lineWidth,
                    this.cellWidth, this.cellHeight
                );
            }
        }
    }
}

export class Grid extends _Grid {
    private activatable = true;
    private _activeCell: Cell | null = null;
    readonly [row: number]: { readonly [column: number]: Cell; };

    constructor(
        readonly rows: number,
        readonly columns: number,
        private x = 0,
        private y = 0,
        private width = W - 2 * x,
        private height = H - 2 * y,
        private style: Style = _color,
        private lineWidth = 1
    ) {
        super(rows, columns, x, y, width, height, lineWidth);
        this.draw();
    }

    public get activated(): boolean {
        if (_mouse[0] || _touched) {
            if (this.activatable) {
                let x = touchscreen.x;
                let y = touchscreen.y;

                if (_mouse[0]) {
                    x = mouse.x;
                    y = mouse.y;
                }

                this._activeCell = this.getCell(x, y);
                this.activatable = false;
                return !!this._activeCell;
            } else {
                return false;
            }
        }

        this.activatable = true;
        return false;
    }

    public get activeCell(): Cell | null {
        return this._activeCell;
    }

    public getCell(x: number, y: number): Cell | null {
        let row: number;
        let column: number;

        if ((x - this.x - this.lineWidth + this.cellWidth + this.lineWidth) % (this.cellWidth + this.lineWidth) < this.cellWidth) {
            column = Math.floor((x - this.x) / (this.cellWidth + this.lineWidth));

            if (column < 0 || column >= this.columns) {
                return null;
            }
        } else {
            return null;
        }

        if ((y - this.y - this.lineWidth + this.cellHeight + this.lineWidth) % (this.cellHeight + this.lineWidth) < this.cellHeight) {
            row = Math.floor((y - this.y) / (this.cellHeight + this.lineWidth));

            if (row < 0 || row >= this.rows) {
                return null;
            }
        } else {
            return null;
        }

        return this[row][column];
    }

    public draw() {
        if (this.style) {
            fill(this.style, this.x, this.y, this.width, this.height)
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this[i][j].draw();
            }
        }
    }
}


//
// Helper functions
//

export function ord(char: string): number | undefined {
    return char.codePointAt(0);
}

export function chr(charCode: number): string {
    return String.fromCodePoint(charCode);
}

export function randomInt(maxExclusive: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(m: number, n?: number): number {
    return n != null ? Math.trunc(m) + Math.floor(Math.random() * (n - m + 1)) : Math.floor(Math.random() * m);
}

export function randomItem<T>(...items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export function radians(degAngle: number): number {
    return degAngle * Math.PI / 180;
}

export function degrees(radAngle: number): number {
    return radAngle * 180 / Math.PI;
}

export function fromPolar(radius: number, degAngle: number, x0 = 0, y0 = 0): [x: number, y: number] {
    const a = radians(degAngle);
    return [x0 + Math.cos(a) * radius, y0 + Math.sin(a) * radius];
}

export function rgba(red: number, green: number, blue: number, alpha = 1): string {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function hsla(hue: number, saturation: number, light: number, alpha = 1): string {   // TODO, units?
    return `hsla(${hue}, ${saturation}%, ${light}%, ${alpha})`;
}

export function getPixel(x: number, y: number) {
    const data = ctx.getImageData(x, y, 1, 1).data;

    return { red: data[0], green: data[1], blue: data[2], alpha: data[3] };
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.hypot(x2 - x1, y2 - y1);
}

export async function sleep(msDuration: number): Promise<void> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), msDuration));        // TODO, reject?
}

export function array(length: number): any[];
export function array<T>(length: number, value: T): T[];
export function array<T>(length: number, value: ((index?: number) => T)): T[];         // 3.0
export function array<T>(length: number, value?: any): T[] {
    if (typeof value == "function") {
        let a: T[] = [];
        for (let i = 0; i < length; i++) {
            a[i] = value.call(null, i);
        }
        return a;
    }

    return Array(length).fill(value);
}

export function array2D(rows: number, columns: number): any[][];
export function array2D<T>(rows: number, columns: number, value: T): T[][];
export function array2D<T>(rows: number, columns: number, value: ((row?: number, column?: number) => T)): T[][];
export function array2D<T>(rows: number, columns: number, value?: any): T[][] {
    if (typeof value == "function") {
        let m: T[][] = array2D(rows, columns)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                m[i][j] = value.call(null, i, j);
            }
        }
        return m;
    }

    return Array(rows).fill(null).map(() => Array(columns).fill(value));
}

export function range(from: number, toExclusive: number): number[];
export function range(from: number, toExclusive: number, by: number): number[];
export function range(toExclusive: number): number[];
export function range(a: number, b?: number, c: number = 1): number[] {
    const r: number[] = [];

    if (b == null) {
        [a, b] = [0, a]
    }

    if (c > 0) {
        for (let i = a; i < b; i += c) {
            r.push(i);
        }
    } else if (c < 0) {
        for (let i = a; i > b; i += c) {
            r.push(i);
        }
    } else {
        throw new RangeError("'by' must not be zero");      // ? 
    }

    return r;
}

export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


//
// GUI functions
//

export let div: HTMLDivElement | null;

interface _ExtraTagMap {
    "input:button": HTMLInputElement;
    "input:checkbox": HTMLInputElement;
    "input:color": HTMLInputElement;
    "input:date": HTMLInputElement;
    "input:datetime-local": HTMLInputElement;
    "input:email": HTMLInputElement;
    "input:file": HTMLInputElement;
    "input:hidden": HTMLInputElement;
    "input:image": HTMLInputElement;
    "input:month": HTMLInputElement;
    "input:number": HTMLInputElement;
    "input:password": HTMLInputElement;
    "input:radio": HTMLInputElement;
    "input:range": HTMLInputElement;
    "input:reset": HTMLInputElement;
    "input:search": HTMLInputElement;
    "input:submit": HTMLInputElement;
    "input:tel": HTMLInputElement;
    "input:text": HTMLInputElement;
    "input:time": HTMLInputElement;
    "input:url": HTMLInputElement;
    "input:week": HTMLInputElement;
    "balder-canvas": BalderCanvas;
}

export interface TagTypeMap extends HTMLElementTagNameMap, _ExtraTagMap { }     // ? TagNameMap BalderTagNameMap - slå ihop snyggare

export function add<K extends keyof TagTypeMap>(
    tagName: K
): TagTypeMap[K];
export function add<K extends keyof TagTypeMap>(
    tagName: K,
    text: string | {
        text: string,
        asHTML?: boolean
    }
): TagTypeMap[K];
export function add<K extends keyof TagTypeMap>(
    tagName: K,
    text: string | {
        text: string,
        asHTML?: boolean
    },
    parent: HTMLElement | {
        parent?: HTMLElement,
        before?: Node,
        newline?: boolean
    }
): TagTypeMap[K];
export function add<K extends keyof TagTypeMap>(
    tagName: K,
    parent: HTMLElement | {
        parent?: HTMLElement,
        before?: Node,
        newline?: boolean
    }
): TagTypeMap[K];
export function add<K extends keyof TagTypeMap>(
    tagName: K,
    arg1?: string | object,
    arg2?: HTMLElement | {
        parent?: HTMLElement,
        before?: Node,
        newline?: boolean
    }
): TagTypeMap[K] {
    let elt: TagTypeMap[K];

    if (_outputElt) {           // Rätt plats? Räcker med i input()?
        _outputValue += _outputElt.textContent!;
        _outputElt = null;
    }

    if (typeof arg1 == "string" || (arg1 && !(arg1 instanceof HTMLElement) && ((obj: any): obj is { text: string, asHTML?: boolean } => ('text' in obj))(arg1))) {
        if (_lbltags.includes(tagName.split(":")[0] as _LabelableTag)) {
            let labelElt = add("label", arg2!);
            labelElt.style.display = "inline-flex";
            add("span", arg1, labelElt);
            elt = add(tagName, labelElt);

            if (["input:checkbox", "input:radio"].includes(tagName)) {
                labelElt.style.flexDirection = "row-reverse";
            } else {
                labelElt.style.flexDirection = "column";
            }

            return elt;
        }

        elt = document.createElement(tagName) as TagTypeMap[K];

        if (tagName == "fieldset") {
            add("legend", arg1, elt as HTMLFieldSetElement);
        } else if (tagName == "details") {
            add("summary", arg1, elt as HTMLDetailsElement);
        } else if (tagName == "table") {
            add("caption", arg1, elt as HTMLTableCaptionElement);
        } else {
            let text = typeof arg1 == "string" ? arg1 : arg1.text;

            if (typeof arg1 == "object" && arg1.asHTML) {
                elt.innerHTML = text;
            } else {
                elt.textContent = text;
            }
        }
    } else {
        if (arg1) {
            arg2 = arg1;
        }

        if (tagName == "balder-canvas") {
            elt = document.createElement("canvas", { is: 'balder-canvas' }) as TagTypeMap[K];
        } else if (tagName.startsWith("input:")) {
            elt = document.createElement("input") as TagTypeMap[K];
            (elt as HTMLInputElement).type = tagName.substr(6);
        } else {
            elt = document.createElement(tagName) as TagTypeMap[K];
        }
    }

    let parent: HTMLElement = div ?? document.body;
    let before: Node | null = null;
    let newline = true;

    if (arg2) {
        if (arg2 instanceof HTMLElement) {
            parent = arg2;
        } else {
            if (arg2.parent != null) parent = arg2.parent;
            if (arg2.before != null) before = arg2.before;
            if (arg2.newline != null) newline = arg2.newline;
        }
    }

    if (tagName == "input:radio") {
        (elt as HTMLInputElement).name =
            parent instanceof HTMLFieldSetElement ?
                parent.querySelector("legend")?.textContent! :
                parent.parentElement instanceof HTMLFieldSetElement ?
                    parent.parentElement.querySelector("legend")?.textContent! :
                    " ";
    }

    if (newline) {
        before = parent.insertBefore(document.createTextNode("\n"), before)
    }

    parent.insertBefore(elt, before);
    elt.focus();        // ? 3.0

    return elt;
}

export function setLabel(labeledElement: HTMLElement, text: string) {
    if (labeledElement.parentElement instanceof HTMLLabelElement) {
        const spanElt = labeledElement.parentElement.querySelector("span");

        if (spanElt) {
            spanElt.textContent = text;
            return;
        }
    }

    throw new Error("'labeledElement' is not labeled");
}

export function getLabel(labeledElement: HTMLElement) {
    if (labeledElement.parentElement instanceof HTMLLabelElement) {
        const spanElt = labeledElement.parentElement.querySelector("span");

        if (spanElt) {
            return spanElt.textContent!;
        }
    }

    throw new Error("'labeledElement' is not labeled");
}

export function addSVG(tagName: "svg", attributes?: object, parent?: HTMLElement | SVGSVGElement): SVGSVGElement;
export function addSVG(tagName: "svg", parent?: HTMLElement | SVGSVGElement): SVGSVGElement;
export function addSVG<K extends keyof Omit<SVGElementTagNameMap, "svg">>(tagName: K, attributes: object, parent: SVGSVGElement): SVGElementTagNameMap[K];
export function addSVG<K extends keyof Omit<SVGElementTagNameMap, "svg">>(tagName: K, parent: SVGSVGElement): SVGElementTagNameMap[K];
export function addSVG<K extends keyof SVGElementTagNameMap>(tagName: K, arg1?: object, arg2?: HTMLElement | SVGSVGElement) {
    let elt = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    if (arg1 === undefined) {
        document.body.appendChild(elt);
    } else if (arg1 instanceof HTMLElement || arg1 instanceof SVGSVGElement) {
        arg1.appendChild(elt);
    } else {
        for (const key in arg1) {
            elt.setAttribute(key, (arg1 as any)[key])
        }

        (arg2 ?? document.body).appendChild(elt);
    }

    return elt;
}

let _debugElt: HTMLSelectElement | null;

export function debug(...values: any[]) {
    if (!_debugElt) {
        _debugElt = add("select", document.body);
        _debugElt.size = 2;
        _debugElt.style.fontFamily = "monospace";
        _debugElt.style.color = "black";
        _debugElt.style.backgroundColor = "yellow";
        _debugElt.style.position = "fixed";
        _debugElt.style.bottom = "0";
        _debugElt.style.left = "0";
        _debugElt.style.width = "100%";
        _debugElt.style.zIndex = "2147483646";

        _debugElt.onclick = () => {
            _debugElt?.remove();
            _debugElt = null;
        }
    }

    add("option", values.map(v => str(v)).join(" "), _debugElt);
    _debugElt.scrollTop = _debugElt.scrollHeight;
}

let _canvas: BalderCanvas | null = document.querySelector("canvas[is=balder-canvas]");        // 3.0

if (_canvas) {
    canvas = _canvas;
} else {
    document.documentElement.style.height = "100%";
    document.documentElement.style.display = "flex";
    document.documentElement.style.flexFlow = "column";
    document.body.style.height = "100%";
    document.body.style.display = "flex";
    document.body.style.flexFlow = "column";

    div = add("div", document.body);
    canvas = add("balder-canvas", document.body);

    canvas.style.flex = "1";
    resetCanvas();
}