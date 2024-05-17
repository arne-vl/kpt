export enum TokenType {
    Number,
    Identifier,

    BinaryOperator, // + - * / % ** //
    UnaryOperator, // TODO: ++ --
    AssignmentOperator, //TODO: += -= *= /= %= **=

    Equals, // =
    Semicolon, // ;

    OpenParen, // (
    CloseParen, // )

    OpenBracket, // [
    CloseBracket, // ]

    OpenBrace, // {
    CloseBrace, // }

    Let, 
    Const,

    EOF // End Of File
}

const KEYWORDS: Record<string, TokenType> = {
    "efkes": TokenType.Let,
    "altij": TokenType.Const,

}

export interface Token {
    value: string
    type: TokenType
}

function token(value: string = "", type: TokenType): Token {
    return { value, type }
}

function isAlpha(src: string) {
    return src.toUpperCase() != src.toLowerCase()
}

function isInt(src: string) {
    const c = src.charCodeAt(0)
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)]

    return (c >= bounds[0] && c <= bounds[1])
}

function isSkippable(src: string) {
    return (src == " " || src == "\n" || src == "\t")
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
            tokens.push(token(src.shift(), TokenType.OpenBrace))
        } else if (src[0] == "="){
            tokens.push(token(src.shift(), TokenType.Equals))
        } else if (src[0] == ";"){
            tokens.push(token(src.shift(), TokenType.Semicolon))
        } else if ((src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") && src.length > 1){
            if ((src[0] == '*' || src[0] == '/') && src[1] == src[0]) {
                const value = src.shift() == '*' ? "**" : "//";
                tokens.push(token(value, TokenType.BinaryOperator));
                src.shift();
            } else {
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
            }
        } else {
            // Handle multi-character tokens
            
            if(isInt(src[0])) {
                let num = ""
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift()
                }

                tokens.push(token(num, TokenType.Number))
            } else if (isAlpha(src[0])) {
                let identifier = ""
                while (src.length > 0 && isAlpha(src[0])) {
                    identifier += src.shift()
                }

                // Check Keywords
                const reserved = KEYWORDS[identifier];
                if (typeof reserved == "number"){
                    tokens.push(token(identifier, reserved))
                } else {
                    tokens.push(token(identifier, TokenType.Identifier))
                }
            } else if (isSkippable(src[0])) {
                src.shift() // Skip current character
            } else {
                console.log("Kem iet gevonde dak ni ken: ", src[0])
                Deno.exit(1)
            }
        }
    }
    tokens.push({type: TokenType.EOF, value: "EndOfFile"})
    return tokens
}