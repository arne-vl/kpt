import { NumberValue, ObjectValue } from "../values.ts";
import { BooleanValue } from "../values.ts";
import { create_internal_function, create_null, RuntimeValue, create_number } from "../values.ts";
import Environment from "./environment.ts";

export function setup_internal_functions(environment: Environment): Environment {
    environment.declare_variable(
        "zegt",
        create_internal_function((_args, _environment) => {
            print_function(_args, _environment);
            return create_null();
        }),
        true
    );

    environment.declare_variable(
        "waduurist",
        create_internal_function((_args, _environment) => {
            return time_function(_args, _environment);
        }),
        true
    );

    return environment;
}

function print_function(_args: RuntimeValue[], _environment: Environment) {
    _args.forEach(arg => {
        console.log(pretty_print(arg, 0))
    });
}

function pretty_print(value: RuntimeValue, indent_level: number): string {
    const indent = '  '.repeat(indent_level)
    switch (value.type) {
        case "object": {
            const entries = Array.from((value as ObjectValue).properties.entries())
            const formatted_properties = entries.map(([key, val]) => {
                const nested_indent = '  '.repeat(indent_level + 1)
                return `${nested_indent}${key}: ${pretty_print(val, indent_level + 1)}`
            })
            return `{\n${formatted_properties.join(",\n")}\n${indent}}`
        }
        case "number":
            return (value as NumberValue).value.toString()
        case "boolean":
            return (value as BooleanValue).value == true ? "just" : "nijust"
        case "null":
            return "null"
        default:
            return ""
    }
}

function time_function (_args: RuntimeValue[], _environment: Environment){
    return create_number(Date.now())
}