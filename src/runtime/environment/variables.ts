import { create_boolean, create_null, create_number } from "../values.ts";
import Environment from "./environment.ts";

export function setup_global_variables(environment: Environment): Environment {
    environment.declare_variable("just", create_boolean(true), true)
    environment.declare_variable("nijust", create_boolean(), true)
    environment.declare_variable("nikske", create_null(), true)
    environment.declare_variable("pi", create_number(Math.PI), true)

    return environment
}