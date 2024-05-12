import { NumberValue, RuntimeValue, create_null } from "./values.ts"
import { BinaryExpression, Identifier, NumericLiteral, Program, Statement } from "../frontend/ast.ts"
import Environment from "./environment.ts";

function evaluate_program(program: Program, environment: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = create_null()

    for(const statement of program.body){
        lastEvaluated = evaluate(statement, environment)
    }

    return lastEvaluated
}

function evaluate_numeric_binary_expression(left: NumberValue, right: NumberValue, operator: string): NumberValue {
    let result = 0

    if (operator == "+") {
        result = left.value + right.value
    } else if (operator == "-") {
        result = left.value - right.value
    } else if (operator == "*") {
        result = left.value * right.value
    } else if (operator == "/") {
        
        if (right.value == 0) {
            console.error("Ej ge kunt toch ni dele door 0 zeker")
            Deno.exit(1)
        }

        result = left.value / right.value
    } else {
        result = left.value % right.value
    }

    return { type: "number", value: result }
}

function evaluate_binary_expression(expression: BinaryExpression, environment: Environment): RuntimeValue {
    const left = evaluate(expression.left, environment)
    const right = evaluate(expression.right, environment)

    if(left.type == "number" && right.type == "number") {
        return evaluate_numeric_binary_expression(left as NumberValue, right as NumberValue, expression.operator)
    }

    return create_null()
}

function evaluate_identifier(identifier: Identifier, envrionment: Environment): RuntimeValue {
    const value = envrionment.lookup_variable(identifier.symbol)
    return value
}

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: ((astNode as NumericLiteral).value)
            } as NumberValue

        case "Identifier":
            return evaluate_identifier(astNode as Identifier, environment)

        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression, environment)
        
        case "Program":
            return evaluate_program(astNode as Program, environment)

        default:
            console.error("Oei seg da kennek nog ni ze! ", astNode)
            Deno.exit(1)
    }
}