import { assertEquals, assertThrows } from "https://deno.land/std@0.224.0/assert/mod.ts";
import Parser from "../src/frontend/parser.ts";
import { setup_global_environment } from "../src/runtime/environment/environment.ts";
import { evaluate } from "../src/runtime/interpreter.ts";
import { BooleanValue, NullValue, NumberValue } from "../src/runtime/values.ts";

Deno.test("variables test", () => {
    const parser = new Parser();
    const environment = setup_global_environment();

    // Test for constant variable declaration and reassignment attempt
    let input = "altij x = 100";
    let program = parser.produce_ast(input);
    let result = evaluate(program, environment);
    assertEquals(result, { type: "number", value: 100 } as NumberValue);

    assertThrows(
        () => {
            input = "x = 5";
            program = parser.produce_ast(input);
            evaluate(program, environment);
        },
        Error,
        "Iet da altij is kunde ni verandere"
    );

    // Test for mutable variable declaration and reassignment
    input = "efkes y = 5";
    program = parser.produce_ast(input);
    result = evaluate(program, environment);
    assertEquals(result, { type: "number", value: 5 } as NumberValue);

    assertThrows(
        () => {
            input = "efkes y = 5";
            program = parser.produce_ast(input);
            evaluate(program, environment);
        },
        Error,
        "Ik kan dees ni make want 'y' besta al"
    );

    input = "y = 50";
    program = parser.produce_ast(input);
    result = evaluate(program, environment);
    assertEquals(result, { type: "number", value: 50 } as NumberValue);

    // Test for undeclared variable usage
    assertThrows(
        () => {
            input = "z = 5";
            program = parser.produce_ast(input);
            evaluate(program, environment);
        },
        Error,
        "Da kennek ni, denk da 'z' ni besta"
    );
});

Deno.test("global variables test", () => {
    const parser = new Parser();
    const environment = setup_global_environment();

    // Test for predefined global boolean variables
    let input = "just";
    let program = parser.produce_ast(input);
    let result = evaluate(program, environment);
    assertEquals(result, { type: "boolean", value: true } as BooleanValue);

    input = "nijust";
    program = parser.produce_ast(input);
    result = evaluate(program, environment);
    assertEquals(result, { type: "boolean", value: false } as BooleanValue);

    // Test for predefined global null variable
    input = "nikske";
    program = parser.produce_ast(input);
    result = evaluate(program, environment);
    assertEquals(result, { type: "null", value: null } as NullValue);

    // Test for predefined global number variable
    input = "pi";
    program = parser.produce_ast(input);
    result = evaluate(program, environment);
    assertEquals(result, { type: "number", value: Math.PI } as NumberValue);
});
