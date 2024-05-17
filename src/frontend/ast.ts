export type NodeType = 
    // STATEMENTS   
    | "Program"
    | "VariableDeclaration"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "NumericLiteral"
    | "Identifier"
    | "BinaryExpression"
    | "UnaryExpression"

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

export interface UnaryExpression extends Expression {
    kind: "UnaryExpression"
    left: Expression
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
