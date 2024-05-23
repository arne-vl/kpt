import Parser from "./src/frontend/parser.ts";
import { setup_global_environment } from "./src/runtime/environment/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

//_repl()
_run("examples/example.kpt")

async function _run(filename: string){
    const parser = new Parser()
    const environment = setup_global_environment()

    const input = await Deno.readTextFile(filename)
    const program = parser.produce_ast(input)
    evaluate(program, environment)
}

function _repl() {
    const parser = new Parser()
    const environment = setup_global_environment()

    console.log("KPT v0.2")

    while (true){
        const input = prompt(">>")

        if (!input || input.includes("deruit")) {
            Deno.exit(1)
        }

        const program = parser.produce_ast(input)        
        evaluate(program, environment)
    }
}