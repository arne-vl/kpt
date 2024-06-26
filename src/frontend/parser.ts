import { AssignmentOperatorExpression, CallExpression, ComparisonExpression, IfStatement, MemberExpression, StringLiteral, UnaryExpression, LogicalExpression, ArrayOperationExpression } from "./ast.ts"
import { ArrayExpression } from "./ast.ts"
import { 
    Statement, 
    Program, 
    Expression, 
    BinaryExpression, 
    NumericLiteral, 
    Identifier,
    VariableDeclaration,
    FunctionDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
} from "./ast.ts"
import { tokenize, Token, TokenType } from "./lexer.ts"

export default class Parser {
    private tokens: Token[] = []

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }

    private at() {
        return this.tokens[0] as Token
    }

    private eat() {
        const prev = this.tokens.shift() as Token
        return prev
    }

    private expect(type: TokenType, err: string) {
        const prev = this.tokens.shift() as Token

        if(!prev || prev.type != type) {
            console.error("Parser Fouteke:\n", err, prev, " - Kmoet dees hemme: ", TokenType[type])
            Deno.exit(1)
        }

        return prev
    }

    public produce_ast(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)

        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.not_eof()) {
            program.body.push(this.parse_statement())
        }

        return program
    }

    private parse_variable_declaration(): Statement {
        const constant = this.eat().type == TokenType.Const
        const identifier = this.expect(TokenType.Identifier, "Ik verwacht hier wel ne naam he").value

        if (this.at().type == TokenType.Semicolon) this.eat()

        if (this.at().type != TokenType.Equals) {
            if (constant) {
                throw Error(`As da altij is dan moete daar wel iet aan geve he`)
            }
            return { 
                kind: "VariableDeclaration", 
                constant: false, 
                identifier: identifier, 
                value: undefined 
            } as VariableDeclaration
        }

        this.expect(TokenType.Equals, "Ik verwacht nen =")

        const declaration = { 
            kind: "VariableDeclaration", 
            constant: constant, 
            identifier: identifier, 
            value: this.parse_expression() 
        } as VariableDeclaration

        if (this.at().type == TokenType.Semicolon) this.eat()

        return declaration
    }

    private parse_function_declaration(): Statement {
        this.eat()
        const name = this.expect(TokenType.Identifier, "Een funkse moe ne naam hemme").value

        const args = this.parse_args()
        const parameters: string[] = []
        for (const arg of args) {
            if (arg.kind != "Identifier") {
                throw Error(`Argumente moete identifiers zen`)
            }

            parameters.push((arg as Identifier).symbol)
        }

        this.expect(TokenType.OpenBrace, "Ge moe { gebruike voor funkses")

        const body: Statement[] = []

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            body.push(this.parse_statement())
        }

        this.expect(TokenType.CloseBrace, "Ge moe ok wel } doen")

        if (this.at().type == TokenType.Semicolon) this.eat()

        return {
          kind: "FunctionDeclaration",
          name: name,
          parameters: parameters,
          body: body
        } as FunctionDeclaration

    }

    private parse_if_statement(): Statement {
        this.eat()

        const statement = this.parse_statement()

        this.expect(TokenType.OpenBrace, "Ge moe { gebruike voor as")

        const body: Statement[] = []
        
        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            body.push(this.parse_statement())
        }

        this.expect(TokenType.CloseBrace, "Ge moe ok wel } doen")

        const ifstatement = {
            kind: "IfStatement",
            statement: statement,
            body: body
        } as IfStatement

        if (this.at().type == TokenType.Else) {
            this.eat()
            const body: Statement[] = []

            if (this.at().type == TokenType.If) {
                body.push(this.parse_if_statement())
            } else {
                this.expect(TokenType.OpenBrace, "Ge moe { gebruike voor aans")
            
                while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
                    body.push(this.parse_statement())
                }

                this.expect(TokenType.CloseBrace, "Ge moe ok wel } doen")
            }
            ifstatement.else = body
        }

        if (this.at().type == TokenType.Semicolon) this.eat()

        return ifstatement
    }

    private parse_statement(): Statement {
        switch (this.at().type) {
            case TokenType.Let:
                return this.parse_variable_declaration()

            case TokenType.Const:
                return this.parse_variable_declaration()

            case TokenType.Function:
                return this.parse_function_declaration()

            case TokenType.If:
                return this.parse_if_statement()

            default:
                return this.parse_expression()
        }
    }

    private parse_expression(): Expression {
        return this.parse_assignment_expression()
    }

    private parse_assignment_expression(): Expression {
        const left = this.parse_array_expression()

        if (this.at().type == TokenType.Equals) {
            this.eat()
            const value = this.parse_assignment_expression()
            return { kind: "AssignmentExpression", assignee: left, value: value } as AssignmentExpression
        }
        
        return left
    }

    private parse_array_expression(): Expression {
        if (this.at().type != TokenType.OpenBracket) {
            return this.parse_object_expression()
        }

        const values = this.parse_array_items()
        
        return { kind: "ArrayExpression", values: values } as ArrayExpression
    }

    private parse_array_items(): Expression[] {
        this.expect(TokenType.OpenBracket, "Kmoet ier een [] hebbe")

        const args = this.at().type == TokenType.CloseBracket ? [] : this.parse_args_list()

        this.expect(TokenType.CloseBracket, "Kmoet ier een ] hebbe")

        return args
    }

    private parse_object_expression(): Expression {
        if (this.at().type != TokenType.OpenBrace) {
            return this.parse_comparison_expression()
        }

        this.eat()
        const properties = new Array<Property>()

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "Ge moet da ne naam geven").value
            
            if (this.at().type == TokenType.Comma) {
                this.eat()
                properties.push({ kind: "Property", key: key })
                continue
            } else if (this.at().type == TokenType.CloseBrace) {
                properties.push({ kind: "Property", key: key })
                continue
            }

            this.expect(TokenType.Colon, "Kmoet ier een : hemme")

            const value = this.parse_expression()

            properties.push({ kind: "Property", key: key, value: value })

            if (this.at().type != TokenType.CloseBrace) {
                this.expect(TokenType.Comma, "Kmoet ier een , of } hebbe")
            }
        }

        this.expect(TokenType.CloseBrace, "Doet die acolade is dicht")
        return { kind: "ObjectLiteral", properties: properties } as ObjectLiteral
    }

    private parse_comparison_expression(): Expression {
        let left = this.parse_logical_expression()

        if (
            this.at().value == "<" || 
            this.at().value == ">" || 
            this.at().value == "==" || 
            this.at().value == "!=" ||
            this.at().value == "<=" ||
            this.at().value == ">="
        ) {
            const operator = this.eat().value
            const right = this.parse_additive_expression()

            left = {
                kind: "ComparisonExpression",
                left,
                right,
                operator
            } as ComparisonExpression
        }

        return left
    }

    private parse_logical_expression(): Expression {
        if (this.at().type == TokenType.LogicalOperator){
            const operator = this.eat().value
            const right = this.parse_additive_expression()

            return {
                kind: "LogicalExpression",
                right: right,
                operator:operator
            } as LogicalExpression
        }

        const left = this.parse_additive_expression()

        if (this.at().type == TokenType.LogicalOperator){
            const operator = this.eat().value
            const right = this.parse_additive_expression()
            
            return {
                kind: "LogicalExpression",
                left: left,
                right: right,
                operator: operator
            } as LogicalExpression
        }

        return left
    }

    private parse_additive_expression(): Expression {
        let left = this.parse_multiplicative_expression()

        if (this.at().type == TokenType.UnaryOperator) {
            const operator = this.eat().value

            if (left.kind == "Identifier") {
                left = {
                    kind: "UnaryExpression",
                    left: left,
                    operator: operator
                } as UnaryExpression
            } else {
                throw Error(`++ en -- ga alleen op identifiers e`)
            }
        }

        if (this.at().type == TokenType.AssignmentOperator) {
            const operator = this.eat().value

            if (left.kind == "Identifier") {
                const right = this.parse_expression() 
                left = {
                    kind: "AssignmentOperatorExpression",
                    left: left,
                    right: right,
                    operator: operator
                } as AssignmentOperatorExpression
            } else {
                throw Error(`Ge kunt alleen iet toewijze aan nen identifier`)
            }
        }

        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value
            const right = this.parse_multiplicative_expression()

            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parse_multiplicative_expression(): Expression {
        let left = this.parse_call_member_expression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%" || this.at().value == "**" || this.at().value == "//"){
            const operator = this.eat().value

            const right = this.parse_call_member_expression()

            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parse_call_member_expression(): Expression {
        const member = this.parse_member_expression()

        if (this.at().type == TokenType.OpenParen) {
            return this.parse_call_expression(member)
        }

        return member
    }

    private parse_call_expression(caller: Expression): Expression {
        let call_expression: Expression = {
            kind: "CallExpression",
            caller,
            args: this.parse_args()
        } as CallExpression

        if (this.at().type == TokenType.OpenParen) {
            call_expression = this.parse_call_expression(call_expression)
        }

        if (this.at().type == TokenType.Semicolon) this.eat()

        return call_expression
    }

    private parse_args(): Expression[] {
        this.expect(TokenType.OpenParen, "Kmoet ier een ( hebbe")

        const args = this.at().type == TokenType.CloseParen ? [] : this.parse_args_list()

        this.expect(TokenType.CloseParen, "Kmoet ier een ) hebbe")

        return args
    }

    private parse_args_list(): Expression[] {
        const args = [this.parse_assignment_expression()]

        while (this.not_eof() && this.at().type == TokenType. Comma && this.eat()) {
            args.push(this.parse_assignment_expression())
        }

        return args
    }

    private parse_member_expression(): Expression {
        let object = this.parse_primary_expression()

        while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
            const operator = this.eat() 
            let property: Expression
            let computed: boolean

            if (operator.type == TokenType.Dot) {
                property = this.parse_primary_expression()
                computed = false

                if (property.kind != "Identifier") {
                    throw Error(`Ge kunt hier gen punt doen`)
                }

                const identifier = property as Identifier
                if ((identifier.symbol == "derbij" || identifier.symbol == "deraf" || identifier.symbol == "draaitoem" || identifier.symbol == "teerste") && object.kind == "Identifier") {
                    if (identifier.symbol == "derbij") {
                        this.eat()
                        if (this.at().type == TokenType.CloseParen) {
                            throw Error(`Ge moet er wel iet bij doen dan he`)
                        }
                        const argument = this.parse_expression()
                        object = {
                            kind: "ArrayOperationExpression",
                            array: object,
                            operation: identifier.symbol,
                            argument: argument
                        } as ArrayOperationExpression
                        this.eat()
                    } else if (identifier.symbol == "deraf" || identifier.symbol == "draaitoem" || identifier.symbol == "teerste") {
                        if (this.at().type == TokenType.OpenParen) {
                            this.eat()
                            if (this.at().type != TokenType.CloseParen) {
                                throw Error(`'${identifier.symbol}' kan gen argumente hebbe`)
                            }
                            this.eat()
                        } else if (this.at().type != TokenType.Dot && this.at().type != TokenType.OpenBracket && this.at().type != TokenType.Semicolon && this.at().type != TokenType.EOF) {
                            throw Error(`'${identifier.symbol}' kan gen argumente hebbe`)
                        }
                        object = {
                            kind: "ArrayOperationExpression",
                            array: object,
                            operation: identifier.symbol
                        } as ArrayOperationExpression
                    }
                    continue
                }
            } else {
                property = this.parse_expression()
                computed = true
                this.expect(TokenType.CloseBracket, "Da vierkant haakske moe dicht")
            }

            object = {
                kind: "MemberExpression",
                object,
                property,
                computed
            } as MemberExpression
        }

        return object
    }

    private parse_primary_expression(): Expression {
        const tokentype = this.at().type

        switch (tokentype) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier
                
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral
            
            case TokenType.OpenParen: {
                this.eat()
                const value = this.parse_expression()
                this.expect(TokenType.CloseParen, "Da haakske moe dicht")
                return value
            }

            case TokenType.String: {
                const value = this.eat().value

                return { kind: "StringLiteral", value: value } as StringLiteral
            }

            default:
                console.error("Oei khem iet gevonde dak ni had verwacht tijdes et parsen!", this.at())
                Deno.exit(1)
        }
    }
}