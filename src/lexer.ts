import fs from 'fs'
import CORE from './core'
import { ICore, ILexer } from './interfaces/global'

class Lexer extends CORE implements ILexer {
  public constructor() {
    super()
  } 

  public lex = (path: string): Array<string> => {
    const source = fs.readFileSync(path, 'utf-8').split('\n')
  
    let split_source: any = []
    let stack: any = []
  
    for (let el of source) {
      split_source.push(...el.split(' ').filter((n) => n))
    }
  
    for (let word of split_source) {
      if (word == '+') {
        stack.push(this.add())
      } else if (word == '-') {
        stack.push(this.sub())
      } else if (word == '.') {
        stack.push(this.dump())
      } else stack.push(this.push(Number(word)))
    }
  
    return stack
  }

  tokenizer = () => {
    // tokenize stuff
  }
}

export default Lexer
