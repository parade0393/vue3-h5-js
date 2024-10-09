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
const currentDate = computed(() => {
  if (props.modelValue) {
    if ('multiple' === props.field?.childProps?.type || 'range' === props.field?.childProps?.type) {
      let arr = props.modelValue.split(props.field['range-separator'])
      let dateArr = []
      for (const element of arr) {
        dateArr.push(dayjs(element).toDate())
      }
      return dateArr
    } else {
      return dayjs(props.modelValue).toDate()
    }
  } else {
    if ('multiple' === props.field.childProps?.type || 'range' === props.field.childProps?.type) {
      return []
    } else {
      return new Date()
    }
  }
})

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showPicker = ref(false)

const onConfirm = (value) => {
  if (Array.isArray(value)) {
    fieldValue.value = value
      .map((el) => dayjs(el).format(props.field.formatType))
      .join(props.field['range-separator'] || ',')
  } else {
    fieldValue.value = dayjs(value).format(props.field.formatType)
  }

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

    <van-calendar
      v-model:show="showPicker"
      :default-date="currentDate"
      v-bind="field.childProps"
      :title="field.label"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </div>
</template>

<style lang="less" scoped></style>
