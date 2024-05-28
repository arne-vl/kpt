export enum TokenType {
    Number,
    Identifier,

    BinaryOperator, // + - * / % ** //
    UnaryOperator, // ++ --
    ComparisonOperator, // < > == != <= >=
    AssignmentOperator, // += -= *= /= %= **= //=
    LogicalOperator, // TODO: ! && ||
    EllipsisOperator, //TODO: ..

    Equals, // =
    Semicolon, // ;

    Quote, // '
    DoubleQuote, // "

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
    For, // TODO
    Function,

    EOF // End Of File
}

const KEYWORDS: Record<string, TokenType> = {
    efkes: TokenType.Let,
    altij: TokenType.Const,
    isda: TokenType.If,
    veur: TokenType.For,
    funkse: TokenType.Function,
}

export interface Token {
    value: string
    type: TokenType
}

function token(value: string = "", type: TokenType): Token {
    return { value, type }
}

function is_alpha(src: string) {
    return src.toUpperCase() != src.toLowerCase()
}

function is_int(src: string) {
    const c = src.charCodeAt(0)
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)]

    return (c >= bounds[0] && c <= bounds[1])
}

function is_new_line(src: string) {
    return src == "\n"
}

function is_skippable(src: string) {
    return (src == " " || src == "\n" || src == "\t" || src == "\r")
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>()

    const src = sourceCode.split("")

    while (src.length > 0) {
        if (src[0] == "("){
            tokens.push(token(src.shift(), TokenType.OpenParen))
        } else if (src[0] == ")"){
            tokens.push(token(src.shift(), TokenType.CloseParen))
        } else if (src[0] == "["){
            tokens.push(token(src.shift(), TokenType.OpenBracket))
        } else if (src[0] == "]"){
            tokens.push(token(src.shift(), TokenType.CloseBracket))
        } else if (src[0] == "{"){
            tokens.push(token(src.shift(), TokenType.OpenBrace))
        } else if (src[0] == "}"){
            tokens.push(token(src.shift(), TokenType.CloseBrace))
        } else if (src[0] == ";"){
            tokens.push(token(src.shift(), TokenType.Semicolon))
        } else if (src[0] == ":"){
            tokens.push(token(src.shift(), TokenType.Colon))
        } else if (src[0] == ","){
            tokens.push(token(src.shift(), TokenType.Comma))
        } else if (src[0] == "."){
            tokens.push(token(src.shift(), TokenType.Dot))
        } else if (src[0] == "\'"){
            tokens.push(token(src.shift(), TokenType.Quote))
        } else if (src[0] == "\""){
            tokens.push(token(src.shift(), TokenType.DoubleQuote))
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%"){
            if (src.length > 1 && (src[0] == '+' || src[0] == '-') && src[1] == src[0]) {
                const value = src.shift() == '+' ? "++" : "--"
                tokens.push(token(value, TokenType.UnaryOperator))
                src.shift()
            } else if (src.length > 2 && (src[0] == '*' || src[0] == '/') && src[1] == src[0] && src [2] == "=") {
                const value = src.shift() == '*' ? "**=" : "//="
                tokens.push(token(value, TokenType.AssignmentOperator))
                src.shift()
                src.shift()
            } else if (src.length > 1 && (src[0] == '*' || src[0] == '/') && src[1] == src[0]) {
                const value = src.shift() == '*' ? "**" : "//"
                tokens.push(token(value, TokenType.BinaryOperator))
                src.shift()
            } else if (src.length > 1 && src[1] == "=") {
                const value = src.shift() + "="
                tokens.push(token(value, TokenType.AssignmentOperator))
                src.shift()
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator))
            }
        } else if (src[0] == "=") {
            if (src.length > 1 && src[1] == src[0]){
                const value = "=="
                tokens.push(token(value, TokenType.ComparisonOperator))
                src.shift()
                src.shift()
            } else {
                const value = src.shift()
                tokens.push(token(value, TokenType.Equals))
            }
        } else if (src[0] == "!") {
            if (src.length > 1 && src[1] == "="){
                const value = "!="
                tokens.push(token(value, TokenType.ComparisonOperator))
                src.shift()
                src.shift()
            }
        } else if (src[0] == "<") {
            if (src.length > 1 && src[1] == "="){
                const value = "<="
                tokens.push(token(value, TokenType.ComparisonOperator))
                src.shift()
                src.shift()
            } else {
                const value = src.shift()
                tokens.push(token(value, TokenType.ComparisonOperator))
            }
        } else if (src[0] == ">") {
            if (src.length > 1 && src[1] == "="){
                const value = ">="
                tokens.push(token(value, TokenType.ComparisonOperator))
                src.shift()
                src.shift()
            } else {
                const value = src.shift()
                tokens.push(token(value, TokenType.ComparisonOperator))
            }
        } else {
            // Handle multi-character tokens
            
            if(is_int(src[0])) {
                let num = ""
                while (src.length > 0 && is_int(src[0])) {
                    num += src.shift()
                }

                tokens.push(token(num, TokenType.Number))
            } else if (is_alpha(src[0])) {
                let identifier = ""
                while (src.length > 0 && is_alpha(src[0])) {
                    identifier += src.shift()
                }

                // Check Keywords
                const reserved = KEYWORDS[identifier];
                if (typeof reserved == "number"){
                    tokens.push(token(identifier, reserved))
                } else {
                    tokens.push(token(identifier, TokenType.Identifier))
                }
            } else if (is_skippable(src[0])) {
                src.shift() // Skip current character
            } else if (src[0] == "#") {
                src.shift()
                while (src.length > 0 && !is_new_line(src[0])) {
                    src.shift()
                }
            } else {
                console.log("Kem iet gevonde dak ni ken: \'", src[0], "\'")
                Deno.exit(1)
            }
        }
    }
    tokens.push({type: TokenType.EOF, value: "EndOfFile"})
    return tokens
}