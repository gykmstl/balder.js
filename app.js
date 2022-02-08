import { input, Grid, sleep, setInputs, div } from "./balder.js";
setInputs(`5 5 4
v>^v
#####
#O#.#
#...#
##..#
#####`);
const [R, C, N] = (await input("R C N")).split(" ").map(v => +v);
let commands = await input("commands");
let g = new Grid(R, C);
let r;
let c;
for (let i = 0; i < R; i++) {
    let row = await input("Row " + i + "\\ ");
    for (let j = 0; j < C; j++) {
        let cell = g[i][j];
        cell.color = "white";
        switch (row[j]) {
            case "#":
                cell.image = "lada.PNG";
                break;
            case "O":
                cell.image = "robot.PNG";
                r = i;
                c = j;
                break;
        }
    }
}
// resetCanvas()
div.textContent = "";
g.draw();
let count = 0;
const dirs = {
    "<": [0, -1],
    ">": [0, 1],
    "^": [-1, 0],
    "v": [1, 0]
};
for (let i = 0; i < N; i++) {
    let command = commands[i];
    let [dr, dc] = dirs[command];
    while (true) {
        if (g[r][c].color != "green") {
            g[r][c].color = "green";
            count++;
        }
        if (g[r + dr][c + dc].image == "lada.PNG")
            break;
        await sleep(200);
        g[r][c].image = null;
        r += dr;
        c += dc;
        g[r][c].image = "robot.PNG";
    }
}
// output(count)
//# sourceMappingURL=app.js.map