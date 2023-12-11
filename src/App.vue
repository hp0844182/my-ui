<script setup lang="ts">
import { Avatar } from '@/components/avatar';
import Button from '@/components/button/button.vue';
import { Motion,Presence,PresenceGroup } from '@/components/motion';
import { ref } from 'vue';

const show = ref(true)
const onPress = (e:any) => {
  // console.log('onPress',e)
}
const onPressStart = (e)=>{
  // console.log('onPressStart',e)
}
const onPressEnd = (e)=>{
  // console.log('onPressEnd',e)
}
const onPressUp = (e)=>{
  // console.log('onPressUp',e)
}
const onPressChange = (e)=>{
  // console.log('onPressChange',e)
}

const old = ()=>{
  console.log('old')
}
const newE = ()=>{
  console.log('newE')
}
</script>

<template>
  <div>
    <div class="flex gap-3 items-center">
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
      <Avatar name="Junior" />
      <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
      <Avatar name="Jane" />
      <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
      <Avatar name="Joe" />
    </div>
    <div class="flex gap-4 items-center">
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        class="w-6 h-6 text-tiny"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        size="sm"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        size="md"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a04258114e29026302d"
        size="lg"
      />
      <Avatar
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
        class="w-20 h-20 text-large"
      />
    </div>
    <div class="flex gap-3 items-center">
      <Avatar
        :is-disabled="true"
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      />
      <Avatar
        :is-disabled="true"

        name="Junior"
      />
      <Avatar
        :is-disabled="true"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <Avatar
        :is-disabled="true"
        name="Jane"
      />
      <Avatar
        :is-disabled="true"
        src="https://i.pravatar.cc/150?u=a04258114e29026702d"
      />
      <Avatar
        :is-disabled="true"
        name="Joe"
      />
    </div>
    <div class="flex gap-4 items-center">
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      />
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      />
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a04258114e29026702d"
      />
      <Avatar
        :is-bordered="true"
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
      />
    </div>

    <div class="flex gap-4 items-center">
      <Avatar
        :is-bordered="true"
        radius="full"
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
      />
      <Avatar
        :is-bordered="true"
        radius="lg"
        src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      />
      <Avatar
        :is-bordered="true"
        radius="md"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <Avatar
        :is-bordered="true"
        radius="sm"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
    </div>

    <div class="flex gap-4 items-center">
      <Avatar
        :is-bordered="true"
        color="default"
        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      />
      <Avatar
        :is-bordered="true"
        color="primary"
        src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
      />
      <Avatar
        :is-bordered="true"
        color="secondary"
        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
      />
      <Avatar
        :is-bordered="true"
        color="success"
        src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      />
      <Avatar
        :is-bordered="true"
        color="warning"
        src="https://i.pravatar.cc/150?u=a04258114e29026702d"
      />
      <Avatar
        :is-bordered="true"
        color="danger"
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
      />
    </div>

    <Button
      href="https://vitejs.dev"
      color="success"
      size="sm"
      variant="shadow"
      class-name="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      @press="onPress"
      @press-start="onPressStart"
      @press-end="onPressEnd"
      @press-change="onPressChange"
      @press-up="onPressUp"
    >
      <!-- @press="onPress" -->
      <!-- @click="handleClick" -->
      button
    </Button>
    <div>
      <PresenceGroup>
        <Motion
          v-show="show"
          key="1"
          as="div"
          :initial="{ opacity: 0, scale: 0 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.6 }"
          class="w-24 h-24 bg-purple-400"
        />
        <Motion
          v-show="show"
          key="2"
          as="div"
          :initial="{ opacity: 0, scale: 0 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.6 }"
          class="w-24 h-24 bg-purple-400"
        />
      </PresenceGroup>
      <button>
        sss
      </button>
      <Button
        :is-loading="!show"
        spinner-placement="end"
        color="primary"
        as="div"
        @click="show?old():newE()"
        @press="show = !show"
      >
        Toggle
      </Button>
    </div>
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
