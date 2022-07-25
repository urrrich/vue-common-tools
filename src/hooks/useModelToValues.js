import { ref, computed } from 'vue'

const decstArray = (rule, value, target) => {
  const pattern = /^\[(.+)\]$/
  if (pattern.test(rule)) {
    const match = rule.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      value = Array.isArray(value) ? value : [value]
      keys.forEach((k, index) => {
        k = k.trim()
        target[k] = value[index] || ''
      })
    }
  }
}

const undecstArray = (rule, data, key, target) => {
  const pattern = /^\[(.+)\]$/
  if (pattern.test(rule)) {
    const match = rule.match(pattern)
    if (match && match[1]) {
      const keys = match[1].split(',')
      const temp = []
      keys.forEach((k, index) => {
        k = k.trim()
        temp[index] = data[k]
      })
      target[key] = temp
    }
  }
}

export function useModelToValues({
  data,
  keyMaps,
  deleteInvalid = true,
  toValues = (value) => value,
  toModel = (data, model) => {}
}) {
  const formModel = ref(data())
  const values = computed({
    get() {
      const target = {}
      Object.entries(formModel.value).forEach(([key, value]) => {
        const rule = keyMaps[key]
        if (rule) {
          decstArray(rule, value, target)
        } else {
          target[key] = value
        }
      })

      if (deleteInvalid) {
        Object.entries(target).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) {
            delete target[key]
          }
        })
      }

      return toValues(target)
    },
    set(data) {
      Object.entries(formModel.value).forEach(([key, value]) => {
        const rule = keyMaps[key]
        if (rule) {
          undecstArray(rule, data, key, formModel.value)
        } else {
          formModel.value[key] = data[key] ?? value
        }
      })
      toModel(data, formModel.value)
    }
  })

  const reset = () => {
    formModel.value = data()
  }

  return {
    reset,
    formModel,
    values
  }
}