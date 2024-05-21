import Parser from "./src/frontend/parser.ts";
import Environment from "./src/runtime/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

// repl()
run("test/test.kpt")

async function run(filename: string){
    const parser = new Parser()
    const environment = new Environment()

    const input = await Deno.readTextFile(filename)
    const program = parser.produce_ast(input)
    const result = evaluate(program, environment)

    console.log(result)
}

function _repl() {
    const parser = new Parser()
    const environment = new Environment()

    console.log("KPT v0.2")

    while (true){
        const input = prompt(">>")

        if (!input || input.includes("deruit")) {
            Deno.exit(1)
        }

        const program = parser.produce_ast(input)
        const result = evaluate(program, environment)

        console.log(result)

    }
}