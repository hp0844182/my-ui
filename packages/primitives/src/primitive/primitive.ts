import { defineComponent, h,
  //  mergeProps, cloneVNode, 

  type PropType } from "vue";
import { renderSlotFragments, isValidVNodeElement } from "@/shared";
import { mergeProps } from "@/shared/mergeProps";
import type { CSSProperties } from "vue/types/jsx";

export type AsTag =
  | "a"
  | "button"
  | "div"
  | "form"
  | "h2"
  | "h3"
  | "img"
  | "input"
  | "label"
  | "li"
  | "nav"
  | "ol"
  | "p"
  | "span"
  | "svg"
  | "ul"
  | "template"
  | ({} & string); // any other string

const throwError = (componentName: string) => {
  throw new Error(
    [
      `Detected an invalid children for \`${componentName}\` with \`asChild\` prop.`,
      "",
      "Note: All components accepting `asChild` expect only one direct child of valid VNode type.",
      "You can apply a few solutions:",
      [
        "Provide a single child element so that we can forward the props onto that element.",
        "Ensure the first child is an actual element instead of a raw text node or comment node.",
      ]
        .map((line) => `  - ${line}`)
        .join("\n"),
    ].join("\n")
  );
};

export type PrimitiveProps = {
  /**
   * Setting "asChild" to true has the same effect as setting "as" to "template".
   * @default false
   */
  asChild?: boolean;
  /**
   * @default "div"
   */
  as?: AsTag;
};

const objectType = <T>(defaultVal?:any) => ({
  type: Object as PropType<T>,
  default:()=> defaultVal
})

export const Primitive = defineComponent({
  name: "Primitive",
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
    as: {
      type: String as PropType<AsTag>,
      default: "div",
    },
    styles:objectType<CSSProperties>(),
    className:{
      type:String,
      default:''
    }
  },
  setup(props, context) {
    const { attrs, slots,listeners } = context;
    const { className,styles} = props
    const asTag = props.asChild ? "template" : props.as;
    if (asTag !== "template") {
      return () => h(props.as, {
        attrs:attrs
      },slots.default?.());
    }
    return () => {
      if (!slots.default) return null;
      const childrens = renderSlotFragments(slots.default());
      if (childrens.length !== 1) throwError(asTag);

      const firstChildren = childrens[0];
      if (!isValidVNodeElement(firstChildren)) throwError(asTag);
      // firstChildren.parent!.data!.style = {}
      if (Object.keys(attrs).length > 0||className||styles) {
        // remove props ref from being inferred
        const mergedProps = mergeProps({attrs,on:listeners,style:styles,class:className}, firstChildren.data ?? {});
        firstChildren.data = mergedProps
      }
      return firstChildren;
    };
  },
});
