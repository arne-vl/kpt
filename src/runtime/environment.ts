import { RuntimeValue, create_boolean, create_null } from "./values.ts";

export function setup_global_environment(){
    const environment = new Environment()
    // GLOBAL VARIABLES
    environment.declare_variable("just", create_boolean(true), true)
    environment.declare_variable("nijust", create_boolean(), true)
    environment.declare_variable("nikske", create_null(), true)

    return environment
}

export default class Environment {
    private parent?: Environment
    private variables: Map<string, RuntimeValue>
    private constants: Set<string>

    constructor(parent?: Environment) {
        this.parent = parent
        this.variables = new Map()
        this.constants = new Set()
    }

    public declare_variable(name: string, value: RuntimeValue, constant: boolean): RuntimeValue {
        if(this.variables.has(name)){
            throw `Ik kan dees ni make want '${name}' besta al`
        }

        if (constant) {
            this.constants.add(name)
        }
        this.variables.set(name, value)

        return value
    }

    public assign_variable(name: string, value: RuntimeValue): RuntimeValue {
        const environment = this.resolve(name)

        if (environment.constants.has(name)) {
            throw "Iet da altij is kunde ni verandere"
        }

        environment.variables.set(name, value)
        return value
    }

    public lookup_variable(name: string): RuntimeValue {
        const environment = this.resolve(name)

        return environment.variables.get(name) as RuntimeValue
    }

    public resolve(name: string): Environment {
        if (this.variables.has(name))
            return this
        if (this.parent == undefined)
            throw `Da kennek ni, denk da '${name}' ni besta`

        return this.parent.resolve(name)
    }
}