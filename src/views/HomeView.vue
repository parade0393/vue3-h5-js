<script setup>
import {useRouter} from "vue-router"
import {computed} from "vue"
const router = useRouter()
const routeList = computed(()=>{
  return router.options.routes.filter(el => el.path !== "/")
})
</script>

<template>
  <main class="wrapper">
    <van-list>
      <van-cell v-for="item in routeList" :title="item.meta.title" is-link :to="item.path" :key="item.path"></van-cell>
    </van-list>
  </main>
</template>
<style lang="less" scoped>

</style>
