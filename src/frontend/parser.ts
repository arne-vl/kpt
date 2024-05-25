// deno-lint-ignore-file no-explicit-any
import { CallExpression, ComparisonExpression, IfStatement, MemberExpression, StringLiteral } from "./ast.ts";
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
                console.log(arg)
                throw `dees is ni just`
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

        this.expect(TokenType.OpenBrace, "Ge moe { gebruike voor isda")

        const body: Statement[] = []
        
        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            body.push(this.parse_statement())
        }

        this.expect(TokenType.CloseBrace, "Ge moe ok wel } doen")

        if (this.at().type == TokenType.Semicolon) this.eat()

        return {
            kind: "IfStatement",
            statement: statement,
            body: body
        } as IfStatement
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
        let left = this.parse_additive_expression()

        if (this.at().value == "<" || this.at().value == ">") {
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

    private parse_additive_expression(): Expression {
        let left = this.parse_multiplicative_expression()

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
                    throw `Ge kunt hier gen punt doen`
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

            case TokenType.DoubleQuote: {
                this.eat()

                let value = ""

                while (this.at().type != TokenType.DoubleQuote && this.not_eof()) {
                    if (value == "") {
                        value = this.eat().value
                    } else {
                        value = value + " " + this.eat().value
                    }
                }

                this.expect(TokenType.DoubleQuote, "Ne zin moete afsluite")

                return { kind: "StringLiteral", value: value } as StringLiteral
            }

            case TokenType.Quote: {
                this.eat()

                let value = ""

                while (this.at().type != TokenType.Quote && this.not_eof()) {
                    if (value == "") {
                        value = this.eat().value
                    } else {
                        value = value + " " + this.eat().value
                    }
                }

                this.expect(TokenType.Quote, "Ne zin moete afsluite")

                return { kind: "StringLiteral", value: value } as StringLiteral
            }

            default:
                console.error("Oei khem iet gevonde dak ni had verwacht tijdes et parsen!", this.at())
                Deno.exit(1)
        }
    }
}