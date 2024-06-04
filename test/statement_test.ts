import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts"
import Parser from "../src/frontend/parser.ts";
import { setup_global_environment } from "../src/runtime/environment/environment.ts";
import { evaluate } from "../src/runtime/interpreter.ts";

// If statement tests
Deno.test("if statement tests", () => {
    const parser = new Parser()
    const environment = setup_global_environment()

    let input = "as(just){zegt(\"hallo\")}"
    let program = parser.produce_ast(input)
    let result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "hallo")

    assertThrows(
        () => {
            input = "as(\"hallo\"){zegt(\"hallo\")}"
            program = parser.produce_ast(input)
            evaluate(program, environment)
        },
        Error,
        "As ga alleen as het just of nijust is"
    )

    input = "as(5>10){zegt(\"hallo\")} aans {zegt(\"nieje\")}"
    program = parser.produce_ast(input)
    result = capture_console_output(() => {
        evaluate(program, environment)
    })

    assertEquals(result, "nieje")
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