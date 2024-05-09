import Parser from "./src/frontend/parser.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

repl()

function repl() {
    const parser = new Parser()

    console.log("KPT v0.1")

    while (true){
        const input = prompt(">>")

        if (!input || input.includes("deruit")) {
            Deno.exit(1)
        }

        const program = parser.produceAST(input)

        const result = evaluate(program)

        console.log(result)

    }
}