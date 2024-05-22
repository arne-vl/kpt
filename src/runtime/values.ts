import Environment from "./environment/environment.ts";

export type ValueType = 
    | "null"
    | "number"
    | "boolean"
    | "object"
    | "internal_function"

export interface RuntimeValue {
    type: ValueType
}

export interface NullValue extends RuntimeValue {
    type: "null"
    value: null
}

export function create_null(): NullValue {
    return { type: "null", value: null}
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean"
    value: boolean
}

export function create_boolean(b = false): BooleanValue {
    return { type: "boolean", value: b}
}

export interface NumberValue extends RuntimeValue {
    type: "number"
    value: number
}

export function create_number(n = 0): NumberValue {
    return { type: "number", value: n}
}

export interface ObjectValue extends RuntimeValue {
    type: "object"
    properties: Map<string, RuntimeValue>
}

export type FunctionCall = (args: RuntimeValue[], environment: Environment) => RuntimeValue

export interface InternalFunctionValue extends RuntimeValue {
    type: "internal_function"
    call: FunctionCall
}

export function create_internal_function(call: FunctionCall) {
    return { type: "internal_function", call } as InternalFunctionValue
}