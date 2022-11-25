import CORE from './core'
import OP from './enums'
import fs from 'fs'

import {
  asm_push,
  asm_add,
  asm_sub,
  asm_dump,
  header_with_dump
} from './assembly'

class VM extends CORE {
  public constructor() {
    super()
  }

  simulate(
    program: Array<[number, null] | [number, number]>
  ): number | undefined {
    if (OP.COUNT != 4) throw 'Missing an op maybe?'

    const stack: Array<number> = []

    for (let op of program) {
      if (op[0] == OP.PUSH && op[1] !== null) {
        stack.push(op[1])
      } else if (op[0] == OP.ADD) {
        let a = stack.pop()
        let b = stack.pop()

        if (a !== undefined && b !== undefined) stack.push(a + b)
      } else if (op[0] == OP.SUB) {
        let a = stack.pop()
        let b = stack.pop()

        if (a !== undefined && b !== undefined) stack.push(b - a)
      } else if (op[0] == OP.DUMP) {
        let a = stack.pop()

        if (a !== undefined) return a
      } else {
        throw 'Wrong instruction provided!'
      }
    }
  }

  compile(program: Array<[number, null] | [number, number]>, path: string) {
    if (OP.COUNT != 4) throw 'Missing an op maybe?'

    fs.appendFileSync(path, header_with_dump())

    for (let op of program) {
      if (op[0] == OP.PUSH && op[1] !== null) {
        fs.appendFileSync(path, asm_push(op[1]))
      } else if (op[0] == OP.ADD) {
        fs.appendFileSync(path, asm_add())
      } else if (op[0] == OP.SUB) {
        fs.appendFileSync(path, asm_sub())
      } else if (op[0] == OP.DUMP) {
        fs.appendFileSync(path, asm_dump())
      } else {
        throw 'Wrong instruction provided!'
      }
    }
  }
}

export default VM
