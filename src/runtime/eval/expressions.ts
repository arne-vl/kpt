import { AssignmentExpression, AssignmentOperatorExpression, BinaryExpression, CallExpression, ComparisonExpression, Identifier, MemberExpression, ObjectLiteral, UnaryExpression, LogicalExpression, NumericLiteral, StringLiteral } from "../../frontend/ast.ts";
import Environment from "../environment/environment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanValue, FunctionValue, InternalFunctionValue, NumberValue, ObjectValue, RuntimeValue, StringValue, create_boolean, create_null, create_number, create_string } from "../values.ts";

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

        if (right.value == 0) {
            console.error("Ej ge kunt toch ni dele door 0 zeker")
            Deno.exit(1)
        }

        result = Math.floor(left.value / right.value)
    } else {
        result = left.value % right.value
    }

    return { type: "number", value: result }
}

function evaluate_string_concat(left: StringValue, right: StringValue): StringValue {
    return { type: "string", value: left.value + right.value }
}

export function evaluate_binary_expression(expression: BinaryExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)
    const right = evaluate(expression.right, environment)

    if(left.type == "number" && right.type == "number") {
        return evaluate_numeric_binary_expression(left as NumberValue, right as NumberValue, expression.operator)
    } else if ((left.type == "string" || right.type == "string") && expression.operator == "+") {
        return evaluate_string_concat(left as StringValue, right as StringValue)
    }

    return create_null()
}

export function evaluate_unary_expression(expression: UnaryExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)

    if(left.type == "number") {
        const name = (expression.left as Identifier).symbol
        const number = left as NumberValue

        number.value = expression.operator == "++" ? number.value + 1 : number.value - 1

        return environment.assign_variable(name, number)
    }
    
    return create_null()
}

export function evaluate_assignment_operator_expression(expression: AssignmentOperatorExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)
    const right = evaluate(expression.right, environment)
    const operator = expression.operator

    if(left.type == "number" && right.type == "number") {
        const name = (expression.left as Identifier).symbol
        const left_number = left as NumberValue
        const right_number = right as NumberValue
        let value = 0

        if (operator == "+=") {
            value = left_number.value + right_number.value
        } else if (operator == "-=") {
            value = left_number.value - right_number.value
        } else if (operator == "*=") {
            value = left_number.value * right_number.value
        } else if (operator == "**=") {
            value = left_number.value ** right_number.value
        } else if (operator == "/=") {
            
            if (right_number.value == 0) {
                console.error("Ej ge kunt toch ni dele door 0 zeker")
                Deno.exit(1)
            }
    
            value = left_number.value / right_number.value
        } else if (operator == "//=") {
    
            if (right_number.value == 0) {
                console.error("Ej ge kunt toch ni dele door 0 zeker")
                Deno.exit(1)
            }
            
            value = Math.floor(left_number.value / right_number.value)
        } else {
            value = left_number.value % right_number.value
        }

        return environment.assign_variable(name, { type: "number", value: value } as NumberValue)
    } else if ((left.type == "string" || right.type == "string") && expression.operator == "+=") {
        const name = (expression.left as Identifier).symbol
        const left_string = left as StringValue
        const right_string = right as StringValue

        const value = left_string.value + right_string.value

        return environment.assign_variable(name, { type: "string", value: value } as StringValue)
    }
    
    return create_null()
}

export function evaluate_logical_expression(expression: LogicalExpression, environment: Environment): RuntimeValue {
    const right = evaluate(expression.right, environment)
    if (right.type != "boolean") {
        throw `logische poorte ga alleen me just en nijust`
    }
    if (expression.left) {
        const left = evaluate(expression.left, environment)
        if (left.type != "boolean") {
            throw `logische poorte ga alleen me just en nijust`
        }
        if (expression.operator == "en") {
            return (left as BooleanValue).value && (right as BooleanValue).value ? create_boolean(true) : create_boolean(false)
        } else if (expression.operator == "of") {
            return (left as BooleanValue).value || (right as BooleanValue).value ? create_boolean(true) : create_boolean(false)
        }
    } else if (expression.operator == "!") {
        return create_boolean(!(right as BooleanValue).value)
    }

    return create_boolean()
}

function evaluate_numeric_comparison_expression(left: NumberValue, right: NumberValue, operator: string): BooleanValue {
    if (operator == "<") {
        return left.value < right.value ? create_boolean(true) : create_boolean(false)
    } else if (operator == ">") {
        return left.value > right.value ? create_boolean(true) : create_boolean(false)
    } else if (operator == "==") {
        return create_boolean(left.value == right.value)
    } else if (operator == "!=") {
        return create_boolean(left.value != right.value)
    } else if (operator == "<=") {
        return left.value <= right.value ? create_boolean(true) : create_boolean(false)
    }  else if (operator == ">=") {
        return left.value >= right.value ? create_boolean(true) : create_boolean(false)
    }

    return create_boolean(false)
}

export function evaluate_comparison_expression(expression: ComparisonExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)
    const right = evaluate(expression.right, environment)

    if (left.type == "number" && right.type == "number") {
        return evaluate_numeric_comparison_expression(left as NumberValue, right as NumberValue, expression.operator)
    }

    // TODO implement string & object comparisons

    throw `Ik kan alleen nog ma nummers vergelijke`
}

export function evaluate_identifier(identifier: Identifier, envrionment: Environment): RuntimeValue {
    const value = envrionment.lookup_variable(identifier.symbol)
    return value
}

export function evaluate_variable_assignment(expression: AssignmentExpression, environment: Environment): RuntimeValue {
    if (expression.assignee.kind != "Identifier" && expression.assignee.kind != "MemberExpression") {
        throw `Ge kunt die waarde ni wijzige: ${JSON.stringify(expression.assignee)}`
    }

    if (expression.assignee.kind == "Identifier") {
        const varname = (expression.assignee as Identifier).symbol

        return environment.assign_variable(varname, evaluate(expression.value, environment))
    } else {
        const object = evaluate((expression.assignee as MemberExpression).object, environment)
        const property = ((expression.assignee as MemberExpression).property) as Identifier

        if (object.type == "object") {
            let value = null
            switch (expression.value.kind) {
                case "NumericLiteral":
                    value = create_number((expression.value as NumericLiteral).value)
                    break
                case "StringLiteral":
                    value = create_string((expression.value as StringLiteral).value)
                    break
                case "Identifier": 
                    value = evaluate(expression.value, environment)
                    break
                case "MemberExpression": {
                    value = evaluate_member_expression((expression.value as MemberExpression), environment)
                    break
                }
                case "ObjectLiteral":
                    value = evaluate((expression.value as ObjectLiteral), environment)
                    break
                default:
                    value = create_null()
            }

            (object as ObjectValue).properties.set(property.symbol, value)
        }

        return create_null()
    }
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

    if (fn.type == "internal_function" ) {
        return (fn as InternalFunctionValue).call(args, environment)
    } else if (fn.type == "function") {
        const functionvalue = fn as FunctionValue 
        const scope = new Environment(functionvalue.declaration_environment)

        if (args.length != functionvalue.parameters.length) {
            throw `Ni genoeg parameters jong`
        }

        for (let i = 0; i < functionvalue.parameters.length; i++) {
            const varname = functionvalue.parameters[i]
            const value = args[i]

            scope.declare_variable(varname, value, false)
        }

        let result: RuntimeValue = create_null()

        for (const statement of functionvalue.body) {
            result = evaluate(statement, scope)
        }

        return result
    }

    throw `Kan da ni want das geen funkse: ${expression.caller}`
}

export function evaluate_member_expression(expression: MemberExpression, environment: Environment): RuntimeValue {
    const object = evaluate(expression.object, environment) as ObjectValue

    let property

    if (expression.property.kind == "Identifier" && expression.computed == false) {
        property = expression.property as Identifier
    } else if (expression.property.kind == "Identifier" && expression.computed == true) {
        const number = evaluate(expression.property, environment) as NumberValue
        property = { kind: "NumericLiteral", value: number.value } as NumericLiteral
    } else if (expression.property.kind == "NumericLiteral" && expression.computed == true) {
        property = expression.property as NumericLiteral
    } else if (expression.property.kind == "StringLiteral" && expression.computed == true) {
        const string = expression.property as StringLiteral
        property = { kind: "Identifier", symbol: string.value } as Identifier
    }

    if (property != undefined && object.properties != undefined) {
        if (property.kind == "Identifier" && object.properties.has(property.symbol)) {
            return object.properties.get(property.symbol) as NumberValue
        } else if (property.kind == "NumericLiteral" && object.properties.size > property.value) {
            const keys = Array.from(object.properties.keys())
            return object.properties.get(keys[property.value]) as NumberValue
        }

        throw `Dieje key kan ni: ${expression}`
        
    } else {
        throw `Ik kan er ni aan uit ${expression}`
    }
}