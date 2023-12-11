const onRE = /^on[^a-z]/
export const isOn = (key: string) => onRE.test(key)

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isArray = Array.isArray

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'
