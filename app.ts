import { imagePath, canvas, div, Grid, image, imagePaths, output, randomInt, text, debug } from "./balder.js";

// text("Ai", 100, 100, 48)
// text("w0iwa", 100, 200, 124, "red")


let g = new Grid(4, 6)
g[1][2].image = imagePath("0")
g[1][3].image = imagePath("XÅg")
g[2][3].image = imagePath("0")
g[0][0].image = imagePath("Ö")
g[1][0].image = imagePath("g")

debug(g[1][2].image == g[2][3].image)
// output(imagePath("X", "red"))
// image(imagePath("W"))
// let y = f("abc")

// output(y["a"])

// let g = new Grid(9, 9)
// let nrs = await imagePaths("numbers3.jpg", 2, 5)

// for (let i = 0; i < 9; i += 1) {
//     for (let j = 0; j < 9; j += 1) {
//         g[i][j].tag = new Grid(3, 3, g[i][j].x, g[i][j].y, g[i][j].width, g[i][j].height)

//         let rc = Math.floor(i / 3)
//         let cc = Math.floor(j / 3)

//         for (let ii = 0; ii < 3; ii += 1) {
//             for (let jj = 0; jj < 3; jj += 1) {
//                 if ((rc + cc) % 2 == 1) {
//                     g[i][j].tag[ii][jj].color = "lightgrey"
//                 }

//                 g[i][j].tag[ii][jj].image = nrs[randomInt(10)]
//             }
//         }
//         g[i][j].custom = (c) => {
//             c.tag.draw()
//         }
//     }
// }

// g[2][3].image = nrs[3]
// g[1][3].image = nrs[5]
// g[0][3].image = nrs[8]


// setInputs(`5 5 4
// v>^v
// #####
// #O#.#
// #...#
// ##..#
// #####`)

// const [R, C, N] = (await input("R C N")).split(" ").map(v => +v)
// let commands = await input("commands")

// let g = new Grid(R, C)

// let r: number
// let c: number

// for (let i = 0; i < R; i++) {
//     let row = await input("Row " + i + "\\ ")
//     for (let j = 0; j < C; j++) {
//         let cell = g[i][j]
//         cell.color = "white"

//         switch (row[j]) {
//             case "#": cell.image = "lada.PNG"; break
//             case "O": cell.image = "robot.PNG"; r = i; c = j; break
//         }
//     }
// }

// // resetCanvas()
// div.textContent = ""
// g.draw()

// let count = 0

// const dirs = {
//     "<": [0, -1],
//     ">": [0, 1],
//     "^": [-1, 0],
//     "v": [1, 0]
// }

// for (let i = 0; i < N; i++) {
//     let command = commands[i]
//     let [dr, dc] = dirs[command]

//     while (true) {
//         if (g[r][c].color != "green") {
//             g[r][c].color = "green"
//             count++
//         }

//         if (g[r + dr][c + dc].image == "lada.PNG") break;

//         await sleep(200)

//         g[r][c].image = null
//         r += dr
//         c += dc
//         g[r][c].image = "robot.PNG"
//     }

// }

// output(count)