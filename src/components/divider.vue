<template>
  <div
    class="z-divider"
    :class="[
      {'z-divider--hairline':hairline},
      hasContent? `z-divider--content-${props.contentPosition}`:'',
      { 'z-divider--dashed': props.dashed },
    ]"
  >

    <slot></slot>
  </div>
</template>

<script setup>
import {useSlots,computed} from "vue"

const slots = useSlots()

const props = defineProps({
  // 文字位置：center, left, right
  contentPosition: {
    type: String,
    default: 'center',
    validator: (val) => ['center', 'left', 'right'].includes(val)
  },
  // 是否为虚线
  dashed: {
    type: Boolean,
    default: false
  },
  // 	是否使用 0.5px 线
  hairline: {
    type: Boolean,
    default: true
  },
})

// 是否有内容
const hasContent = computed(() => {
  // 检查插槽内容或文字内容
  return slots.default && slots.default().length > 0
})

</script>

<style scoped>

.z-divider {
    display: flex;
    align-items: center;
    margin: 16px 0;
    color: #969799;
    font-size:14px;
    line-height: 24px;
    border-color: #ebedf0;
    border-style: solid;
    border-width: 0;
}

.z-divider--hairline:before, .z-divider--hairline:after {
    transform: scaleY(.5);
}

.z-divider:before {
    content: "";
}
.z-divider:before, .z-divider:after {
    display: block;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    border-width: 1px 0 0;
}
.z-divider--content-left:before {
    max-width: 10%;
}
.z-divider--content-right:after {
    max-width: 10%;
}
.z-divider--content-center:before, .z-divider--content-left:before, .z-divider--content-right:before {
    margin-right: 16px;
}
.z-divider--content-center:after, .z-divider--content-left:after, .z-divider--content-right:after {
    margin-left: 16px;
    content: "";
}
.z-divider--dashed {
    border-style: dashed;
}

</style>
