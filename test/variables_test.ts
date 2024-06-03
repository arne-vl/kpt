import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"

import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { NumberValue } from "../src/runtime/values.ts";

Deno.test("variables test", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "altij x = 100";
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 100 } as NumberValue)

    input = "efkes y = 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    input = "y = 50"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 50 } as NumberValue)

    input = "pi"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: Math.PI } as NumberValue)
})