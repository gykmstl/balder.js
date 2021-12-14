import { add, circle, clear, debug, getPixel, mouse, output, pixel, resetCanvas, setUpdate, Sprite, text } from "./balder.js";


// let t = add("table", "övwerskrift")

// for (let j = 0; j < 10; j++) {
    
    //     let tr = add("tr", t)

    //     for (let i = 0; i < 10; i++) {
        //         add("td", i.toString(), tr)
        //     }
        // }
        
        // let s = new Sprite("sheet8.png", 3, 6)
        
        // s.draw()
        
        // output(s)
        
// localStorage.setItem('s', JSON.stringify(s))

add("button", "clear").onclick = () => {
    // let x = document.getElementsByTagName("canvas")[0]
    // let x = customElements.get("balder-canvas") as BalderCanvas
    debug(123)
}

resetCanvas()
circle(100, 100, 100)

// document.body.style.flexFlow = "column"