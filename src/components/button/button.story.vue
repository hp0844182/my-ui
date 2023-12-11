<script setup lang="ts">
  import Button from './button.vue'
  const handleClick = ()=>{
    console.log('click')
  }
</script>
<template>
  <Story>
    <Button @click="handleClick">
      123
    </Button>
  </Story>
</template>
