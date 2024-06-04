import { assert, assertAlmostEquals, assertEquals, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts"
import Parser from "../src/frontend/parser.ts"
import { setup_global_environment } from "../src/runtime/environment/environment.ts"
import { evaluate } from "../src/runtime/interpreter.ts"
import { DateObject, InternalFunctionValue, NumberValue, RuntimeValue } from "../src/runtime/values.ts"

// Placeholder for other functions tests
Deno.test("functions tests", () => {
    // TODO: Add tests for other functions
})

// Waduurist Test
Deno.test("waduurist test", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "waduurist"
    let program = parser.produce_ast(input)
    let result = evaluate(program, environment)

    assertEquals((result as InternalFunctionValue).type, "internal_function")
    assert(typeof (result as InternalFunctionValue).call == "function")

    input = "waduurist()"
    program = parser.produce_ast(input)
    result = evaluate(program, environment)
    const date = new Date(Date.now())
    const date_object = result as DateObject

    assertEquals((date_object.properties.get("jaar") as NumberValue).value, date.getFullYear())
    assertEquals((date_object.properties.get("mond") as NumberValue).value, date.getMonth() + 1) // months start with 0
    assertEquals((date_object.properties.get("dag") as NumberValue).value, date.getDate())
    assertEquals((date_object.properties.get("tuur") as NumberValue).value, date.getHours())
    assertEquals((date_object.properties.get("minuut") as NumberValue).value, date.getMinutes())

    const resultMilliseconds = (date_object.properties.get("millisecond") as NumberValue).value
    assertAlmostEquals(resultMilliseconds, date.getMilliseconds(), 500) // 500ms tolerance
})

// Zegt Test
Deno.test("zegt test", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "zegt"
    let program = parser.produce_ast(input)
    let result: RuntimeValue | string = evaluate(program, environment)

    assertEquals((result as InternalFunctionValue).type, "internal_function")
    assert(typeof (result as InternalFunctionValue).call === "function")
    
    input = "zegt()"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "")

    input = "zegt(5)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "5")

    input = "zegt(\"Juw wereld!\")"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "Juw wereld!")

    input = "zegt(\"Juw\", \"mannekes\")"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "Juw mannekes")

    input = "zegt(zegt)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "<inwendige funkse>")

    const object_input = "altij object = { y: 14, z: \"hallo\" }"
    program = parser.produce_ast(object_input)
    evaluate(program, environment)
    input = "zegt(object)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "{'y': 14, 'z': 'hallo'}")

    const date_input = "altij datum = waduurist()"
    const date = new Date(Date.now())
    program = parser.produce_ast(date_input)
    evaluate(program, environment)
    input = "zegt(datum)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })
    const regex = new RegExp(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.\\d{3}Z`)

    assertMatch(result, regex)

    const array_input = "altij array = [10, 20, \"juw\"]"
    program = parser.produce_ast(array_input)
    evaluate(program, environment)
    input = "zegt(array)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "[10, 20, 'juw']")

    const function_input = "funkse test(){zegt(\"test\")}"
    program = parser.produce_ast(function_input)
    evaluate(program, environment)
    input = "zegt(test)"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "<test: funkse>")
})

// Capture console output
function capture_console_output(fn: () => void): string {
    const originalLog = console.log
    let output = ""
    console.log = (...args: unknown[]) => {
        output += args.join(" ") + "\n"
    }
    try {
        fn()
    } finally {
        console.log = originalLog
    }
    return output.trim()
}