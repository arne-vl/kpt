import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"

import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { BooleanValue, NumberValue } from "../src/runtime/values.ts"

Deno.test("operator tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "altij x = 5"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    
    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    input = "x + 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 10 } as NumberValue)

    input = "x - 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 0 } as NumberValue)

    input = "x * 3"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 15 } as NumberValue)

    input = "x / 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 2.5 } as NumberValue)

    input = "x ** 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 25 } as NumberValue)

    input = "x // 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "number", value: 2 } as NumberValue)
})

Deno.test("comparison tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "20 > 100"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "110 > 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "20 < 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "110 < 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "100 == 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "50 == 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "50 != 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "50 != 50"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "100 >= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "100 <= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "90 <= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "110 >= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)
})

Deno.test("logical tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "just en just"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "nijust en just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "nijust of just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "just of just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "nijust of nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "ni nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "ni just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    assertEquals(result, { type: "boolean", value: false } as BooleanValue)
})