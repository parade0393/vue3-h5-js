<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const popupVisible = ref(false);

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const showPopup = () => {
  popupVisible.value = true;
};

const closePopup = () => {
  popupVisible.value = false;
};
</script>

<template>
  <van-field v-model="fieldValue" v-show="field.show" :label="field.label" :placeholder="field.placeholder" :type="field.type" v-bind="field.props">
  </van-field>
</template>

<style lang="scss" scoped></style>
