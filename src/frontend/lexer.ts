export enum TokenType {
    Number,
    Identifier,
    String,
    Array,

    BinaryOperator, // + - * / % ** //
    UnaryOperator, // ++ --
    ComparisonOperator, // < > == != <= >=
    AssignmentOperator, // += -= *= /= %= **= //=
    LogicalOperator, // ! && ||
    EllipsisOperator, // TODO: ..

    Equals, // =
    Semicolon, // ;

    OpenParen, // (
    CloseParen, // )

    OpenBracket, // [
    CloseBracket, // ]

    OpenBrace, // {
    CloseBrace, // }

    Colon, // :
    Comma, // ,
    Dot, // .

    Let, 
    Const,
    If,
    Else,
    For, // TODO
    Function,

    EOF // End Of File
}

const KEYWORDS: Record<string, TokenType> = {
    "efkes": TokenType.Let,
    "altij": TokenType.Const,
    "as": TokenType.If,
    "aans": TokenType.Else,
    "veur": TokenType.For,
    "funkse": TokenType.Function,

    "en": TokenType.LogicalOperator,
    "of": TokenType.LogicalOperator,
    "ni": TokenType.LogicalOperator
}

export interface Token {
    value: string
    type: TokenType
}

function token(value: string = "", type: TokenType): Token {
    return { value, type }
}

function is_alpha(src: string) {
    return /^[a-zA-Z]$/.test(src)
}

function is_dash(src: string) {
    return src == "-" || src == "_"
}

function is_int(src: string) {
    return /^[0-9]$/.test(src)
}

function is_new_line(src: string) {
    return src == "\n"
}

function is_skippable(src: string) {
    return src == " " || src == "\n" || src == "\t" || src == "\r"
}

export function tokenize(sourceCode: string): Token[] {
    const tokens: Token[] = []
    const src = sourceCode.split("")
    
    while (src.length > 0) {
        const char = src.shift()!
        
        switch (char) {
            case "(":
                tokens.push(token(char, TokenType.OpenParen))
                break
            case ")":
                tokens.push(token(char, TokenType.CloseParen))
                break
            case "[":
                tokens.push(token(char, TokenType.OpenBracket))
                break
            case "]":
                tokens.push(token(char, TokenType.CloseBracket))
                break
            case "{":
                tokens.push(token(char, TokenType.OpenBrace))
                break
            case "}":
                tokens.push(token(char, TokenType.CloseBrace))
                break
            case "":
                tokens.push(token(char, TokenType.Semicolon))
                break
            case ":":
                tokens.push(token(char, TokenType.Colon))
                break
            case ";":
                tokens.push(token(char, TokenType.Semicolon))
                break
            case ",":
                tokens.push(token(char, TokenType.Comma))
                break
            case ".":
                if (src.length > 0 && is_int(src[0])) {
                    let num = char
                    while (src.length > 0 && (is_int(src[0]) || src[0] == ".")) {
                        if (src[0] == "." && num.includes(".")) {
                            throw Error(`Ge kunt gen 2 punte in ne nummer steke`)
                        }
                        num += src.shift()
                    }
                    tokens.push(token(num, TokenType.Number))
                } else {
                    tokens.push(token(char, TokenType.Dot))
                }
                break
            case "\'":
            case "\"": {
                const quoteType = char
                let str = ""
                while (src.length > 0 && src[0] != quoteType) {
                    str += src.shift()
                }
                if (src.length > 0) src.shift()
                tokens.push(token(str, TokenType.String))
                break
            }
            case "+":
            case "-":
            case "*":
            case "/":
            case "%":
                if (src[0] == char && (char == "+" || char == "-")) {
                    tokens.push(token(char + char, TokenType.UnaryOperator))
                    src.shift()
                } else if (src[0] == char && (char == "*" || char == "/") && src[1] == "=") {
                    tokens.push(token(char + char + "=", TokenType.AssignmentOperator))
                    src.shift() 
                    src.shift()
                } else if (src[0] == char && (char == "*" || char == "/")) {
                    tokens.push(token(char + char, TokenType.BinaryOperator))
                    src.shift()
                } else if (src[0] == "=") {
                    tokens.push(token(char + "=", TokenType.AssignmentOperator))
                    src.shift()
                } else {
                    tokens.push(token(char, TokenType.BinaryOperator))
                }
                break
            case "=":
                if (src[0] == "=") {
                    tokens.push(token("==", TokenType.ComparisonOperator))
                    src.shift()
                } else {
                    tokens.push(token(char, TokenType.Equals))
                }
                break
            case "!":
                if (src[0] == "=") {
                    tokens.push(token("!=", TokenType.ComparisonOperator))
                    src.shift()
                }
                break
            case "<":
                if (src[0] == "=") {
                    tokens.push(token("<=", TokenType.ComparisonOperator))
                    src.shift()
                } else {
                    tokens.push(token(char, TokenType.ComparisonOperator))
                }
                break
            case ">":
                if (src[0] == "=") {
                    tokens.push(token(">=", TokenType.ComparisonOperator))
                    src.shift()
                } else {
                    tokens.push(token(char, TokenType.ComparisonOperator))
                }
                break
            case "#":
                while (src.length > 0 && !is_new_line(src[0])) {
                    src.shift()
                }
                break
            default:
                if (is_skippable(char)) {
                    // Skip whitespace
                } else if (is_int(char)) {
                    let num = char
                    while (src.length > 0 && (is_int(src[0]) || src[0] == ".")) {
                        if (src[0] == "." && num.includes(".")) {
                            throw Error(`Ge kunt gen 2 punte in ne nummer steke`)
                        }
                        num += src.shift()
                    }
                    tokens.push(token(num, TokenType.Number))
                } else if (is_alpha(char)) {
                    let identifier = char
                    while (src.length > 0 && (is_alpha(src[0]) || is_dash(src[0]) || is_int(src[0]))) {
                        identifier += src.shift()
                    }
                    const reserved = KEYWORDS[identifier]
                    if (typeof reserved == "number") {
                        tokens.push(token(identifier, reserved))
                    } else {
                        tokens.push(token(identifier, TokenType.Identifier))
                    }
                } else {
                    console.log(`Kem iet gevonde dak ni ken: '${char}'`)
                    Deno.exit(1)
                }
                break
        }
    }
    
    tokens.push({ type: TokenType.EOF, value: "EndOfFile" })
    return tokens
}