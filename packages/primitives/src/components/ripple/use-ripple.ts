import { ref, watch } from "vue";

export type RippleType = {
  key: number;
  x: number;
  y: number;
  size: number;
};

export interface UseRippleProps {
  /**
  /**
   * The time to remove the ripples in ms.
   * @default 1000
   */
  removeAfter?: number;
}

export function useRipple(props: UseRippleProps = {}) {

  const ripples = ref<RippleType[]>([])
  let timeoutIds: number[] = []
  watch([() => ripples.value.length,()=>props.removeAfter], () => {
    if (timeoutIds.length) {
      timeoutIds.forEach((id) => clearTimeout(id));
    }
    timeoutIds = ripples.value.map(
      (_, i) =>
        setTimeout(() => {
          ripples.value = ripples.value.filter((_, index) => index !== i)
        }, props.removeAfter), // remove after 1s
    );
  })

  const onClick = (event: MouseEvent) => {
    const trigger = event.currentTarget;
    // @ts-ignore
    const size = Math.max(trigger?.clientWidth, trigger?.clientHeight);
    // @ts-ignore
    const rect = trigger?.getBoundingClientRect();
    ripples.value.push({
      key: new Date().getTime(),
      size,
      x: event.clientX - rect.x - size / 2,
      y: event.clientY - rect.y - size / 2,
    })
  }

  return { ripples, onClick };
}

export type UseRippleReturn = ReturnType<typeof useRipple>;
