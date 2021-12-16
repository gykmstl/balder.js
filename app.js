import { add, W, H, mouse, resetCanvas, setUpdate, str } from "./balder.js";
let p = add("p", "---");
resetCanvas();
setUpdate(() => {
    p.textContent = str(mouse) + " " + W + " " + H;
});
//# sourceMappingURL=app.js.map