import { type } from 'os'
import OP from './enums'
import { ICore } from './interfaces/global'

class CORE implements ICore {
  public constructor() {}

  public readonly OP = OP

  push<T>(_value: any): [number, T] {
    return [OP.PUSH, _value]
  }

  add(): [number, null] {
    return [OP.ADD, null]
  }

  sub(): [number, null] {
    return [OP.SUB, null]
  }

  eq(): [number, null] {
    return [OP.EQ, null]
  }

  _if(): [number, null] {
    return [OP.IF, null]
  }

  end(): [number, null] {
    return [OP.END, null]
  }

  dump(): [number, null] {
    return [OP.DUMP, null]
  }
}

export default CORE
