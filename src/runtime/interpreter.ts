import { NullValue, NumberValue, RuntimeValue } from "./values.ts"
import { BinaryExpression, NumericLiteral, Program, Statement } from "../frontend/ast.ts"

function evaluate_program(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue

    for(const statement of program.body){
        lastEvaluated = evaluate(statement)
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

function evaluate_binary_expression(expression: BinaryExpression): RuntimeValue {
    const left = evaluate(expression.left)
    const right = evaluate(expression.right)

    if(left.type == "number" && right.type == "number") {
        return evaluate_numeric_binary_expression(left as NumberValue, right as NumberValue, expression.operator)
    }

    return { type: "null", value: "null" } as NullValue
}

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: ((astNode as NumericLiteral).value)
            } as NumberValue
        
        case "NullLiteral":
            return {
                type: "null",
                value: "null"
            } as NullValue

        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression)
        
        case "Program":
            return evaluate_program(astNode as Program)

        default:
            console.error("Oei seg da kennek nog ni ze! ", astNode)
            Deno.exit(1)
    }
}