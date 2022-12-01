import OP from '../enums'

interface ICore {
  readonly OP: typeof OP
  push<T>(_value: T): [number, T]
  add(): [number, null]
  sub(): [number, null]
  eq(): [number, null]
  _if(): [number, null]
  end(): [number, null]
  dump(): [number, null]
}

interface IVM {
  simulate(program: Array<[number, null] | [number, number]>): void
  compile(program: Array<[number, null] | [number, number]>, path: string): void
  blocks(program: Array<[number, null] | [number, number]>): void
}

interface ILexer {
  lex(path: string): Array<[[number, null], any]>
  tokenizer(source: any): void
}

export { ICore, IVM, ILexer }
