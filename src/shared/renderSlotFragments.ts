import { type VNode } from "vue";

export function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) return [];
  return children.flatMap((child) => {
    if (child.tag === 'Fragment') {
      return renderSlotFragments(child.children as VNode[]);
    }
    return [child];
  });
}
