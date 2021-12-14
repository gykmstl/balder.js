import { add, circle, clear, debug, div, getPixel, input, keyboard, mouse, output, pixel, resetCanvas, setUpdate, sleep, Sprite, text } from "./balder.js";

let x = 100



setUpdate(() => {
    circle(x, 100, 20)
    
    if (keyboard.d) {
        keyboard.d = false
        x++
        div.innerHTML=""
        output(x)
    }
    
})


// let n = +await input("Ett heltal")
// output(n ** 2)


// add("button", "reload").onclick = () => {
//     location.reload()
// }