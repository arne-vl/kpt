export type NodeType = 
    // STATEMENTS   
    | "Program"
    | "VariableDeclaration"
    | "FunctionDeclaration"
    | "IfStatement"

    // EXPRESSIONS
    | "AssignmentExpression"
    | "BinaryExpression"
    | "UnaryExpression"
    | "AssignmentOperatorExpression"
    | "ArrayExpression"
    | "LogicalExpression"
    | "ComparisonExpression"
    | "MemberExpression"
    | "ArrayOperationExpression"
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

export interface IfStatement extends Statement {
    kind: "IfStatement"
    statement: Statement
    body: Statement[]
    else?: Statement[]
}

export interface Expression extends Statement {}

export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression"
    assignee: Expression
    value: Expression
}

export interface ArrayExpression extends Expression {
    kind: "ArrayExpression"
    values: Expression[]
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

export interface AssignmentOperatorExpression extends Expression {
    kind: "AssignmentOperatorExpression"
    left: Expression
    right: Expression
    operator: string
}

export interface LogicalExpression extends Expression {
    kind: "LogicalExpression"
    left?: Expression
    right: Expression
    operator: string
}

export interface ComparisonExpression extends Expression {
    kind: "ComparisonExpression"
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

export interface ArrayOperationExpression extends Expression {
    kind: "ArrayOperationExpression"
    array: Expression
    operation: string
    argument?: Expression
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

