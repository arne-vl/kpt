import { Statement } from "../frontend/ast.ts";
import Environment from "./environment/environment.ts";

export type ValueType = 
    | "null"
    | "number"
    | "string"
    | "boolean"
    | "object"
    | "dateobject"
    | "array"
    | "internal_function"
    | "function"

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

export interface StringValue extends RuntimeValue {
    type: "string"
    value: string
}

export function create_string(n = ""): StringValue {
    return { type: "string", value: n}
}

export interface Object extends RuntimeValue {}

export interface ObjectValue extends Object {
    type: "object"
    properties: Map<string, RuntimeValue>
}

export function create_object(properties: Map<string, RuntimeValue>): ObjectValue {
    return { type: "object", properties: properties }
}

export interface DateObject extends Object {
    type: "dateobject"
    properties: Map<string, RuntimeValue>
}

export function create_date_object(properties: Map<string, RuntimeValue>): DateObject {
    return { type: "dateobject", properties: properties }
}

export interface ArrayValue extends Object {
    type: "array"
    values: Array<RuntimeValue>
}

export type FunctionCall = (args: RuntimeValue[], environment: Environment) => RuntimeValue

export interface InternalFunctionValue extends RuntimeValue {
    type: "internal_function"
    call: FunctionCall
}

export function create_internal_function(call: FunctionCall) {
    return { type: "internal_function", call } as InternalFunctionValue
}

export interface FunctionValue extends RuntimeValue {
    type: "function"
    name: string
    parameters: string[]
    declaration_environment: Environment
    body: Statement[]
}