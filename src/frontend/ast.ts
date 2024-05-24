export type NodeType = 
    // STATEMENTS   
    | "Program"
    | "VariableDeclaration"
    | "FunctionDeclaration"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "BinaryExpression"
    | "MemberExpression"
    | "CallExpression"

    // Literals
    | "NumericLiteral"
    | "StringLiteral"
    | "Identifier"
    | "ObjectLiteral"
    | "Property"

export interface Statement {
    kind: NodeType
}

export interface Program extends Statement {
    kind: "Program"
    body: Statement[]
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration"
    constant: boolean
    identifier: string
    value?: Expression
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration"
    name: string
    parameters: string[]
    body: Statement[]
}

export interface Expression extends Statement {}

export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression"
    assignee: Expression
    value: Expression
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression"
    left: Expression
    right: Expression
    operator: string
}

export interface MemberExpression extends Expression {
    kind: "MemberExpression"
    object: Expression
    property: Expression
    computed: boolean
}

export interface CallExpression extends Expression {
    kind: "CallExpression"
    args: Expression[]
    caller: Expression
}

export interface Identifier extends Expression {
    kind: "Identifier"
    symbol: string
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral"
    value: number
}

export interface StringLiteral extends Expression {
    kind: "StringLiteral"
    value: string
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral"
    properties: Property[]
}

export interface Property extends Expression {
    kind: "Property"
    key: string
    value?: Expression
}

