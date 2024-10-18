<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  field: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

//当前选择的日期
// const currentDate = ref();
// const currentDate = computed(() => {
//   if (props.modelValue) {
//     return dayjs(props.modelValue).toDate()
//   } else {
//     return new Date()
//   }
// })

// 格式化日期的工具函数
const formatFiledValue = (date) => {
  return dayjs(date).format(props.field.formatType)
}

const formatDate = (date) => {
  return dayjs(date ? date : new Date())
    .format('YYYY-MM-DD')
    .split('-')
}

const currentDate = ref(formatDate(props.modelValue))

// 使用watch来监听modelValue的变化，更新currentDate
// watch(
//   () => props.modelValue,
//   (newValue) => {
//     currentDate.value = formatDate(newValue)
//   }
// )

const fieldValue = computed({
  get: () => {
    if (props.modelValue) {
      return formatFiledValue(props.modelValue)
    } else {
      // 如果没有初始值，使用当前日期
      const initValue = formatFiledValue(currentDate.value)
      // 确保只在组件初始化时触发一次
      if (!props.modelValue) {
        emit('update:modelValue', initValue)
      }
      return initValue
    }
  },
  set: (value) => emit('update:modelValue', value)
})

const showPicker = ref(false)

const onConfirm = (value) => {
  if (Array.isArray(value)) {
    fieldValue.value = value.join(',')
  } else {
    fieldValue.value = value
  }
  fieldValue.value = formatFiledValue(value.selectedValues)

  showPicker.value = false
}
const showPick = () => {
  showPicker.value = true
}
</script>

<template>
  <div>
    <van-field
      v-model="fieldValue"
      v-show="field.show"
      :label="field.label"
      :placeholder="field.placeholder"
      :type="field.type"
      v-bind="field.props"
      :rules="rules"
      @click="showPick"
    />
    <van-popup v-model:show="showPicker" v-bind="field.childProps">
      <van-date-picker
        v-model="currentDate"
        :title="field.label"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        v-bind="field.nestChildProps"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped></style>
