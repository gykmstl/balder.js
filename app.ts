import { input, output } from "./balder.js";

let x = await input("x:")
let y = await input("y:")

output(x + y)

// output(createArray(10, i => i))

// let b = createArray(12, (i) => {
//     return () => randomInt(100)
// })

// output(b[0]())

// let a = array(3, () => randomInt(10))

// output(a, a[0])
// output(a[0] + 1)


// let m2 = array2D(3, 4, () => randomInt(10))
// output(m2)
// output(m2[0][0] + 1)

// let c = new Controller(20, 20)
// c.in0 = c.in1 = true

// c.out3 = true

// setUpdate(() => {
//     clear()

//     c.out1 = c.in0 || c.in1
//     c.out0 = c.in0 && c.in1 && c.in2 && c.in3

//     c.draw()
// })


// setInputs("111", "333", "55")

// let a = +await input("a", 12)
// let b = +await input("a", 24)

// output(a + a)

// createTest()


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