# Kempense Programmeer Taal (KPT)

**KPT** is short for 'Kempense Programmeer Taal' and is a custom scripting language written in TypeScript.

## Running example file
```shell
deno run -A main.ts
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

## Supported Operators

- `+` : Addition
- `-` : Subtraction
- `*` : Multiplication
- `/` : Division
- `%` : Modulus
- `**` : Exponentiation
- `//` : Floor Division
- `<` : Less than (only numbers)
- `>` : Greater than (only numbers)

## Functionalities
- No need for `;` (but should be possible)
- Functions return the last evaluated statement automatically
- Strings can be defined using `'` and `"`
- Place comments using `#`
