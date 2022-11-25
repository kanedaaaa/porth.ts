import fs from 'fs'
import CORE from './core'
import { ICore } from './interfaces/global'

const lexer = (path: string) => {
  const core: ICore = new CORE()
  const source = fs.readFileSync(path, 'utf-8').split(' ')

  // wtf
  let stack: any = []

  for (let word of source) {
    if (word == '+') {
      stack.push(core.add())
    } else if (word == '-') {
      stack.push(core.sub())
    } else if (word == '.') {
      stack.push(core.dump())
    } else stack.push(core.push(Number(word)))
  }

  return stack
}

export default lexer
