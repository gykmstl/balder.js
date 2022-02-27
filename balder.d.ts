export declare let W: number;
export declare let H: number;
export declare let ctx: CanvasRenderingContext2D;
declare class BalderCanvas extends HTMLCanvasElement {
    constructor();
    connectedCallback(): void;
}
export declare let canvas: BalderCanvas;
export declare let deltaTime: number;
export declare function setUpdate(handler?: () => void): void;
export declare function resetCanvas(): void;
export declare function setInputs(...values: (string | number)[]): void;
export declare function input(prompt?: string, defaultValue?: string | number): Promise<string>;
export declare function output(...values: any[]): void;
export declare function output(...args: [...values: any[], end: "" | " " | "\t" | "\n"]): void;
export declare function str(value: any): string;
export declare function polygon(points: [x: number, y: number][], color?: string, lineWidth?: number): void;
export declare function line(x1: number, y1: number, x2: number, y2: number, color?: string, lineWidth?: number): void;
export declare function circle(x: number, y: number, radius: number, color?: string, lineWidth?: number): void;
export declare function rectangle(x: number, y: number, width: number, height: number, color?: string, lineWidth?: number): void;
export declare function triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color?: string, lineWidth?: number): void;
export declare function text(value: any, x?: number, y?: number, font?: number | string, color?: string, lineWidth?: number): void;
export declare function image(path: string, x?: number, y?: number, width?: number, height?: number): Promise<void>;
export declare function clear(x?: number, y?: number, width?: number, height?: number): void;
export declare function fill(color?: string, x?: number, y?: number, width?: number, height?: number): void;
export declare class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static fromPolar(length: number, angle: number): Vector2;
    get length(): number;
    set length(value: number);
    get lengthSquared(): number;
    get angle(): number;
    set angle(value: number);
    clone(): Vector2;
    add(v: Vector2): void;
    subtract(v: Vector2): void;
    multiply(v: Vector2): void;
    divide(v: Vector2): void;
    scalarMultiply(s: number): void;
    distanceTo(v: Vector2): number;
    distanceToSquared(v: Vector2): number;
    dot(v: Vector2): number;
    toString(): string;
}
export declare class Hitbox {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    intersects(other: Hitbox): boolean;
    contains(x: number, y: number): boolean;
    drawOutline(color?: string): void;
}
export declare class Sprite extends Hitbox {
    private spritesheetPath;
    private rows;
    private columns;
    private index;
    private _frames;
    private counter;
    updatesPerFrame: number;
    loop: boolean;
    tag: any;
    constructor(spritesheetPath: string, rows?: number, columns?: number, ...frames: number[]);
    private initUpdate;
    draw(): Promise<void>;
}
export declare const keyboard: {
    shiftLeft: boolean;
    shiftRight: boolean;
    backspace: boolean;
    enter: boolean;
    space: boolean;
    left: boolean;
    up: boolean;
    right: boolean;
    down: boolean;
    digit0: boolean;
    digit1: boolean;
    digit2: boolean;
    digit3: boolean;
    digit4: boolean;
    digit5: boolean;
    digit6: boolean;
    digit7: boolean;
    digit8: boolean;
    digit9: boolean;
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
    e: boolean;
    f: boolean;
    g: boolean;
    h: boolean;
    i: boolean;
    j: boolean;
    k: boolean;
    l: boolean;
    m: boolean;
    n: boolean;
    o: boolean;
    p: boolean;
    q: boolean;
    r: boolean;
    s: boolean;
    t: boolean;
    u: boolean;
    v: boolean;
    w: boolean;
    x: boolean;
    y: boolean;
    z: boolean;
    poll: () => string;
};
export declare const mouse: {
    x: number;
    y: number;
    over: boolean;
    left: boolean;
    middle: boolean;
    right: boolean;
};
export declare const touchscreen: {
    x: number;
    y: number;
    touches: {
        x: number;
        y: number;
        id: number;
    }[];
    touched: boolean;
};
export declare class Turtle {
    x: number;
    y: number;
    heading: number;
    private turtleContainer;
    private turtle;
    private pen;
    private visible;
    delay: number;
    penSize: number;
    constructor(x?: number, y?: number, heading?: number);
    get penColor(): string;
    set penColor(value: string);
    forward(length: number): Promise<void>;
    backward(length: number): Promise<void>;
    right(degAngle?: number): Promise<void>;
    left(degAngle?: number): Promise<void>;
    penUp(): void;
    penDown(): void;
    hide(): void;
    show(): void;
}
export declare class Cell {
    private _grid;
    readonly row: number;
    readonly column: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    private _color;
    private _image;
    private _custom;
    tag: any;
    constructor(_grid: _Grid, row: number, column: number, x: number, y: number, width: number, height: number);
    get grid(): Grid;
    get color(): string | null;
    set color(value: string | null);
    get image(): string | null;
    set image(value: string | null);
    get custom(): ((cell: Cell) => void) | null;
    set custom(value: ((cell: Cell) => void) | null);
    draw(): Promise<void>;
}
declare class _Grid {
    protected cellWidth: number;
    protected cellHeight: number;
    [row: number]: {
        [column: number]: Cell;
    };
    constructor(rows: number, columns: number, x: number, y: number, width: number, height: number, lineWidth: number);
}
export declare class Grid extends _Grid {
    readonly rows: number;
    readonly columns: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    private color;
    private lineWidth;
    private activatable;
    private _activeCell;
    readonly [row: number]: {
        readonly [column: number]: Cell;
    };
    constructor(rows: number, columns: number, x?: number, y?: number, width?: number, height?: number, color?: string, lineWidth?: number);
    get activated(): boolean;
    get activeCell(): Cell | null;
    getCell(x: number, y: number): Cell | null;
    draw(): void;
}
export declare class Controller {
    private grid;
    constructor(x?: number, y?: number, width?: number, height?: number);
    set in0(value: boolean);
    set in1(value: boolean);
    set in2(value: boolean);
    set in3(value: boolean);
    get in0(): boolean;
    get in1(): boolean;
    get in2(): boolean;
    get in3(): boolean;
    set out0(value: boolean);
    set out1(value: boolean);
    set out2(value: boolean);
    set out3(value: boolean);
    get out0(): boolean;
    get out1(): boolean;
    get out2(): boolean;
    get out3(): boolean;
    private initUpdate;
    draw(): void;
}
export declare function ord(char: string): number | undefined;
export declare function chr(charCode: number): string;
export declare function randomInt(maxExclusive: number): number;
export declare function randomInt(min: number, max: number): number;
export declare function randomItem<T>(...items: T[]): T;
export declare function radians(degAngle: number): number;
export declare function degrees(radAngle: number): number;
export declare function fromPolar(radius: number, degAngle: number, x0?: number, y0?: number): [x: number, y: number];
export declare function rgba(red: number, green: number, blue: number, alpha?: number): string;
export declare function hsla(degHue: number, pctSaturation?: number, pctLight?: number, alpha?: number): string;
export declare function getPixel(x: number, y: number): {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};
export declare function distance(x1: number, y1: number, x2: number, y2: number): number;
export declare function sleep(msDuration: number): Promise<void>;
export declare function array(length: number, value: string): string[];
export declare function array(length: number, value: number): number[];
export declare function array(length: number, value: boolean): boolean[];
export declare function array<T>(length: number, value: ((index?: number) => T)): T[];
export declare function array2D(rows: number, columns: number, value: string): string[][];
export declare function array2D(rows: number, columns: number, value: number): number[][];
export declare function array2D(rows: number, columns: number, value: boolean): boolean[][];
export declare function array2D<T>(rows: number, columns: number, value: ((row?: number, column?: number) => T)): T[][];
export declare function range(from: number, toExclusive: number): number[];
export declare function range(from: number, toExclusive: number, by: number): number[];
export declare function range(toExclusive: number): number[];
export declare function shuffle<T>(array: T[]): T[];
export declare function imagePath(value: string, color?: string): string;
export declare function imagePaths(spritesheetPath: string, rows: number, columns: number): Promise<string[]>;
export declare let div: HTMLDivElement | null;
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
export interface TagNameMap extends HTMLElementTagNameMap, _ExtraTagMap {
}
export declare function add<K extends keyof TagNameMap>(tagName: K, text?: string, parent?: HTMLElement, before?: Node, newline?: boolean): TagNameMap[K];
export declare function add<K extends keyof TagNameMap>(tagName: K, parent?: HTMLElement, before?: Node, newline?: boolean): TagNameMap[K];
export declare function setLabel(labeledElement: HTMLElement, text: string): void;
export declare function getLabel(labeledElement: HTMLElement): string;
export declare function addSVG(tagName: "svg", parent?: HTMLElement | SVGSVGElement): SVGSVGElement;
export declare function addSVG<K extends keyof Omit<SVGElementTagNameMap, "svg">>(tagName: K, parent: SVGSVGElement): SVGElementTagNameMap[K];
export declare function debug(...values: any[]): void;
export {};
