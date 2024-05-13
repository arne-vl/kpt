import { Program, VariableDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeValue, create_null } from "../values.ts";


export function evaluate_program(program: Program, environment: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = create_null()

    for(const statement of program.body){
        lastEvaluated = evaluate(statement, environment)
    }

    return lastEvaluated
}

export function evaluate_variable_declaration(declaration: VariableDeclaration, environment: Environment): RuntimeValue {
    const value = declaration.value ? evaluate(declaration.value, environment) : create_null()
    return environment.declare_variable(declaration.identifier, value, declaration.constant)
}