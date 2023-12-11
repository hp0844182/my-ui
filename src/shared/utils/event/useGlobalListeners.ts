import { useEventListener } from "@vueuse/core"

type EventType = keyof DocumentEventMap

export function useGlobalListeners() {
  const globalListeners = new Map()
  
  const addGlobalListener = <T extends EventType>(
    eventTarget:EventTarget,type:T,
    listener:(ev: DocumentEventMap[T]) => any,
    options?:boolean | AddEventListenerOptions)=>  
    {
    // Make sure we remove the listener after it is called with the `once` option.
    if((options as AddEventListenerOptions)?.once){
      listener = (...args)=>{
        globalListeners.delete(listener)
        listener(...args)
      }
    }
    const cancel =  useEventListener(eventTarget,type,listener,options)
    globalListeners.set(listener,cancel)
    return cancel
  }


  const removeGlobalListener = (fn:Function) => {
    const cancel = globalListeners.get(fn)
    cancel?.()
    globalListeners.delete(fn)
  }

  const removeAllGlobalListeners = () => {
    globalListeners.forEach((value, key) => {
      removeGlobalListener(key);
    });
  }


  return {addGlobalListener, removeGlobalListener, removeAllGlobalListeners};
}
