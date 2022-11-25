import OP from './enums'

class CORE {
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

  dump(): [number, null] {
    return [OP.DUMP, null]
  }
}

export default CORE
