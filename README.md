# Kempense Programmeer Taal (KPT)

**KPT** is short for 'Kempense Programmeer Taal' and is a custom scripting language written in TypeScript.  
Check examples for some functionalities>

## Running the repl
```shell
deno run -A main.ts repl
```
To exit the repl use `deruit`

## Running a file
```shell
deno run -A main.ts file.kpt
```

## Keywords

| KPT Keyword | TypeScript Equivalent |
| ----------- | ---------------------- |
| efkes       | let                    |
| altij       | const                  |
| funkse      | function               |
| zegt        | console.log            |
| just        | true                   |
| nijust      | false                  |
| nikske      | null                   |
| pi          | Math.PI                |
| zegt()      | console.log()          |
| waduurist() | new Date(Date.now())   |
| funkse      | function               |
| isda        | if                     |

## Supported Operators
- `+` : Addition
- `-` : Subtraction
- `*` : Multiplication
- `/` : Division
- `%` : Modulus
- `**` : Exponentiation
- `//` : Floor Division
### Supported Comparison Operators
- `<` : Less than (only numbers)
- `>` : Greater than (only numbers)

## Functionalities
- No need for `;` (but should be possible)
- Functions return the last evaluated statement automatically
- Strings can be defined using `'` and `"`
- Place comments using `#`
