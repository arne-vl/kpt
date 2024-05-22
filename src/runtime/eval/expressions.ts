import { AssignmentExpression, BinaryExpression, CallExpression, Identifier, MemberExpression, ObjectLiteral } from "../../frontend/ast.ts";
import Environment from "../environment/environment.ts";
import { evaluate } from "../interpreter.ts";
import { InternalFunctionValue, NumberValue, ObjectValue, RuntimeValue, create_null } from "../values.ts";

function evaluate_numeric_binary_expression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
    let result = 0

    if (operator == "+") {
        result = left.value + right.value
    } else if (operator == "-") {
        result = left.value - right.value
    } else if (operator == "*") {
        result = left.value * right.value
    } else if (operator == "**") {
        result = left.value ** right.value
    } else if (operator == "/") {
        
        if (right.value == 0) {
            console.error("Ej ge kunt toch ni dele door 0 zeker")
            Deno.exit(1)
        }

        result = left.value / right.value
    } else if (operator == "//") {
        result = Math.floor(left.value / right.value)
    } else {
        result = left.value % right.value
    }

    return { type: "number", value: result }
}

export function evaluate_binary_expression(expression: BinaryExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)
    const right = evaluate(expression.right, environment)

    if(left.type == "number" && right.type == "number") {
        return evaluate_numeric_binary_expression(left as NumberValue, right as NumberValue, expression.operator)
    }

    return create_null()
}

export function evaluate_identifier(identifier: Identifier, envrionment: Environment): RuntimeValue {
    const value = envrionment.lookup_variable(identifier.symbol)
    return value
}

export function evaluate_variable_assignment(expression: AssignmentExpression, environment: Environment): RuntimeValue {
    if (expression.assignee.kind != "Identifier") {
        throw `Ge kunt die waarde ni wijzige: ${JSON.stringify(expression.assignee)}`
    }

    const varname = (expression.assignee as Identifier).symbol

    return environment.assign_variable(varname, evaluate(expression.value, environment))
}

export function evaluate_object_expression(object: ObjectLiteral, environment: Environment): RuntimeValue {
    const obj = { type: "object", properties: new Map() } as ObjectValue

    for (const { key, value } of object.properties) {
        const runtime_value = (value == undefined) ? environment.lookup_variable(key) : evaluate(value, environment)

        obj.properties.set(key, runtime_value)
    }

    return obj
}

export function evaluate_call_expression(expression: CallExpression, environment: Environment): RuntimeValue {
    const args = expression.args.map((arg) => evaluate(arg, environment))

    const fn = evaluate(expression.caller, environment)

    if (fn.type != "internal_function") {
        throw `Kan daar ni aan want das geen funkse: ${expression.caller}`
    }

    const result = (fn as InternalFunctionValue).call(args, environment)
    return result
}

export function evaluate_member_expression(expression: MemberExpression, environment: Environment): RuntimeValue {
    const object = evaluate(expression.object, environment) as ObjectValue
    const property = expression.property as Identifier

    if (object.properties != undefined && object.properties.has(property.symbol)) {
        return object.properties.get(property.symbol) as NumberValue
    } else {
        throw `Da besta ni manneke: ${property.symbol}`
    }
}