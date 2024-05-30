import { DateObject, FunctionValue, NumberValue, ObjectValue, StringValue, create_date_object, create_number, ArrayValue } from "../values.ts";
import { BooleanValue } from "../values.ts";
import { create_internal_function, create_null, RuntimeValue } from "../values.ts";
import Environment from "./environment.ts";

export function setup_internal_functions(environment: Environment): Environment {
    environment.declare_variable(
        "zegt",
        create_internal_function((_args, _environment) => {
            print_function(_args, _environment);
            return create_null()
        }),
        true
    )

    environment.declare_variable(
        "waduurist",
        create_internal_function((_args, _environment) => {
            return time_function(_args, _environment)
        }),
        true
    )

    return environment;
}

function print_function(_args: RuntimeValue[], _environment: Environment) {
    if (_args.length == 0) {
        console.log()
        return
    }

    const output = _args.map(arg => pretty_print(arg)).join(' ');
    console.log(output)
}

function pretty_print(value: RuntimeValue, quotes: boolean = false): string {
    switch (value.type) {
        case "array": {
            const entries = (value as ArrayValue).values
            let str = "["

            entries.forEach((entry, idx) => {
                str += pretty_print(entry, true)

                if (idx != entries.length - 1) str += ", "
            });

            str += "]"

            return str
        }
        case "object": {
            const entries = Array.from((value as ObjectValue).properties.entries())
            const formatted_properties = entries.map(([key, val]) => {
                return `'${key}': ${pretty_print(val, true)}`
            });
            return `{${formatted_properties.join(", ")}}`
        }
        case "dateobject": {
            const date = value as DateObject;

            const year = (date.properties.get("jaar") as NumberValue).value
            const month = (date.properties.get("mond") as NumberValue).value
            const day = (date.properties.get("dag") as NumberValue).value

            const hours = (date.properties.get("tuur") as NumberValue).value
            const minutes = (date.properties.get("minuut") as NumberValue).value
            const seconds = (date.properties.get("second") as NumberValue).value

            const milliseconds = (date.properties.get("millisecond") as NumberValue).value
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`
        }
        case "number":
            return (value as NumberValue).value.toString()
        case "string":
            if (quotes) {
                return "'" + (value as StringValue).value + "'"
            } else {
                return (value as StringValue).value
            }
        case "function":
            return `<${(value as FunctionValue).name}: funkse>`
        case "internal_function":
            return "<inwendige funkse>"
        case "boolean":
            return (value as BooleanValue).value ? "just" : "nijust"
        case "null":
            return "nikske"
        default:
            return "";
    }
}

function time_function(_args: RuntimeValue[], _environment: Environment) {
    const date = new Date(Date.now())
    const properties: Map<string, RuntimeValue> = new Map()

    properties.set("jaar", create_number(date.getFullYear()))
    properties.set("mond", create_number(date.getMonth() + 1))
    properties.set("dag", create_number(date.getDate()))

    properties.set("tuur", create_number(date.getHours()))
    properties.set("minuut", create_number(date.getMinutes()))
    properties.set("second", create_number(date.getSeconds()))

    properties.set("millisecond", create_number(date.getMilliseconds()))

    return create_date_object(properties)
}