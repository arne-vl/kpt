import { NumberValue, RuntimeValue, StringValue } from "./values.ts"
import { BinaryExpression, Identifier, NumericLiteral, StringLiteral, Program, Statement, VariableDeclaration, AssignmentExpression, ObjectLiteral, CallExpression, MemberExpression, FunctionDeclaration, ComparisonExpression, UnaryExpression, AssignmentOperatorExpression, LogicalExpression } from "../frontend/ast.ts"
import Environment from "./environment/environment.ts";
import { evaluate_fuction_declaration, evaluate_if_statement, evaluate_program, evaluate_variable_declaration } from "./eval/statements.ts";
import { evaluate_identifier, evaluate_binary_expression, evaluate_variable_assignment, evaluate_object_expression, evaluate_call_expression, evaluate_member_expression, evaluate_comparison_expression, evaluate_unary_expression, evaluate_assignment_operator_expression, evaluate_logical_expression } from "./eval/expressions.ts"
import { IfStatement } from "../frontend/ast.ts";

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
        
        case "UnaryExpression":
            return evaluate_unary_expression(astNode as UnaryExpression, environment)

        case "AssignmentOperatorExpression":
            return evaluate_assignment_operator_expression(astNode as AssignmentOperatorExpression, environment)

        case "LogicalExpression":
            return evaluate_logical_expression(astNode as LogicalExpression, environment)

        case "ComparisonExpression":
            return evaluate_comparison_expression(astNode as ComparisonExpression, environment)

        case "AssignmentExpression":
            return evaluate_variable_assignment(astNode as AssignmentExpression, environment)

        case "VariableDeclaration":
            return evaluate_variable_declaration(astNode as VariableDeclaration, environment)

        case "FunctionDeclaration":
            return evaluate_fuction_declaration(astNode as FunctionDeclaration, environment)
        
        case "IfStatement":
            return evaluate_if_statement(astNode as IfStatement, environment)

        case "Program":
            return evaluate_program(astNode as Program, environment)

        default:
            console.error("Oei seg da kennek nog ni ze! ", astNode)
            Deno.exit(1)
    }
}