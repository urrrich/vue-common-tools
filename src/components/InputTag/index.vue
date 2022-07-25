<template>
  <div
    ref="rootRef"
    :class="{
      'el-textarea__inner': true,
      'input-tag': true,
      'input-tag-focus': isFocus,
      'input-tag-disabled': disabled,
      'input-tag-hastag': displayTags.length
    }"
  >
    <div class="input-tag-wrap">
      <el-tag
        v-for="(e, i) in displayTags"
        :key="i"
        class="input-tag-tag"
        :closable="tagCloseable"
        :type="disabled ? 'info' : ''"
        @close="removeTag(i)"
      >
        {{ e }}
      </el-tag>

      <el-popover v-if="hiddenTags.length" placement="top" trigger="hover" width="auto">
        <el-tag
          v-for="(e, i) in hiddenTags"
          :key="i"
          class="input-tag-tag"
          :closable="tagCloseable"
          :type="disabled ? 'info' : ''"
          @close="removeTag(maxTagCount + i)"
        >
          {{ e }}
        </el-tag>
        <template #reference>
          <el-tag class="input-tag-rest" type="info">+{{ hiddenTags.length }}</el-tag>
        </template>
      </el-popover>

      <div class="input-tag-input">
        <input
          ref="inputRef"
          v-model="inputVal"
          :placeholder="placeholder"
          :disabled="disabled"
          @input="onInput"
          @keydown.enter="addTag"
          @keydown.delete="onInputDelete"
          @blur="onInputBlur"
          @focus="onInputFocus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'

  const emit = defineEmits(['update:modelValue', 'exceed', 'inputExceed'])

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    separator: {
      type: String,
      default: ','
    },
    addOnBlur: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    },
    // 允许标签的最大数量
    max: {
      type: Number
    },
    // 单个标签的最大长度
    maxLength: {
      type: Number
    },
    // 标签的最大展示数量
    maxTagCount: {
      type: Number
    },
    // 是否允许添加相同 tag
    allowDuplicates: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String
    }
  })

  const tagCloseable = computed(() =>  !props.disabled)
  const tagList = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    }
  })
  const displayTags = computed(() => {
    if (props.maxTagCount && tagList.value.length > props.maxTagCount) {
      return tagList.value.slice(0, props.maxTagCount)
    }
    return tagList.value
  })
  const hiddenTags = computed(() => {
    if (props.maxTagCount && tagList.value.length > props.maxTagCount) {
      return tagList.value.slice(props.maxTagCount - tagList.value.length)
    }
    return []
  })

  const inputVal = ref('')
  const isFocus = ref(false)
  const rootRef = ref(null)
  const inputRef = ref(null)

  function addTag() {
    if (inputVal.value) {
      let tags = [...tagList.value]
      tags = tags.concat(inputVal.value.split(','))
      if (props.max && tags.length > props.max) {
        tags = tags.slice(0, props.max)
        emit('exceed')
      }
      tagList.value = tags
      inputVal.value = ''
    }
  }

  function removeTag(index) {
    let tags = [...tagList.value]
    tags.splice(index, 1)
    tagList.value = tags
  }

  function onInput() {
    if (props.maxLength) {
      const val = inputVal.value
      const tags = val.split(',').map((v) => {
        if (props.maxLength && v.length > props.maxLength) {
          emit('inputExceed')
          return v.slice(0, props.maxLength)
        }
        return v
      })
      inputVal.value = tags.join(',')
    }
  }

  function onInputDelete() {
    if (tagList.value.length && inputVal.value === '') {
      removeTag(tagList.value.length - 1)
    }
  }

  function onInputBlur() {
    isFocus.value = false
    if (props.addOnBlur) {
      addTag()
    } else {
      inputVal.value = ''
    }
  }

  function onInputFocus() {
    isFocus.value = true
  }
</script>

<style lang="scss" scoped>
  .input-tag {
    flex: 1;
    padding: 2px 5px;
    &-wrap {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 1;
      align-items: center;
      overflow: hidden;
    }
    &-tag,
    &-rest {
      margin-right: 5px;
      margin-bottom: 2px;
      margin-top: 2px;
      height: 22px;
    }
    &-input {
      flex-grow: 1;
      width: min-content;
      min-width: 38px;
      input {
        width: 100%;
        -webkit-appearance: none;
        font-size: inherit;
        padding: 0;
        outline: none;
        border: none;
        background: none;
        box-sizing: border-box;
        line-height: 28px;
        padding-left: 6px;
      }
    }
    &:hover {
      box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
    }
    &-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    }
    &-preview {
      box-shadow: none !important;
      background-color: transparent;
      padding-left: 0;
    }
    &-disabled {
      box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset !important;
      background-color: var(--el-disabled-bg-color);
      cursor: not-allowed;
    }
    &-hastag input {
      padding-left: 0;
    }
  }
</style>
