import type { VNodeData } from 'vue';
import { isArray, isOn } from "./general"
import { normalizeClass } from "./normalizeClass"
import { normalizeStyle } from "./normalizeStyle"

export type Data = Record<string, unknown>


export function mergeProps(...args: VNodeData[]) {
  const ret: Data = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (const key in toMerge) {
      if(key === 'attrs'){
        const atr = mergeProps(ret.attrs||{},toMerge[key as keyof VNodeData])
        ret.attrs = atr
      }if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class])
        }
      } else if (key === 'style') {
        ret.style = normalizeStyle([ret.style, toMerge.style])
      } else if (key === 'on') {
        ret.on = mergeEvents(toMerge.on,ret.on)
      } else if (key !== '') {
        ret[key] = toMerge[key as keyof VNodeData]
      }
    }
  }
  return ret
}

function mergeEvents(...args: any[]) {
  const ret: Data = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (const key in toMerge) {
      const existing = ret[key]
        const incoming = toMerge[key as keyof VNodeData]
        if (
          incoming &&
          existing !== incoming &&
          !(isArray(existing) && existing.includes(incoming))
        ) {
          ret[key] = existing
            ? [].concat(existing as any, incoming as any)
            : incoming
        }
    }
  }
  return ret
}
