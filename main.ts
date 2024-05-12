import Parser from "./src/frontend/parser.ts";
import Environment from "./src/runtime/environment.ts";
import { evaluate } from "./src/runtime/interpreter.ts";
import { create_boolean, create_null, create_number } from "./src/runtime/values.ts";

repl()

function repl() {
    const parser = new Parser()
    const environment = new Environment()

    // GLOBAL VARIABLES
    environment.declare_variable("x", create_number(42))
    environment.declare_variable("just", create_boolean(true))
    environment.declare_variable("nijust", create_boolean())
    environment.declare_variable("nikske", create_null())

    console.log("KPT v0.2")

    while (true){
        const input = prompt(">>")

        if (!input || input.includes("deruit")) {
            Deno.exit(1)
        }

        const program = parser.produceAST(input)

        const result = evaluate(program, environment)

        console.log(result)

    }
}