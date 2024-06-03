import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts"

import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { BooleanValue, NumberValue } from "../src/runtime/values.ts"

// Operator Tests
Deno.test("operator tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Initialize variable
    let input = "altij x = 5"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    // Addition
    input = "x + 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 10 } as NumberValue)

    // Subtraction
    input = "x - 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 0 } as NumberValue)

    // Multiplication
    input = "x * 3"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 15 } as NumberValue)

    // Division
    input = "x / 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 2.5 } as NumberValue)

    // Exponentiation
    input = "x ** 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 25 } as NumberValue)

    // Floor Division
    input = "x // 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 2 } as NumberValue)

    // Modulus
    input = "x % 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 1 } as NumberValue)
})

// Assignment Operator Tests
Deno.test("assignment operator tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Initialize variable
    let input = "efkes x = 5"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    // Addition assignment
    input = "x += 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 10 } as NumberValue)

    // Subtraction assignment
    input = "x -= 3"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 7 } as NumberValue)

    // Multiplication assignment
    input = "x *= 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 14 } as NumberValue)

    // Division assignment
    input = "x /= 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 7 } as NumberValue)

    // Exponentiation assignment
    input = "x **= 2"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 49 } as NumberValue)

    // Floor division assignment
    input = "x //= 3"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 16 } as NumberValue)

    // Modulus assignment
    input = "x %= 5"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 1 } as NumberValue)

    // Error case: Assigning to something other than an identifier
    assertThrows(
        () => {
            input = "5 += 1"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "Ge kunt alleen iet toewijze aan nen identifier"
    )
})

// Unary Operator Tests
Deno.test("unary operator tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Initialize variable
    let input = "efkes y = 5"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    // Increment operator
    input = "y++"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 6 } as NumberValue)

    // Decrement operator
    input = "y--"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "number", value: 5 } as NumberValue)

    // Increment operator on a number (should throw an error)
    assertThrows(
        () => {
            input = "5++"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "++ en -- ga alleen op identifiers e"
    )

    // Decrement operator on a number (should throw an error)
    assertThrows(
        () => {
            input = "5--"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "++ en -- ga alleen op identifiers e"
    )
})

// Comparison Tests
Deno.test("comparison tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Greater than
    let input = "20 > 100"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "20 > 20"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "110 > 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    // Less than
    input = "20 < 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "110 < 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "100 < 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    // Equality
    input = "100 == 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "50 == 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    // Inequality
    input = "50 != 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "50 != 50"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    // Greater than or equal
    input = "100 >= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "110 >= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    // Less than or equal
    input = "100 <= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "90 <= 100"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)
})

// Logical Tests
Deno.test("logical tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Logical AND
    let input = "just en just"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "nijust en just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "just en nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "nijust en nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    // Logical OR
    input = "just of just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "just of nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "nijust of just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)

    input = "nijust of nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    // Logical NOT
    input = "ni just"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: false } as BooleanValue)

    input = "ni nijust"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    assertEquals(result, { type: "boolean", value: true } as BooleanValue)
})