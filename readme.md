Rewriting Porth, which is Forth written in Python - in Typescript for absolute entertainment ;)

# How to run

`src/in` -> input file
`src/out` -> output files

Basically VM has 2 options: either `simulate` or `compile`. `simulate` will just run the code with typescript.
If you want to generate assembly and link it, use `compile`.

`simulate` should be run with:
  - `sim` 
  - `<input-file-path>`

example: `node dist/index.js sim src/in/test.t`

`compile` should be run with: 
  - `compile` 
  - `<input-file-path>` 
  - `<outut-file-path>`

example: `node dist/index.js compile src/in/test.t src/out/output.asm`

Code example: `20 20 + 5 - .`. This will translate to:

```javascript
push(20)
push(20)
add()
push(5)
sub()
dump()
```

Copyright obviously goes to: https://gitlab.com/tsoding/porth
