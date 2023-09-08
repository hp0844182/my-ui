import { useImage } from "@/hooks";
import { dataAttr } from "@/shared";
import { avatar, type AvatarSlots, type AvatarVariantProps, type SlotsToClasses } from "@/theme";
import { computed, toRefs } from "vue";
import type { ImgHTMLAttributes } from "vue/types/jsx";

interface Props {
  /**
   * The name of the person in the avatar. -
   * if **src** has loaded, the name will be used as the **alt** attribute of the **img**
   * - If **src** is not loaded, the name will be used to create the initials
   */
  name?: string;
  /**
   * Image source.
   */
  src?: string;
  /**
   * Image alt text.
   */
  alt?: string;
  /**
   * Whether the avatar can be focused.
   * @default false
   */
  isFocusable?: boolean;
  /**
   * If `true`, the fallback logic will be skipped.
   * @default false
   */
  ignoreFallback?: boolean;
  /**
   * If `false`, the avatar will show the background color while loading.
   */
  showFallback?: boolean;
   /**
   * Function to get the initials to display
   */
   getInitials?: (name: string) => string;
  /**
   * Classname or List of classes to change the classNames of the avatar.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Avatar classNames={{
   *    base:"base-classes",
   *    img: "image-classes",
   *    name: "name-classes",
   *    icon: "icon-classes",
   *    fallback: "fallback-classes"
   * }} />
   * ```
   */
  classNames?: SlotsToClasses<AvatarSlots>;
  imgProps?: ImgHTMLAttributes;
  
}

export type UseAvatarProps = Props &
  Omit<AvatarVariantProps, "children" | "isInGroup" | "isInGridGroup">;

interface ImageEvents {
  /**
  * Function called when image failed to load
  */
  onError?: (e:Event) => void;
}


export function useAvatar(props: UseAvatarProps,events:ImageEvents) {
  const isInGroup = false

  const {ignoreFallback,name, src,showFallback:showFallbackProp,color,radius,size,isBordered,isDisabled,classNames,imgProps} = toRefs(props)

  const imageStatus = useImage(props,events);

  const isImgLoaded = computed(()=>{
    return imageStatus.value === "loaded";
  })

  /**
   * Fallback avatar applies under 2 conditions:
   * - If `src` was passed and the image has not loaded or failed to load
   * - If `src` wasn't passed
   *
   * In this case, we'll show either the name avatar or default avatar
   */
  const showFallback =computed(()=>{
    return (!src?.value || !isImgLoaded.value) && showFallbackProp?.value;
  })

  const slots = computed(()=>{
    return avatar({
      color:color?.value,
      radius:radius?.value,
      size:size?.value,
      isBordered:isBordered?.value,
      isDisabled:isDisabled?.value,
      isInGroup,
      isInGridGroup: false,
    })
  })

  const avatarProps = computed(()=>{
    return {
      class:  slots.value.base({
        class: (classNames?.value?.base),
      }),
    }
  })

  const ImageProps = computed(()=>{
    console.log('isImgLoaded',isImgLoaded.value)
    return {
      src:src?.value,
      "data-loaded": dataAttr(isImgLoaded.value),
      class:slots.value.img({class: classNames?.value?.img}),
      ...imgProps?.value
    }
  })

  return {
    src,
    name,
    slots,
    classNames,
    isImgLoaded,
    showFallback,
    ignoreFallback,
    ImageProps,
    avatarProps
  }
}
