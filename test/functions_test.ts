import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { InternalFunctionValue } from "../src/runtime/values.ts"

// Placeholder for other functions tests
Deno.test("functions tests", () => {
    // TODO: Add tests for other functions
})

// Global Functions Test
Deno.test("global functions test", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    // Test the global function 'zegt'
    let input = "zegt"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    // Assert that the result is an internal function
    assertEquals((result as InternalFunctionValue).type, "internal_function")
    // Assert that the 'call' property of the result is a function
    assert(typeof (result as InternalFunctionValue).call === "function")

    // Test the global function 'waduurist'
    input = "waduurist"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)

    // Assert that the result is an internal function
    assertEquals((result as InternalFunctionValue).type, "internal_function")
    // Assert that the 'call' property of the result is a function
    assert(typeof (result as InternalFunctionValue).call === "function")
})
