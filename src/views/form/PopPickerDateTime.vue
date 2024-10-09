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
    return dayjs(props.modelValue).toDate()
  } else {
    return new Date()
  }
})

const fieldValue = computed({
  get: () => {
    if (props.modelValue) {
      return dayjs(props.modelValue).format(props.field.formatType)
    } else {
      return dayjs().format(props.field.formatType)
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
