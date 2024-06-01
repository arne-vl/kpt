import Parser from "./src/frontend/parser.ts";
import { setup_global_environment } from "./src/runtime/environment/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

const VERSION = "0.3"

const args = Deno.args

if (args.length > 1) {
    throw `Kmoet gen of 1 argument hebbe`
}

if (args.length == 0) {
    repl()
} else {
    if (args[0] == "-v" || args[0] == "--version") {
        console.log("KPT version ", VERSION)
    } else {
        run(args[0])
    }
}

async function run(filename: string){
    const parser = new Parser()
    const environment = setup_global_environment()

    const input = await Deno.readTextFile(filename)
    const program = parser.produce_ast(input)
    evaluate(program, environment)
}

function repl() {
    const parser = new Parser()
    const environment = setup_global_environment()

    console.log("KPT v", VERSION)

    while (true){
        const input = prompt(">>")

        if (!input || input.includes("deruit")) {
            Deno.exit(0)
        }

        const program = parser.produce_ast(input)        
        evaluate(program, environment)
    }
}