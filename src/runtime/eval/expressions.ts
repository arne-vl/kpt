import { AssignmentExpression, AssignmentOperatorExpression, BinaryExpression, CallExpression, ComparisonExpression, Identifier, MemberExpression, ObjectLiteral, UnaryExpression, LogicalExpression, NumericLiteral, StringLiteral, ArrayExpression, ArrayOperationExpression } from "../../frontend/ast.ts"
import Environment from "../environment/environment.ts"
import { evaluate } from "../interpreter.ts"
import { ArrayValue, BooleanValue, DateObject, FunctionValue, InternalFunctionValue, NumberValue, ObjectValue, RuntimeValue, StringValue, create_boolean, create_null, create_number, create_string } from "../values.ts"

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
        throw Error(`Logische poorte ga alleen me just en nijust`)
    }
    if (expression.left) {
        const left = evaluate(expression.left, environment)
        if (left.type != "boolean") {
            throw Error(`Logische poorte ga alleen me just en nijust`)
        }
        if (expression.operator == "en") {
            return (left as BooleanValue).value && (right as BooleanValue).value ? create_boolean(true) : create_boolean(false)
        } else if (expression.operator == "of") {
            return (left as BooleanValue).value || (right as BooleanValue).value ? create_boolean(true) : create_boolean(false)
        }
    } else if (expression.operator == "ni") {
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

    throw Error(`Vergelijke kan alleen me nummers`)
}

export function evaluate_identifier(identifier: Identifier, envrionment: Environment): RuntimeValue {
    const value = envrionment.lookup_variable(identifier.symbol)
    return value
}

export function evaluate_variable_assignment(expression: AssignmentExpression, environment: Environment): RuntimeValue {
    if (expression.assignee.kind != "Identifier" && expression.assignee.kind != "MemberExpression") {
        throw Error(`Ge kunt die waarde ni wijzige: ${JSON.stringify(expression.assignee)}`)
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
            throw Error(`Ni genoeg parameters jong`)
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

    throw Error(`Kan da ni want das geen funkse: ${expression.caller}`)
}

export function evaluate_member_expression(expression: MemberExpression, environment: Environment): RuntimeValue {
    const object = evaluate(expression.object, environment)

    let property: Identifier | NumericLiteral | StringLiteral

    if (expression.property.kind === "Identifier" && !expression.computed) {
        property = expression.property as Identifier
    } else if (expression.property.kind === "Identifier" && expression.computed) {
        const identifier = evaluate(expression.property, environment)
        if (identifier.type === "number") {
            property = { kind: "NumericLiteral", value: (identifier as NumberValue).value } as NumericLiteral
        } else if (identifier.type === "string") {
            property = { kind: "StringLiteral", value: (identifier as StringValue).value } as StringLiteral
        } else {
            throw Error(`Ni het juste type: ${identifier.type}`)
        }
    } else if (expression.property.kind === "NumericLiteral") {
        property = expression.property as NumericLiteral
    } else if (expression.property.kind === "StringLiteral") {
        const string = expression.property as StringLiteral
        property = { kind: "Identifier", symbol: string.value } as Identifier
    } else {
        throw Error(`Da wordt ni ondersteund: ${expression.property.kind}`)
    }

    if (object.type === "object") {
        const obj = object as ObjectValue
        if (property.kind === "Identifier" && obj.properties.has(property.symbol)) {
            return obj.properties.get(property.symbol) as RuntimeValue
        } else if (property.kind === "NumericLiteral") {
            const keys = Array.from(obj.properties.keys())
            if (property.value < keys.length) {
                return obj.properties.get(keys[property.value]) as RuntimeValue
            }
        } else if (property.kind === "StringLiteral" && obj.properties.has(property.value)) {
            return obj.properties.get(property.value) as RuntimeValue
        }

        throw Error(`Da besta ni: ${property.kind === "Identifier" ? property.symbol : property.value}`)
    } else if (object.type === "array") {
        const array = object as ArrayValue
        if (property.kind === "NumericLiteral" && property.value < array.values.length && expression.computed == true) {
            return array.values[property.value] as RuntimeValue
        } else if (property.kind === "Identifier" && expression.computed == true) {
            const index = evaluate_identifier(property as Identifier, environment)
            if (index.type === "number" && (index as NumberValue).value < array.values.length) {
                return array.values[(index as NumberValue).value] as RuntimeValue
            }
        } else if (property.kind === "StringLiteral" && expression.computed == true) {
            const index = evaluate_identifier({ kind: "Identifier", symbol: property.value } as Identifier, environment)
            if (index.type === "number" && (index as NumberValue).value < array.values.length) {
                return array.values[(index as NumberValue).value] as RuntimeValue
            }
        }

        throw Error(`Diejen index kan ni: ${property.kind === "Identifier" ? property.symbol : property.value}`)
    } else if (object.type === "dateobject") {
        const dateObject = object as DateObject
        if (property.kind === "Identifier" && dateObject.properties.has(property.symbol)) {
            return dateObject.properties.get(property.symbol) as RuntimeValue
        } else if (property.kind === "StringLiteral" && dateObject.properties.has(property.value)) {
            return dateObject.properties.get(property.value) as RuntimeValue
        }

        throw Error(`Gen geldige datum eigenschap: ${property.kind === "Identifier" ? property.symbol : property.value}`)
    } else {
        throw Error(`Ge kunt zo alleen dinge van arrays en objecte ophale, ni van ${object.type}`)
    }
}

export function evaluate_array_expression(expression: ArrayExpression, environment: Environment): RuntimeValue {
    const values: RuntimeValue[] = []

    expression.values.forEach((value) => {
        values.push(evaluate(value, environment))
    })
    return { type: "array", values: values } as ArrayValue
}

export function evaluate_array_add_expression(expression: ArrayOperationExpression, environment: Environment): RuntimeValue {
    const array = evaluate(expression.array, environment)
    const values = (array as ArrayValue).values
    
    if (expression.operation == "derbij") {
        if (!expression.argument) {
            throw Error(`Ge moet er wel iet bij doen dan he`)
        }

        switch (expression.argument.kind) {
            case "NumericLiteral":
                values.push({ type: "number", value: (expression.argument as NumericLiteral).value } as NumberValue)
                break
            case "StringLiteral":
                values.push({ type: "string", value: (expression.argument as StringLiteral).value } as StringValue)
                break
            default:
                throw Error(`Da kunde er nog ni bij doen: ${expression.argument.kind}`)
        }
        
    } else if (expression.operation == "deraf") {
        values.pop()
    } else {
        return create_null()
    }

    return { type: "array", values: values } as ArrayValue
}