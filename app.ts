import { add, addSVG, circle, fill, image, input, output } from "./balder.js";

let a = +await input("a")
let b = +await input("b")

output(a, b, a + b)

for (let i = 0; i < 10; i++) {
    output(i, a, b, a)
}