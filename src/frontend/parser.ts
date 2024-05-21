// deno-lint-ignore-file no-explicit-any
import { 
    Statement, 
    Program, 
    Expression, 
    BinaryExpression, 
    NumericLiteral, 
    Identifier,
    VariableDeclaration,
    AssignmentExpression,
    Property,
    ObjectLiteral,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

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

    private expect(type: TokenType, err: any) {
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

        if (this.at().type == TokenType.Semicolon) this.eat() // let x;

        if (this.at().type != TokenType.Equals) {
            if (constant) {
                throw "As da altij is dan moete daar wel iet aan geve he"
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

        if (this.at().type == TokenType.Semicolon) this.eat() // let x = 5;

        return declaration
    }

    private parse_statement(): Statement {
        switch (this.at().type) {
            case TokenType.Let:
                return this.parse_variable_declaration()

            case TokenType.Const:
                return this.parse_variable_declaration()

            default:
                return this.parse_expression()
        }
    }

    private parse_expression(): Expression {
        return this.parse_assignment_expression()
    }

    private parse_assignment_expression(): Expression {
        const left = this.parse_object_expression()

        if (this.at().type == TokenType.Equals) {
            this.eat()
            const value = this.parse_assignment_expression()
            return { kind: "AssignmentExpression", assignee: left, value: value } as AssignmentExpression
        }
        
        return left
    }

    private parse_object_expression(): Expression {
        if (this.at().type != TokenType.OpenBrace) {
            return this.parse_additive_expression()
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

    private parse_additive_expression(): Expression {
        let left = this.parse_multiplicative_expression()

        while (this.at().value == "+" || this.at().value == "-" ) {
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
        let left = this.parse_primary_expression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%" || this.at().value == "**" || this.at().value == "//"){
            const operator = this.eat().value

            const right = this.parse_primary_expression()

            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
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

            default:
                console.error("Oei khem iet gevonde dak ni had verwacht tijdes et parsen! ", this.at())
                Deno.exit(1)
        }
    }
}