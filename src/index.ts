import VM from './vm'
import CORE from './core'
import { ICore, IVM } from './interfaces/global'
import process from 'process'
import { exec } from 'child_process'
import lexer from './lexer'
import fs from 'fs'

const core: ICore = new CORE()
const vm: IVM = new VM()

const formatPath = (path: string, add: string): string => {
  const r = new RegExp('/(?!.*/).*')
  const n = path.replace(r, add)

  return n
}

const pathError = (): string => {
  return `
        Usage: index.ts <SUBCOMMAND> [ARGS]
        "sim" to simulate the program
        "compile [ARGS]" to compile the program
    `
}

const main = (): number | undefined => {
  let argv = process.argv
  argv = argv.splice(2)

  if (argv.length < 2) {
    console.log(pathError())
    return 1
  }

  if (argv[0] == 'sim' && argv[1] !== undefined) {
    let stack = []

    if (fs.existsSync(argv[1])) {
      stack = lexer(argv[1])
    } else {
      throw `${argv[1]} path doesnt exists`
    }

    console.log(vm.simulate(stack))
  } else if (
    argv[0] == 'compile' &&
    argv[1] !== undefined &&
    argv[2] !== undefined
  ) {
    console.log('Compiling code...')

    let stack = []

    if (fs.existsSync(argv[1]) && fs.existsSync(argv[2])) {
      fs.unlink(argv[2], (err: any) => {
        if (err) throw err
      })

      stack = lexer(argv[1])
    } else {
      throw `${argv[1]} or ${argv[2]} path doesnt exists`
    }

    vm.compile(stack, argv[2])
    exec(
      `nasm -felf64 ${argv[2]}`,
      (err: any, stdout: string, stderr: string) => {
        if (err) {
          console.log(err)
        } else {
          console.log(stdout)
        }
      }
    )

    exec(
      `ld -o ${formatPath(argv[2], '/output')} ${formatPath(
        argv[2],
        '/output.o'
      )}`,
      (err: any, stdout: string) => {
        if (err) {
          console.log(err)
        } else {
          console.log(stdout)
        }
      }
    )
  } else {
    console.log(pathError())
    throw `${argv[1]} or ${argv[2]} Not found in argument list`
  }
}

main()
