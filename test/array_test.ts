import { assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import Parser from "../src/frontend/parser.ts";
import { setup_global_environment } from "../src/runtime/environment/environment.ts";
import { evaluate } from "../src/runtime/interpreter.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { ArrayValue, NumberValue } from "../src/runtime/values.ts";


Deno.test("array tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "altij rij = [1, 2, 3]"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    let expected = { type: "array", values: [ { type: "number", value: 1 } as NumberValue, { type: "number", value: 2 } as NumberValue, { type: "number", value: 3 } as NumberValue ] }

    assertEquals(result, expected as ArrayValue)

    input = "altij lege_rij = []"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    expected = { type: "array", values: [] }

    assertEquals(result, expected as ArrayValue)

    input = "rij.derbij(4)"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    expected = { type: "array", values: [ { type: "number", value: 1 } as NumberValue, { type: "number", value: 2 } as NumberValue, { type: "number", value: 3 } as NumberValue, { type: "number", value: 4 } as NumberValue ] }

    assertEquals(result, expected as ArrayValue)

    assertThrows(
        () => {
            input = "rij.derbij()"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "Ge moet er wel iet bij doen dan he"
    )

    input = "rij.deraf()"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    expected = { type: "array", values: [ { type: "number", value: 1 } as NumberValue, { type: "number", value: 2 } as NumberValue, { type: "number", value: 3 } as NumberValue ] }
    
    assertEquals(result, expected as ArrayValue)

    assertThrows(
        () => {
            input = "rij.deraf(5)"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "'deraf' kan gen argumente hebbe"
    )
})