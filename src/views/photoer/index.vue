<script lang="ts" setup>
import { ref, computed } from 'vue'
const name = ref('')
// const handleChanges = (index, value) => {
//   console.log(index, value)
// }
const config = {
  events: {
    focus: (value, formData, event) => {
      console.log('name,focus', value, formData, event)
    },
    click: (value, formData, event) => {
      console.log('name,click', value, formData, event)
    }
  }
}
const eventListeners = computed(() => {
  const listeners = {}
  for (const [eventName, handler] of Object.entries(config.events)) {
    listeners[`on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`] = (event) => {
      const value = 1
      const formData = { name: '地方' } // 构建 formData
      handler(value, formData, event)
    }
  }
  return listeners
})
</script>

<template>
  <div>
    <van-field v-model="name" label="文本" v-bind="eventListeners" />
  </div>
</template>

<style lang="less" scoped></style>
