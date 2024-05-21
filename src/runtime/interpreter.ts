import { NumberValue, RuntimeValue } from "./values.ts"
import { BinaryExpression, Identifier, NumericLiteral, Program, Statement, VariableDeclaration, AssignmentExpression, ObjectLiteral } from "../frontend/ast.ts"
import Environment from "./environment.ts";
import { evaluate_program, evaluate_variable_declaration } from "./eval/statements.ts";
import { evaluate_identifier, evaluate_binary_expression, evaluate_variable_assignment, evaluate_object_expression } from "./eval/expressions.ts"

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: ((astNode as NumericLiteral).value)
            } as NumberValue

        case "Identifier":
            return evaluate_identifier(astNode as Identifier, environment)

        case "ObjectLiteral":
            return evaluate_object_expression(astNode as ObjectLiteral, environment)

        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression, environment)

        case "AssignmentExpression":
            return evaluate_variable_assignment(astNode as AssignmentExpression, environment)

        case "VariableDeclaration":
            return evaluate_variable_declaration(astNode as VariableDeclaration, environment)
        
        case "Program":
            return evaluate_program(astNode as Program, environment)

        default:
            console.error("Oei seg da kennek nog ni ze! ", astNode)
            Deno.exit(1)
    }
}