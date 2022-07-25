<script setup>
  import { useModelToValues, InputTag } from '../src'

  const { formModel, values, reset } = useModelToValues({
    data() {
      return {
        firstName: 'zhang',
        lastName: 'san',
        select: 1,
        daterange: '',
        tag: ['标签1', '标签2'],
        page: 1,
        pageSize: 10
      }
    },
    keyMaps: {
      daterange: '[startTime, endTime]'
    },
    deleteInvalid: true,
    toValues(model) {
      const { firstName, lastName, tag, ...rest } = model
      const fullName = firstName + (firstName && lastName ? '-' : '') + lastName
            
      return {
        fullName,
        tag: tag.join(','),
        ...rest
      }
    },
    toModel(data, model) {
      const [firstName, lastName] = data.fullName.split('-')
      model.firstName = firstName
      model.lastName = lastName
      model.tag = data.tag.split(',')
    }
  })


  const updateFormModel = () => {
    formModel.value.daterange = ['2021-01-01', '2022-01-01']
    formModel.value.tag = ['11', '22']
  }

  const getValuesFromServer = () => {
    values.value = {
      fullName: 'li-si',
      select: 2,
      startTime: '2022-08-01',
      endTime: '2022-08-31',
      tag: '888,999'
    }
  }
</script>

<template>
  <el-form :model="formModel" label-position="top" style="padding: 20px;">
    <el-form-item label="firstName">
      <el-input v-model="formModel.firstName"></el-input>
    </el-form-item>

    <el-form-item label="lastName">
      <el-input v-model="formModel.lastName"></el-input>
    </el-form-item>

    <el-form-item label="下拉框">
      <el-select v-model="formModel.select">
        <el-option :value="1" label="选项一"></el-option>
        <el-option :value="2" label="选项二"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="daterange">
      <el-date-picker v-model="formModel.daterange" type="daterange" value-format="YYYY-MM-DD"></el-date-picker>
    </el-form-item>

    <el-form-item label="tags">
      <InputTag v-model="formModel.tag"></InputTag>
    </el-form-item>

    <el-form-item style="justify-content: flex-start;">
      <div style="width:100%">
        <el-button type="primary" @click="reset">重置model</el-button>
        <el-button type="primary" @click="updateFormModel">手动更新model</el-button>
        <el-button type="primary" @click="getValuesFromServer">从服务器获取value</el-button>
      </div>
      <div style="margin-right: 20px;">
        <h2>model:</h2>
        <pre>{{ JSON.stringify(formModel, null, 2) }}</pre>
      </div>
      <div>
      <h2>values:</h2>
        <pre>{{ JSON.stringify(values, null, 2) }}</pre>
      </div>
    </el-form-item>
  </el-form>

</template>

<style scoped>
  pre {
    border: 1px solid #eee;
    border-radius: 5px;
    line-height: 1.5;
    font-family: 'Courier New', Courier, monospace;
    width: 300px;
    height: 300px;
    padding: 10px;
    font-size: 12px;
  }
</style>
