<script setup>
import { RouterView } from 'vue-router'
import { useKeepAlive } from '@/hooks/useKeepAlive'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const { keepAliveComponents, handleRouteChange } = useKeepAlive()
const router = useRouter()

// 监听路由变化
watch(
  () => router.currentRoute.value,
  (to, from) => {
    handleRouteChange(to, from)
  }
)
</script>

<template>
 <router-view v-slot="{ Component }">
    <keep-alive :include="keepAliveComponents">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped>

</style>
