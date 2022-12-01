import fs from 'fs'
import CORE from './core'
import { ILexer } from './interfaces/global'

class Lexer extends CORE implements ILexer {
  public constructor() {
    super()
  }

  public lex = (path: string): Array<[[number, null], any]> => {
    const source = fs.readFileSync(path, 'utf-8').split('\n')

    let fsource: Array<string> = []
    let stack: Array<[number, null] | [number, number]> = []
    const tokens = this.tokenizer(source)

    for (let el of source) {
      fsource.push(...el.split(' ').filter((n) => n))
    }

    for (let word of fsource) {
      if (word == '+') {
        stack.push(this.add())
      } else if (word == '-') {
        stack.push(this.sub())
      } else if (word == '==') {
        stack.push(this.eq())
      } else if (word == 'თუ') {
        stack.push(this._if())
      } else if (word == 'დახურე') {
        stack.push(this.end())
      } else if (word == '.') {
        stack.push(this.dump())
      } else if (!isNaN(Number(word))) {
        stack.push(this.push(Number(word)))
      } else {
        for (let e of tokens) {
          if (word.indexOf(e.tokens)) {
            throw `Syntax error at line ${e.line} - ${word} not found`
          }
        }
      }
    }

    return [stack, tokens]
  }

  tokenizer = (source: any) => {
    let tokens: any = []
    let n = 1

    for (let el of source) {
      tokens.push({
        line: n,
        tokens: el
      })

      n++
    }

    return tokens
  }
}

export default Lexer
