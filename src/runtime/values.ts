export type ValueType = 
    "null"
    | "number"
    | "boolean"

export interface RuntimeValue {
    type: ValueType
}

export interface NullValue extends RuntimeValue {
    type: "null",
    value: null
}

export function create_null(): NullValue {
    return { type: "null", value: null}
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean",
    value: boolean
}

export function create_boolean(b = false): BooleanValue {
    return { type: "boolean", value: b}
}

export interface NumberValue extends RuntimeValue {
    type: "number",
    value: number
}

export function create_number(n = 0): NumberValue {
    return { type: "number", value: n}
}