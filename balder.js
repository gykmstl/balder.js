// BalderJS
// version 3.2 (2022-02-27) 
// Mattias Steinwall
// Baldergymnasiet, Skellefteå, Sweden
//
// Initialize
//
export let W;
export let H;
export let ctx;
const _lbltags = ["input", "meter", "output", "progress", "select", "textarea"];
const _bgcolor = getComputedStyle(document.body).getPropertyValue("background-color");
const _color = getComputedStyle(document.body).getPropertyValue("color");
let _scaleX = 1;
let _scaleY = 1;
const _codes = new Set();
const _keyboard = {};
const _mouse = {};
let _touched = null;
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
        function touchHandler(event) {
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
        });
        ctx = this.getContext("2d");
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
export let canvas;
const _initUpdateables = [];
let _update = () => { };
export let deltaTime;
let time0 = performance.now();
export function setUpdate(handler = () => { }) {
    _update = handler;
    canvas.focus();
}
function _updateHandler() {
    for (let iu of _initUpdateables) {
        iu.initUpdate();
    }
    let time1 = performance.now();
    deltaTime = time1 - time0;
    time0 = time1;
    _update();
    requestAnimationFrame(_updateHandler);
}
_updateHandler();
let _key;
let _errNr = 0;
let _errorElt;
window.onerror = (message) => {
    if (!_errorElt) {
        _errorElt = add("output", document.body);
    }
    _errorElt.value = `(#${++_errNr}) ${String(message)}`;
    _errorElt.style.color = "white";
    _errorElt.style.backgroundColor = "red";
    _errorElt.style.position = "fixed";
    _errorElt.style.bottom = "4px";
    _errorElt.style.left = "0";
    _errorElt.style.width = "100%";
    _errorElt.style.zIndex = "2147483647";
    _errorElt.focus();
    _errorElt.onclick = () => {
        _errorElt?.remove();
        _errorElt = null;
    };
};
window.addEventListener("unhandledrejection", event => {
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
let _outputElt;
let _inputLines = [];
let _inputLineIndex = 0;
export function setInputs(...values) {
    _inputLines = values.join("\n").split("\n");
    _inputLineIndex = 0;
}
export function input(prompt = "", defaultValue) {
    let inputElt = add("input", prompt);
    inputElt.parentElement.style.display = "flex";
    inputElt.parentElement.style.fontFamily = "monospace";
    inputElt.style.fontFamily = "inherit";
    inputElt.style.backgroundColor = "inherit";
    inputElt.style.color = "inherit";
    inputElt.style.flex = "1";
    if (defaultValue) {
        inputElt.value = String(defaultValue);
        inputElt.select();
    }
    inputElt.focus();
    return new Promise((resolve) => {
        let line = _inputLines[_inputLineIndex++];
        if (line) {
            resolve(line);
            inputElt.value = line;
            inputElt.disabled = true;
            return;
        }
        inputElt.addEventListener("keydown", event => {
            if (event.code == "Enter") {
                event.preventDefault();
                resolve(inputElt.value);
                inputElt.setSelectionRange(0, 0);
                inputElt.disabled = true;
            }
        });
    });
}
let _outputValue = "";
export function output(...args) {
    if (!_outputElt) {
        _outputElt = add("div");
        _outputElt.style.fontFamily = "monospace";
        _outputElt.style.whiteSpace = "pre-wrap";
        _outputElt.style.wordWrap = "break-word";
    }
    if (args.length > 1 && /^\s*$/.test(args[args.length - 1])) {
        _outputElt.textContent += args.slice(0, -1).map(v => str(v)).join(" ");
        _outputElt.textContent += args[args.length - 1];
    }
    else {
        _outputElt.textContent += args.map(v => str(v)).join(" ");
        _outputElt.textContent += "\n";
    }
}
export function str(value) {
    if (typeof value === "object" && value != null && (value.toString === Object.prototype.toString || value.toString === Array.prototype.toString)) {
        if (typeof value[Symbol.iterator] === "function") {
            value = Array.from(value);
        }
        try {
            return JSON.stringify(value);
        }
        catch { }
    }
    return String(value);
}
const params = new URL(location.href).searchParams;
const iParam = params.get("i"); // input
if (iParam != null) {
    _inputLines = decodeURIComponent(iParam).split("\n");
}
//
// Load
//
window.addEventListener("load", () => {
    const oParam = params.get("o"); // output
    if (oParam != null) {
        const resp = add("div");
        resp.style.fontFamily = "monospace";
        resp.style.whiteSpace = "pre-wrap";
        resp.style.wordWrap = "break-word";
        resp.style.color = "black";
        const oValue = decodeURIComponent(oParam);
        _outputValue = _outputValue.split("\n").map(line => line.trimEnd()).join("\n");
        if (_outputValue == oValue) {
            resp.style.backgroundColor = "palegreen";
            resp.textContent = _outputValue;
        }
        else {
            let offset = 0;
            while (_outputValue[offset] == oValue[offset]) {
                offset++;
            }
            resp.style.backgroundColor = "lightsalmon";
            const match = add("span", oValue.slice(0, offset), resp, undefined, false);
            match.style.backgroundColor = "palegreen";
            add("span", oValue.slice(offset), resp);
        }
    }
});
//
// Drawing functions
//
export function polygon(points, color = _color, lineWidth) {
    if (points.length < 2)
        throw new RangeError("Too few points");
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(...points[i]);
    }
    ctx.closePath();
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
export function line(x1, y1, x2, y2, color = _color, lineWidth = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}
export function circle(x, y, radius, color = _color, lineWidth) {
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
export function rectangle(x, y, width, height, color = _color, lineWidth) {
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, width, height);
    }
    else {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
}
export function triangle(x1, y1, x2, y2, x3, y3, color = _color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = color;
        ctx.fill();
    }
}
export function text(value, x = 0, y = 24, font = 24, color = _color, lineWidth) {
    if (typeof font == "number") {
        ctx.font = font + "px consolas,monospace"; // 3.2
    }
    else {
        ctx.font = font;
    }
    if (lineWidth) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.strokeText(str(value), x, y);
    }
    else {
        ctx.fillStyle = color;
        ctx.fillText(str(value), x, y);
    }
}
let _images = [];
function _loadImage(path) {
    return new Promise((resolve, reject) => {
        if (_images[path] === undefined) {
            _images[path] = new Image();
            _images[path].src = path;
            _images[path].addEventListener("load", () => resolve());
            _images[path].addEventListener("error", () => reject(new Error(`'${path}' can not be loaded`)));
        }
        else if (_images[path].complete) {
            resolve();
        }
        else {
            _images[path].addEventListener("load", () => resolve());
        }
    });
}
export async function image(path, x = 0, y = 0, width, height = width) {
    await _loadImage(path);
    if (width) {
        ctx.drawImage(_images[path], x, y, width, height);
    }
    else {
        ctx.drawImage(_images[path], x, y);
    }
}
export function clear(x = 0, y = 0, width = W, height = H) {
    ctx.clearRect(x, y, width, height);
}
export function fill(color = _bgcolor, x = 0, y = 0, width = W, height = H) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
//
// Vector2
// 
export class Vector2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromPolar(length, angle) {
        return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    get length() {
        return Math.hypot(this.x, this.y);
    }
    set length(value) {
        const angle = this.angle;
        this.x = value * Math.cos(angle);
        this.y = value * Math.sin(angle);
    }
    get lengthSquared() {
        return this.x ** 2 + this.y ** 2;
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    set angle(value) {
        const length = this.length;
        this.x = length * Math.cos(value);
        this.y = length * Math.sin(value);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
    }
    divide(v) {
        this.x /= v.x;
        this.y /= v.y;
    }
    scalarMultiply(s) {
        this.x *= s;
        this.y *= s;
    }
    distanceTo(v) {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }
    distanceToSquared(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
//
// Hitbox
//
export class Hitbox {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    intersects(other) {
        return (this.x + this.width > other.x &&
            this.x < other.x + other.width &&
            this.y + this.height > other.y &&
            this.y < other.y + other.height);
    }
    contains(x, y) {
        return (this.x + this.width > x &&
            this.x <= x &&
            this.y + this.height > y &&
            this.y <= y);
    }
    drawOutline(color = _color) {
        rectangle(this.x, this.y, this.width, this.height, color, 1);
    }
}
//
// Sprite
//
export class Sprite extends Hitbox {
    spritesheetPath;
    rows;
    columns;
    index = 0;
    _frames = [];
    counter = 0;
    updatesPerFrame = 10;
    loop = true;
    tag = {};
    constructor(spritesheetPath, rows = 1, columns = 1, ...frames) {
        super(0, 0, 0, 0);
        this.spritesheetPath = spritesheetPath;
        this.rows = rows;
        this.columns = columns;
        this._frames = frames.length ? frames : range(rows * columns);
        _initUpdateables.push(this);
    }
    initUpdate() {
        if (this.counter == (this.updatesPerFrame - 1)) {
            this.index++;
            if (this.index == this._frames.length) {
                if (this.loop) {
                    this.index = 0;
                }
                else {
                    _initUpdateables.splice(_initUpdateables.indexOf(this), 1);
                }
            }
        }
        this.counter = (this.counter + 1) % this.updatesPerFrame;
    }
    async draw() {
        await _loadImage(this.spritesheetPath);
        const frameWidth = _images[this.spritesheetPath].width / this.columns;
        const frameHeight = _images[this.spritesheetPath].height / this.rows;
        if (this.width == 0)
            this.width = frameWidth;
        if (this.height == 0)
            this.height = frameHeight;
        const sx = frameWidth * (this._frames[this.index] % this.columns);
        const sy = frameHeight * Math.floor(this._frames[this.index] / this.columns);
        ctx.drawImage(_images[this.spritesheetPath], sx, sy, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
    }
}
//
// Keyboard
//
export const keyboard = {
    get shiftLeft() { return !!_keyboard["ShiftLeft"]; }, set shiftLeft(value) { _keyboard["ShiftLeft"] = value; },
    get shiftRight() { return !!_keyboard["ShiftRight"]; }, set shiftRight(value) { _keyboard["ShiftRight"] = value; },
    get backspace() { return !!_keyboard["Backspace"]; }, set backspace(value) { _keyboard["Backspace"] = value; },
    get enter() { return !!_keyboard["Enter"]; }, set enter(value) { _keyboard["Enter"] = value; },
    get space() { return !!_keyboard["Space"]; }, set space(value) { _keyboard["Space"] = value; },
    get left() { return !!_keyboard["ArrowLeft"]; }, set left(value) { _keyboard["ArrowLeft"] = value; },
    get up() { return !!_keyboard["ArrowUp"]; }, set up(value) { _keyboard["ArrowUp"] = value; },
    get right() { return !!_keyboard["ArrowRight"]; }, set right(value) { _keyboard["ArrowRight"] = value; },
    get down() { return !!_keyboard["ArrowDown"]; }, set down(value) { _keyboard["ArrowDown"] = value; },
    get digit0() { return !!_keyboard["Digit0"]; }, set digit0(value) { _keyboard["Digit0"] = value; },
    get digit1() { return !!_keyboard["Digit1"]; }, set digit1(value) { _keyboard["Digit1"] = value; },
    get digit2() { return !!_keyboard["Digit2"]; }, set digit2(value) { _keyboard["Digit2"] = value; },
    get digit3() { return !!_keyboard["Digit3"]; }, set digit3(value) { _keyboard["Digit3"] = value; },
    get digit4() { return !!_keyboard["Digit4"]; }, set digit4(value) { _keyboard["Digit4"] = value; },
    get digit5() { return !!_keyboard["Digit5"]; }, set digit5(value) { _keyboard["Digit5"] = value; },
    get digit6() { return !!_keyboard["Digit6"]; }, set digit6(value) { _keyboard["Digit6"] = value; },
    get digit7() { return !!_keyboard["Digit7"]; }, set digit7(value) { _keyboard["Digit7"] = value; },
    get digit8() { return !!_keyboard["Digit8"]; }, set digit8(value) { _keyboard["Digit8"] = value; },
    get digit9() { return !!_keyboard["Digit9"]; }, set digit9(value) { _keyboard["Digit9"] = value; },
    get a() { return !!_keyboard["KeyA"]; }, set a(value) { _keyboard["KeyA"] = value; },
    get b() { return !!_keyboard["KeyB"]; }, set b(value) { _keyboard["KeyB"] = value; },
    get c() { return !!_keyboard["KeyC"]; }, set c(value) { _keyboard["KeyC"] = value; },
    get d() { return !!_keyboard["KeyD"]; }, set d(value) { _keyboard["KeyD"] = value; },
    get e() { return !!_keyboard["KeyE"]; }, set e(value) { _keyboard["KeyE"] = value; },
    get f() { return !!_keyboard["KeyF"]; }, set f(value) { _keyboard["KeyF"] = value; },
    get g() { return !!_keyboard["KeyG"]; }, set g(value) { _keyboard["KeyG"] = value; },
    get h() { return !!_keyboard["KeyH"]; }, set h(value) { _keyboard["KeyH"] = value; },
    get i() { return !!_keyboard["KeyI"]; }, set i(value) { _keyboard["KeyI"] = value; },
    get j() { return !!_keyboard["KeyJ"]; }, set j(value) { _keyboard["KeyJ"] = value; },
    get k() { return !!_keyboard["KeyK"]; }, set k(value) { _keyboard["KeyK"] = value; },
    get l() { return !!_keyboard["KeyL"]; }, set l(value) { _keyboard["KeyL"] = value; },
    get m() { return !!_keyboard["KeyM"]; }, set m(value) { _keyboard["KeyM"] = value; },
    get n() { return !!_keyboard["KeyN"]; }, set n(value) { _keyboard["KeyN"] = value; },
    get o() { return !!_keyboard["KeyO"]; }, set o(value) { _keyboard["KeyO"] = value; },
    get p() { return !!_keyboard["KeyP"]; }, set p(value) { _keyboard["KeyP"] = value; },
    get q() { return !!_keyboard["KeyQ"]; }, set q(value) { _keyboard["KeyQ"] = value; },
    get r() { return !!_keyboard["KeyR"]; }, set r(value) { _keyboard["KeyR"] = value; },
    get s() { return !!_keyboard["KeyS"]; }, set s(value) { _keyboard["KeyS"] = value; },
    get t() { return !!_keyboard["KeyT"]; }, set t(value) { _keyboard["KeyT"] = value; },
    get u() { return !!_keyboard["KeyU"]; }, set u(value) { _keyboard["KeyU"] = value; },
    get v() { return !!_keyboard["KeyV"]; }, set v(value) { _keyboard["KeyV"] = value; },
    get w() { return !!_keyboard["KeyW"]; }, set w(value) { _keyboard["KeyW"] = value; },
    get x() { return !!_keyboard["KeyX"]; }, set x(value) { _keyboard["KeyX"] = value; },
    get y() { return !!_keyboard["KeyY"]; }, set y(value) { _keyboard["KeyY"] = value; },
    get z() { return !!_keyboard["KeyZ"]; }, set z(value) { _keyboard["KeyZ"] = value; },
    poll: () => {
        return _key;
    }
};
window.addEventListener("blur", () => {
    _keyboard["AltLeft"] = false;
});
//
// Mouse
//
export const mouse = {
    x: -1,
    y: -1,
    over: false,
    get left() { return !!_mouse[0]; }, set left(value) { _mouse[0] = value; },
    get middle() { return !!_mouse[1]; }, set middle(value) { _mouse[1] = value; },
    get right() { return !!_mouse[2]; }, set right(value) { _mouse[2] = value; }
};
//
// Touchscreen
//
export const touchscreen = {
    x: -1,
    y: -1,
    touches: [],
    get touched() { return !!_touched; }, set touched(value) { _touched = value; }
};
//
// Turtle
//
export class Turtle {
    x;
    y;
    heading;
    turtleContainer = addSVG("svg", document.body);
    turtle;
    pen = true;
    visible = true;
    delay = 100;
    penSize = 1;
    constructor(x = W / 2, y = H / 2, heading = 0) {
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.turtleContainer.setAttribute("width", "20");
        this.turtleContainer.setAttribute("height", "20");
        this.turtleContainer.style.position = "absolute";
        this.turtle = addSVG("polygon", this.turtleContainer);
        this.turtle.setAttribute("points", "0,0 10,10, 0,20");
        this.turtle.setAttribute("fill", _color);
        this.right(0);
        this.forward(0);
    }
    get penColor() {
        return this.turtle.getAttribute("fill");
    }
    set penColor(value) {
        this.turtle.setAttribute("fill", value);
    }
    async forward(length) {
        await sleep(this.delay);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        this.x += Math.cos(radians(this.heading)) * length;
        this.y += Math.sin(radians(this.heading)) * length;
        if (this.pen) {
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.penColor;
            ctx.lineWidth = this.penSize;
            ctx.stroke();
        }
        else {
            ctx.moveTo(this.x, this.y);
        }
        if (this.visible) {
            this.turtleContainer.style.left = (canvas.offsetLeft + (this.x - 10)) / _scaleX + "px";
            this.turtleContainer.style.top = (canvas.offsetTop + (this.y - 10)) / _scaleY + "px";
        }
    }
    async backward(length) {
        await this.forward(-length);
    }
    async right(degAngle = 90) {
        await sleep(this.delay);
        this.heading += degAngle;
        let [x1, y1] = fromPolar(10, this.heading + 150, 10, 10);
        let [x2, y2] = fromPolar(6, this.heading + 180, 10, 10);
        let [x3, y3] = fromPolar(10, this.heading - 150, 10, 10);
        this.turtle.setAttribute("points", `10,10 ${x1},${y1} ${x2},${y2} ${x3},${y3}`);
    }
    async left(degAngle = 90) {
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
    _grid;
    row;
    column;
    x;
    y;
    width;
    height;
    _color = null;
    _image = null;
    _custom = null;
    tag = {};
    constructor(_grid, row, column, x, y, width, height) {
        this._grid = _grid;
        this.row = row;
        this.column = column;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get grid() {
        return this._grid;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.draw();
    }
    get image() {
        return this._image;
    }
    set image(value) {
        this._image = value;
        this.draw();
    }
    get custom() {
        return this._custom;
    }
    set custom(value) {
        this._custom = value;
        this.draw();
    }
    async draw() {
        clear(this.x, this.y, this.width, this.height);
        if (this._color) {
            fill(this._color, this.x + 0.5, this.y + 0.5, this.width - 1, this.height - 1);
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
    cellWidth;
    cellHeight;
    constructor(rows, columns, x, y, width, height, lineWidth) {
        this.cellWidth = (width - (columns + 1) * lineWidth) / columns;
        this.cellHeight = (height - (rows + 1) * lineWidth) / rows;
        for (let i = 0; i < rows; i++) {
            this[i] = [];
            for (let j = 0; j < columns; j++) {
                this[i][j] = new Cell(this, i, j, x + j * (this.cellWidth + lineWidth) + lineWidth, y + i * (this.cellHeight + lineWidth) + lineWidth, this.cellWidth, this.cellHeight);
            }
        }
    }
}
export class Grid extends _Grid {
    rows;
    columns;
    x;
    y;
    width;
    height;
    color;
    lineWidth;
    activatable = true;
    _activeCell = null;
    constructor(rows, columns, x = 0, y = 0, width = W - 2 * x, height = H - 2 * y, color = _color, lineWidth = 1) {
        super(rows, columns, x, y, width, height, lineWidth);
        this.rows = rows;
        this.columns = columns;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lineWidth = lineWidth;
        this.draw();
    }
    get activated() {
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
            }
            else {
                return false;
            }
        }
        this.activatable = true;
        return false;
    }
    get activeCell() {
        return this._activeCell;
    }
    getCell(x, y) {
        let row;
        let column;
        if ((x - this.x - this.lineWidth + this.cellWidth + this.lineWidth) % (this.cellWidth + this.lineWidth) < this.cellWidth) {
            column = Math.floor((x - this.x) / (this.cellWidth + this.lineWidth));
            if (column < 0 || column >= this.columns) {
                return null;
            }
        }
        else {
            return null;
        }
        if ((y - this.y - this.lineWidth + this.cellHeight + this.lineWidth) % (this.cellHeight + this.lineWidth) < this.cellHeight) {
            row = Math.floor((y - this.y) / (this.cellHeight + this.lineWidth));
            if (row < 0 || row >= this.rows) {
                return null;
            }
        }
        else {
            return null;
        }
        return this[row][column];
    }
    draw() {
        if (this.color) {
            fill(this.color, this.x, this.y, this.width, this.height);
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this[i][j].draw(); // TODO, await?
            }
        }
    }
}
export class Controller {
    grid;
    constructor(x = 0, y = 0, width, height) {
        this.grid = new Grid(2, 4, x, y, width, height, "black");
        for (let i = 0; i < 4; i++) {
            this.grid[0][i].color = "grey";
            this.grid[1][i].color = "grey";
            this.grid[0][i].custom = (c) => text(i, c.x, c.y + 18, 24, "black");
        }
        _initUpdateables.push(this);
    }
    set in0(value) { this.grid[0][0].color = value ? "lightgreen" : "grey"; }
    set in1(value) { this.grid[0][1].color = value ? "lightgreen" : "grey"; }
    set in2(value) { this.grid[0][2].color = value ? "lightgreen" : "grey"; }
    set in3(value) { this.grid[0][3].color = value ? "lightgreen" : "grey"; }
    get in0() { return this.grid[0][0].color == "lightgreen"; }
    get in1() { return this.grid[0][1].color == "lightgreen"; }
    get in2() { return this.grid[0][2].color == "lightgreen"; }
    get in3() { return this.grid[0][3].color == "lightgreen"; }
    set out0(value) { this.grid[1][0].color = value ? "lightgreen" : "grey"; }
    set out1(value) { this.grid[1][1].color = value ? "lightgreen" : "grey"; }
    set out2(value) { this.grid[1][2].color = value ? "lightgreen" : "grey"; }
    set out3(value) { this.grid[1][3].color = value ? "lightgreen" : "grey"; }
    get out0() { return this.grid[1][0].color == "lightgreen"; }
    get out1() { return this.grid[1][1].color == "lightgreen"; }
    get out2() { return this.grid[1][2].color == "lightgreen"; }
    get out3() { return this.grid[1][3].color == "lightgreen"; }
    initUpdate() {
        if (this.grid.activated) {
            if (this.grid.activeCell.row == 0) {
                this.grid.activeCell.color = this.grid.activeCell.color != "lightgreen" ? "lightgreen" : "grey";
            }
        }
    }
    draw() {
        this.grid.draw();
    }
}
//
// Helper functions
//
export function ord(char) {
    return char.codePointAt(0);
}
export function chr(charCode) {
    return String.fromCodePoint(charCode);
}
export function randomInt(m, n) {
    return n != null ? Math.trunc(m) + Math.floor(Math.random() * (n - m + 1)) : Math.floor(Math.random() * m);
}
export function randomItem(...items) {
    return items[Math.floor(Math.random() * items.length)];
}
export function radians(degAngle) {
    return degAngle * Math.PI / 180;
}
export function degrees(radAngle) {
    return radAngle * 180 / Math.PI;
}
export function fromPolar(radius, degAngle, x0 = 0, y0 = 0) {
    const a = radians(degAngle);
    return [x0 + Math.cos(a) * radius, y0 + Math.sin(a) * radius];
}
export function rgba(red, green, blue, alpha = 1) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
export function hsla(degHue, pctSaturation = 100, pctLight = 50, alpha = 1) {
    return `hsla(${degHue}, ${pctSaturation}%, ${pctLight}%, ${alpha})`;
}
export function getPixel(x, y) {
    const data = ctx.getImageData(x, y, 1, 1).data;
    return { red: data[0], green: data[1], blue: data[2], alpha: data[3] };
}
export function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
export function sleep(msDuration) {
    return new Promise(resolve => setTimeout(() => resolve(), msDuration)); // TODO, reject?
}
export function array(length, value) {
    if (typeof value == "function") {
        let a = [];
        for (let i = 0; i < length; i++) {
            a[i] = value(i);
        }
        return a;
    }
    return Array(length).fill(value);
}
export function array2D(rows, columns, value) {
    if (typeof value == "function") {
        let m = [];
        for (let i = 0; i < rows; i++) {
            m[i] = [];
            for (let j = 0; j < columns; j++) {
                m[i][j] = value(i, j);
            }
        }
        return m;
    }
    return Array(rows).fill(null).map(() => Array(columns).fill(value));
}
export function range(a, b, c = 1) {
    const r = [];
    if (b == null) {
        [a, b] = [0, a];
    }
    if (c > 0) {
        for (let i = a; i < b; i += c) {
            r.push(i);
        }
    }
    else if (c < 0) {
        for (let i = a; i > b; i += c) {
            r.push(i);
        }
    }
    else {
        throw new RangeError("'by' must not be zero");
    }
    return r;
}
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// 3.2
export function imagePath(value, color = "black") {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "124px consolas,monospace";
    const w = ctx.measureText(value).width;
    canvas.width = w;
    canvas.height = 132;
    ctx.font = "124px consolas,monospace";
    ctx.fillStyle = color;
    ctx.fillText(value, 0, 106);
    return canvas.toDataURL("image/png");
}
export async function imagePaths(spritesheetPath, rows, columns) {
    await _loadImage(spritesheetPath);
    const _frameCanvas = document.createElement("canvas");
    const _frameCtx = _frameCanvas.getContext("2d");
    const frameWidth = _images[spritesheetPath].width / columns;
    const frameHeight = _images[spritesheetPath].height / rows;
    _frameCanvas.width = frameWidth;
    _frameCanvas.height = frameHeight;
    let paths = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            _frameCtx.clearRect(0, 0, frameWidth, frameHeight); // 3.1.1
            _frameCtx.drawImage(_images[spritesheetPath], j * frameWidth, i * frameHeight, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
            paths.push(_frameCanvas.toDataURL("image/png"));
        }
    }
    return paths;
}
//
// GUI functions
//
export let div;
export function add(tagName, arg1, arg2, arg3, newline = true) {
    let elt;
    if (_outputElt) {
        _outputValue += _outputElt.textContent.trimEnd();
        _outputElt = null;
    }
    if (typeof arg1 == "string") {
        if (_lbltags.includes(tagName.split(":")[0])) {
            let labelElt = add("label", arg2, arg3, newline);
            labelElt.style.display = "inline-flex";
            if (["input:checkbox", "input:radio"].includes(tagName)) {
                labelElt.style.flexDirection = "row-reverse";
            }
            else {
                labelElt.style.flexDirection = "column";
            }
            if (arg1.endsWith("\\ ")) {
                arg1 = arg1.slice(0, -2);
                labelElt.style.flexDirection = "row";
                labelElt.style.gap = "0.25em";
            }
            add("span", arg1, labelElt);
            elt = add(tagName, labelElt);
            return elt;
        }
        elt = document.createElement(tagName);
        if (tagName == "fieldset") {
            add("legend", arg1, elt);
        }
        else if (tagName == "details") {
            add("summary", arg1, elt);
        }
        else if (tagName == "table") {
            add("caption", arg1, elt);
        }
        else {
            if (arg1.startsWith("\\ ")) {
                elt.innerHTML = arg1.slice(2);
            }
            else {
                elt.textContent = arg1;
            }
        }
    }
    else {
        newline = arg3 === undefined ? true : arg3;
        [arg3, arg2] = [arg2, arg1];
        if (tagName == "balder-canvas") {
            elt = document.createElement("canvas", { is: 'balder-canvas' });
        }
        else if (tagName.startsWith("input:")) {
            elt = document.createElement("input");
            elt.type = tagName.substr(6);
        }
        else {
            elt = document.createElement(tagName);
        }
    }
    let parent = arg2 ?? div ?? document.body;
    let before = arg3;
    if (tagName == "input:radio") {
        elt.name =
            parent instanceof HTMLFieldSetElement ?
                parent.querySelector("legend")?.textContent :
                parent.parentElement instanceof HTMLFieldSetElement ?
                    parent.parentElement.querySelector("legend")?.textContent :
                    " ";
    }
    if (newline) {
        before = parent.insertBefore(document.createTextNode("\n"), before);
    }
    parent.insertBefore(elt, before);
    return elt;
}
export function setLabel(labeledElement, text) {
    if (labeledElement.parentElement instanceof HTMLLabelElement) {
        const spanElt = labeledElement.parentElement.querySelector("span");
        if (spanElt) {
            spanElt.textContent = text;
            return;
        }
    }
    throw new Error("'labeledElement' is not labeled");
}
export function getLabel(labeledElement) {
    if (labeledElement.parentElement instanceof HTMLLabelElement) {
        const spanElt = labeledElement.parentElement.querySelector("span");
        if (spanElt) {
            return spanElt.textContent;
        }
    }
    throw new Error("'labeledElement' is not labeled");
}
export function addSVG(tagName, parent = div ?? document.body) {
    let elt = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    parent.appendChild(elt);
    return elt;
}
let _debugElt;
export function debug(...values) {
    if (!_debugElt) {
        _debugElt = add("div", document.body);
        _debugElt.style.maxHeight = "5em";
        _debugElt.style.overflowY = "auto";
        _debugElt.style.fontFamily = "monospace";
        _debugElt.style.backgroundColor = "lightyellow";
        _debugElt.style.color = "black";
        _debugElt.style.border = "1px solid black";
        _debugElt.style.position = "fixed";
        _debugElt.style.bottom = "4px";
        _debugElt.style.left = "0";
        _debugElt.style.width = "100%";
        _debugElt.style.zIndex = "2147483646";
        _debugElt.onclick = () => {
            _debugElt?.remove();
            _debugElt = null;
        };
    }
    add("div", values.map(v => str(v)).join(" "), _debugElt);
    _debugElt.scrollTop = _debugElt.scrollHeight;
}
let _canvas = document.querySelector("canvas[is=balder-canvas]");
if (_canvas) {
    canvas = _canvas;
}
else {
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
//# sourceMappingURL=balder.js.map