import { NumberValue, RuntimeValue, StringValue } from "./values.ts"
import { BinaryExpression, Identifier, NumericLiteral, StringLiteral, Program, Statement, VariableDeclaration, AssignmentExpression, ObjectLiteral, CallExpression, MemberExpression, FunctionDeclaration } from "../frontend/ast.ts"
import Environment from "./environment/environment.ts";
import { evaluate_fuction_declaration, evaluate_program, evaluate_variable_declaration } from "./eval/statements.ts";
import { evaluate_identifier, evaluate_binary_expression, evaluate_variable_assignment, evaluate_object_expression, evaluate_call_expression, evaluate_member_expression } from "./eval/expressions.ts"

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                type: "number",
                value: ((astNode as NumericLiteral).value)
            } as NumberValue

        case "StringLiteral": 
            return {
                type: "string",
                value: ((astNode as StringLiteral).value)
            } as StringValue

        case "Identifier":
            return evaluate_identifier(astNode as Identifier, environment)

        case "ObjectLiteral":
            return evaluate_object_expression(astNode as ObjectLiteral, environment)

        case "CallExpression":
            return evaluate_call_expression(astNode as CallExpression, environment)

        case "MemberExpression":
            return evaluate_member_expression(astNode as MemberExpression, environment)

        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression, environment)

        case "AssignmentExpression":
            return evaluate_variable_assignment(astNode as AssignmentExpression, environment)

        case "VariableDeclaration":
            return evaluate_variable_declaration(astNode as VariableDeclaration, environment)

        case "FunctionDeclaration":
            return evaluate_fuction_declaration(astNode as FunctionDeclaration, environment)
        
        case "Program":
            return evaluate_program(astNode as Program, environment)

        default:
            console.error("Oei seg da kennek nog ni ze! ", astNode)
            Deno.exit(1)
    }
}