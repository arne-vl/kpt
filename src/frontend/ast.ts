export type NodeType = 
    // STATEMENTS   
    | "Program"
    | "VariableDeclaration"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "BinaryExpression"

    // Literals
    | "NumericLiteral"
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

export interface Identifier extends Expression {
    kind: "Identifier"
    symbol: string
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral"
    value: number
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

