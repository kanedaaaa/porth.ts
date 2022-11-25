import OP from '../enums'

interface ICore {
  readonly OP: typeof OP
  push<T>(_value: T): [number, T]
  add(): [number, null]
  sub(): [number, null]
  dump(): [number, null]
}

interface IVM {
  simulate(
    program: Array<[number, null] | [number, number]>
  ): number | undefined
  compile(program: Array<[number, null] | [number, number]>, path: string): any
}

export { ICore, IVM }
