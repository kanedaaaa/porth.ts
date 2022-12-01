import CORE from './core'
import OP from './enums'
import fs from 'fs'

import {
  asm_push,
  asm_add,
  asm_sub,
  asm_eq,
  asm_if,
  asm_end,
  asm_dump,
  header_with_dump,
  footer
} from './assembly'
import { IVM } from './interfaces/global'

class VM extends CORE implements IVM {
  public constructor() {
    super()
  }

  simulate(program: Array<[number, null] | [number, number]>) {
    if (OP.COUNT != 7) throw 'Missing an program[op] maybe?'

    const stack: Array<number | null> = []

    // determine where are the if blocks
    this.blocks(program)

    for (let op = 0; op < program.length; ++op) {
      if (program[op][0] == OP.PUSH && program[op][1] !== null) {
        stack.push(program[op][1])
      } else if (program[op][0] == OP.ADD) {
        let a = stack.pop()
        let b = stack.pop()

        if (a !== undefined && b !== undefined) stack.push(a! + b!)
      } else if (program[op][0] == OP.SUB) {
        let a = stack.pop()
        let b = stack.pop()

        if (a !== undefined && b !== undefined) stack.push(b! - a!)
      } else if (program[op][0] == OP.EQ) {
        let a = stack.pop()
        let b = stack.pop()

        if (a !== undefined && b !== undefined) stack.push(Number(a == b))
      } else if (program[op][0] == OP.IF) {
        if (program[op][1] !== null) {
          let a = stack.pop()
          if (a !== undefined && !a) {
            // op[1] will never be a null, its checked
            op = program[op][1] as number
          }
        } else {
          throw 'No end block for IF!'
        }
      } else if (program[op][0] == OP.END) {
        // end here is just a tag!
      } else if (program[op][0] == OP.DUMP) {
        let a = stack.pop()

        if (a !== undefined) console.log(a)
      } else {
        throw 'Wrong instruction provided!'
      }
    }
  }

  compile(program: Array<[number, null] | [number, number]>, path: string) {
    if (OP.COUNT != 7) throw 'Missing an program[op] maybe?'
    this.blocks(program)

    fs.appendFileSync(path, header_with_dump())

    for (let op = 0; op < program.length; ++op) {
      if (program[op][0] == OP.PUSH && program[op][1] !== null) {
        // same thing here, it will never be null
        fs.appendFileSync(path, asm_push(program[op][1] as number))
      } else if (program[op][0] == OP.ADD) {
        fs.appendFileSync(path, asm_add())
      } else if (program[op][0] == OP.SUB) {
        fs.appendFileSync(path, asm_sub())
      } else if (program[op][0] == OP.EQ) {
        fs.appendFileSync(path, asm_eq())
      } else if (program[op][0] == OP.IF) {
        if (program[op][1] !== null) {
          fs.appendFileSync(path, asm_if(program[op][1] as number))
        } else {
          throw 'No end block found!'
        }
      } else if (program[op][0] == OP.END) {
        fs.appendFileSync(path, asm_end(op))
      } else if (program[op][0] == OP.DUMP) {
        fs.appendFileSync(path, asm_dump())
      } else {
        throw 'Wrong instruction provided!'
      }
    }

    fs.appendFileSync(path, footer())
  }

  blocks(program: Array<[number, null] | [number, number]>) {
    let blockStack: Array<number> = []

    for (let index = 0; index < program.length; ++index) {
      if (program[index][0] == OP.IF) {
        blockStack.push(index)
      } else if (program[index][0] == OP.END) {
        let if_ip = blockStack.pop()
        if (if_ip !== undefined) {
          if (program[if_ip][0] == OP.IF) {
            program[if_ip][1] = index
          } else {
            throw 'End can only be assigned to IF'
          }
        }
      }
    }
  }
}

export default VM
