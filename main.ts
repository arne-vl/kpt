import Parser from "./src/frontend/parser.ts";
import { setup_global_environment } from "./src/runtime/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";

//_repl()
_run("test/test.kpt")

async function _run(filename: string){
    const parser = new Parser()
    const environment = setup_global_environment()

    const input = await Deno.readTextFile(filename)
    const program = parser.produce_ast(input)
    const result = evaluate(program, environment)

    console.log(result)
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
        const result = evaluate(program, environment)

        console.log(result)

    }
}