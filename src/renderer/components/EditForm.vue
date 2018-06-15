<template>
	<div>
    <el-form :model="spiderToEdit" 
             :rules="spiderValidRule"
             ref="editformRef"
             status-icon 
             label-position="left"
             label-width="100px">
      <el-form-item label="Name" prop="name">
        <el-input v-model="spiderToEdit.name"></el-input>
      </el-form-item>
      <el-form-item label="Domain" prop="domain">
        <el-input v-model="spiderToEdit.domain"></el-input>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-input type="text" v-model="spiderToEdit.url"></el-input>
      </el-form-item>
      <el-form-item label="Targets" prop="targets">
        <el-input type="text" v-model.number="spiderToEdit.targets"></el-input>
      </el-form-item>
      <el-form-item label="Params" prop="params">
        <EditableTable :tableData="spiderToEdit.params"></EditableTable>
      </el-form-item>
      <el-form-item label="Repeat" prop="repeat">
        <el-select placeholder="请选择" v-model="spiderToEdit.repeat">
          <el-option v-for="item in repeatOptions" :key="item.value" :label="item.value" :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Start Time" prop="starttime">
        <el-date-picker type="datetime" v-model="spiderToEdit.starttime" placeholder="选择日期时间" value-format="yyyy-MM-ddTHH:mm"></el-date-picker>
      </el-form-item>
      <el-form-item label="Active" prop="active">
        <el-switch v-model="spiderToEdit.active" active-text="On" inactive-text="Off"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('editformRef')" type="primary">确认</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script>
import path from 'path'
import EditableTable from './EditForm/EditableTable.vue'

export default {
  components:{
    EditableTable,
  },
  data () {
    var validateName = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('名称不能为空'))
      }
      setTimeout(()=>{
        if (value.startsWith(' ') | value.endsWith(' ')){
          return callback(new Error('名称不能以空格开始或结束'))
        }
        let reg = new RegExp(/'|#|&|\\|\/|:|\?|"|<|>|\*|\|/g)
        if (reg.test(value) === true) {
          return callback(new Error('名称不能包含\'#&\\\/:?"<>*|'))
        } else {
          return callback()
        }
      }, 500)
    }
    var validateName2 = (rule,value,callback)=>{
      if(this.isContain !== this.isEqual){
        return callback(new Error('该名称已经被占用'))
      }else{
        return callback()
      }
    }
    var validateTargets = (rule, value, callback) => {
      if(!value){
        return callback(new Error('目标不能为空'))
      }
      if(!Number.isInteger(value)){
        return callback(new Error('请输入数字'))
      }else{
        return callback()
      }
    }
    var validateStartTime = (rule,value,callback)=>{
      if(!value){
        return callback(new Error('开始时间不能为空'))
      }
      let date = new Date(value)
      if(date.getSeconds() > 0 | date.getMilliseconds()>0){
        date.setSeconds(0)
        date.setMilliseconds(0)
        return callback()
      }else{
        return callback()
      }
    }
    return {
      spiderToEdit: {
        name: '',
        domain:'',
        url: '',
        targets:'',
        params:[
          {
            paramName:'imaname',
            paramValue:'imavalue',
            paramProp:'prop1',
          },
          {
            paramName:'imanothername',
            paramValue:'imanothervalue',
            paramProp:'imanotherproperty',
          },
        ],
        repeat: 'Daily',
        starttime: '',
        active: true,
      },
      spiderValidRule:{
        name:
        [
          {validator:validateName, trigger:'blur'},
          {validator:validateName2, trigger:'blur'},
        ],
        targets:[{validator:validateTargets, trigger:'blur'}],
        starttime:[{validator:validateStartTime, trigger:'blur'}]
      },
      addingNew: true,
      repeatOptions: [
        {value:'Yearly'},
        {value:'Monthly'},
        {value:'Weekly'},
        {value:'Daily'},
        {value:'Hourly'},
        {value:'Never'},
      ],
      formLabelWidth: '100px',
    }
  },
  computed: {
    folderpath () {
      return path.join(__static, 'Entry Files')
    },
    isEqual () {
      if (this.$store.state.SpiderList.spiderToEdit === null) {
        return this.spiderToEdit.name === ''
      } else {
        return this.spiderToEdit.name === this.$store.state.SpiderList.spiderToEdit.name
      }
    },
    isContain () {
      return this.$store.state.SpiderList.filelist.includes(this.spiderToEdit.name.toLowerCase())
    },
    notValid () {
      if(this.checkName()===true){
        return !(this.isEqual === this.isContain)
      }else return true
    },
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          let xmlWriter = require('../utils/xmlWriter')
          if (!this.addingNew) {
            xmlWriter.deleteXml(this.$store.state.SpiderList.spiderToEdit.name)
            this.$store.dispatch('removeSpider', this.$store.state.SpiderList.spiderToEdit)
          }
          this.$store.dispatch('addSpider', this.spiderToEdit)
          xmlWriter.writeXml(this.spiderToEdit)
          this.$router.push({ path: '/' })
        } else {
          return false
        }
      })
    },
    cancelEdit () {
      this.$router.push({ path: '/' })
    },
    checkName () {
      if (this.spiderToEdit.name.startsWith(' ') | this.spiderToEdit.name.endsWith(' ')){
        return false
      }
      let reg = new RegExp(/'|#|&|\\|\/|:|\?|"|<|>|\*|\|/g)
      if (reg.test(this.spiderToEdit.name) === true) {
        return false
      } else {
        return true
      }
    },
  },
  created () {
    if (this.$store.state.SpiderList.spiderToEdit !== null) {
      this.spiderToEdit = JSON.parse(
        JSON.stringify(this.$store.state.SpiderList.spiderToEdit)
      )
      this.addingNew = false
    } else {
      this.addingNew = true
    }
  },
  beforeDestroy(){
    this.$store.commit('setSpiderToEdit', null)
  },
}
</script>

<style>
</style>