import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"

import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { NumberValue } from "../src/runtime/values.ts";
import { assertThrows } from "https://deno.land/std@0.224.0/assert/assert_throws.ts";

Deno.test("variables test", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "altij x = 100";
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 100 } as NumberValue)

    assertThrows(
        () => {
            input = "x = 5"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "Iet da altij is kunde ni verandere"
    )

    input = "efkes y = 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    assertThrows(
        () => {
            input = "efkes y = 5"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "Ik kan dees ni make want 'y' besta al"
    )

    input = "y = 50"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 50 } as NumberValue)

    assertThrows(
        () => {
            input = "z = 5"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "Da kennek ni, denk da 'z' ni besta"
    )

    input = "pi"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: Math.PI } as NumberValue)
})