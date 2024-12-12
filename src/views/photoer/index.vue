<script setup>
import Divider from '@/components/divider.vue'
</script>

<template>
  <div>
    <!-- 基本使用 -->
    <Divider />

    <!-- 基本使用不使用0.5分割线 -->
    <Divider :hairline="false"/>

    <!-- 带文字 -->
    <Divider >标题</Divider>

    <!-- 使用插槽 -->
    <Divider>
      <span>自定义内容</span>
    </Divider>

    <!-- 左对齐 -->
    <Divider content-position="left">左对齐</Divider>

    <!-- 左对齐 -->
    <Divider content-position="right">右对齐</Divider>

    <!-- 虚线 -->
    <Divider dashed  >虚线分割</Divider>

    <!-- 自定义颜色 -->
    <Divider  :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px',fontSize:'24px' }">自定义样式</Divider>
  </div>
</template>

<style lang="less" scoped></style>
