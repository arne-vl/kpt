import { Program, VariableDeclaration, FunctionDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment/environment.ts";
import { evaluate } from "../interpreter.ts";
import { FunctionValue, RuntimeValue, create_null } from "../values.ts";


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

export function evaluate_fuction_declaration(declaration: FunctionDeclaration, environment: Environment): RuntimeValue {
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declaration_environment: environment,
        body: declaration.body,
    } as FunctionValue

    return environment.declare_variable(declaration.name, fn, true)
}