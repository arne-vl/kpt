# Kempense Programmeer Taal (KPT)

**KPT** is short for 'Kempense Programmeer Taal' and is a custom scripting language written in TypeScript.  
Check examples for some functionalities>

## Running the repl
```shell
deno run -A main.ts
```
> To exit the repl use `deruit`

## Running a file
```shell
deno run -A main.ts file.kpt
```

## Keywords

| KPT Keyword | TypeScript Equivalent |
| ----------- | ---------------------- |
| efkes       | let                    |
| altij       | const                  |
| just        | true                   |
| nijust      | false                  |
| nikske      | null                   |
| pi          | Math.PI                |
| zegt()      | console.log()          |
| waduurist() | new Date(Date.now())   |
| funkse      | function               |
| as        | if                     |
| aans        | else                   |

## Supported Operators
- `+` : Addition
- `++` : Increment
- `-` : Subtraction
- `--` : Decrement
- `*` : Multiplication
- `/` : Division
- `%` : Modulus
- `**` : Exponentiation
- `//` : Floor division
### Supported Comparison Operators
- `<` : Less than (only numbers)
- `>` : Greater than (only numbers)
- `<=` : Less than equals (only numbers)
- `>=` : Greater than equals (only numbers)
- `==` : Equal to
- `!=` : Not equal to
### Supported Assignment Operators
- `+=` : Addition assignment
- `-=` : Subtraction assignment
- `*=` : Multiplication assignment
- `/=` : Division assignment
- `%=` : Modulo assignment
- `**=` : Exponential assignment
- `//=` : Floor division assignment
### Supported Logical Operators
- `en` : Logical AND
- `of` : Logical OR
- `ni` : Logical NOT

## Functionalities
- No need for `;` (but should be possible)
- Functions return the last evaluated statement automatically
- Strings can be defined using `'` and `"`
- Place comments using `#`
