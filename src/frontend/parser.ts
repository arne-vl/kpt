// deno-lint-ignore-file no-explicit-any
import { 
    Statement, 
    Program, 
    Expression, 
    BinaryExpression, 
    NumericLiteral, 
    Identifier
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = []

    private notEOF(): boolean {
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
            console.error("Parser Fouteke:\n", err, prev, " - Kmoet dees hemme: ", type)
            Deno.exit(1)
        }

        return prev
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)

        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.notEOF()) {
            program.body.push(this.parseStatement())
        }

        return program
    }

    private parseStatement(): Statement {
        // skip to parseExpression
        return this.parseExpression()
    }

    private parseExpression(): Expression {
        return this.parseAdditiveExpression()
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression()

        while (this.at().value == "+" || this.at().value == "-" ) {
            const operator = this.eat().value
            const right = this.parseMultiplicativeExpression()

            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.eat().value
            const right = this.parsePrimaryExpression()

            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression
        }

        return left
    }

    private parsePrimaryExpression(): Expression {
        const tokentype = this.at().type

        switch (tokentype) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier
                
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral
            
            case TokenType.OpenParen: {
                this.eat()
                const value = this.parseExpression()
                this.expect(TokenType.CloseParen, "Da haakske moe dicht")
                return value
            }

            default:
                console.error("Oei khem iet gevonde dak ni had verwacht tijdes et parsen! ", this.at())
                Deno.exit(1)
        }
    }
}