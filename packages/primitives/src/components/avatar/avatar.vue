

<script setup lang="ts">
import { Primitive } from '@/primitive';
import { safeText } from '@/shared';
import { useAvatar, type UseAvatarProps } from './use-avatar';
import { computed, useSlots } from 'vue';
import Icon from './avatar-icon.vue';
interface AvatarProps {
  color?: UseAvatarProps['color'],
  size?: UseAvatarProps['size'],
  radius?: UseAvatarProps['radius'],
  isBordered?: UseAvatarProps['isBordered'],
  isDisabled?: UseAvatarProps['isDisabled'],
  src?: UseAvatarProps['src'],
  name?: UseAvatarProps['name'],
  alt?: UseAvatarProps['alt'],
  classNames?: UseAvatarProps['classNames'],
  imgProps?: UseAvatarProps['imgProps'],
  getInitials?:UseAvatarProps['getInitials'],
  showFallback?:UseAvatarProps['showFallback'],
}

defineOptions({
  name: 'UIAvatar',
  inheritAttrs: false,
})

const emits = defineEmits<{
  (type: 'error' , e: Event): void,
}>();
const props = withDefaults(defineProps<AvatarProps>(),{
  color:'default',
  radius:'full',
  showFallback:false
});

const alt = computed(()=>{
  return props.alt|| props.name ||'Avatar'
})

const {avatarProps,ImageProps,slots,showFallback:showFallBackEle} = useAvatar(props,{
  onError:(e)=>{
    emits('error',e)
  },
})

const getFallbackText = (name:string) => {
  if(props.getInitials){
    return props.getInitials(name);
  }else{
    return safeText(name);
  }
}

const slot = useSlots()
</script>


<template>
  <Primitive
    as="span"
    v-bind="avatarProps"
  >
    <Primitive
      v-if="src"
      as="img"
      v-bind="ImageProps"
      alt="alt"
    />
    <template v-if="!(!showFallBackEle&&src)">
      <div
        v-if="slot.fallbackComponent"
        aria-label="{alt}"
        :class="slots.fallback({class:classNames?.fallback})"
        role="img"
      >
        <slot name="fallbackComponent" />
      </div>
      <template v-else>
        <span
          v-if="name"
          :aria-label="alt"
          :class="slots.name({class: classNames?.name})"
          role="img"
        >
          {{ getFallbackText(name) }}
        </span>
        <span
          v-else
          :aria-label="alt"
          :class="slots.icon({class: classNames?.icon})"
          role="img"
        >
          <slot name="icon">
            <Icon />
          </slot>
        </span>
      </template>
    </template>
  </Primitive>
</template>
