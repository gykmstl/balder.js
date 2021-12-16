import { add, canvas, circle, div, fill, W, H, input, keyboard, mouse, output, resetCanvas, setUpdate, sleep, str } from "./balder.js";


let p = add("p", "---")
resetCanvas()

setUpdate(() => {
    p.textContent = str(mouse) + " " + W + " " + H 
})
