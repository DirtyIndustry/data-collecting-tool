<template>
	<div>
		<div>
			<form>
				<p>Name:<el-input type="text" v-model="spiderToEdit.name"></el-input>
				</p>
        <p>Domain:<el-input type="text" v-model="spiderToEdit.domain"></el-input>
        </p>
				<p>Url:<el-input type="text" v-model="spiderToEdit.url"></el-input>
				</p>
        <p>Targets:<el-input type="text" v-model="spiderToEdit.targets"></el-input>
        </p>
				<p>Repeat:<el-select placeholder="请选择" v-model="spiderToEdit.repeat">
          <el-option v-for="item in repeatOptions" :key="item.value" :label="item.value" :value="item.value" :disabled="item.disabled">
          </el-option>
        </el-select>
				</p>
        <p>StartTime:<el-date-picker type="datetime" v-model="spiderToEdit.starttime" placeholder="选择日期时间" value-format="yyyy-MM-ddTHH:mm"></el-date-picker>
        </p>
				<p>Active:<el-switch v-model="spiderToEdit.active" active-text="On" inactive-text="Off"></el-switch>
				</p>
			</form>
		</div>
		<div>
			<el-button @click="confirmEdit" v-bind:disabled = "notValid">确认</el-button>
      <el-button @click="cancelEdit">取消</el-button>
		</div>
	</div>
</template>

<script>
import path from 'path'

export default {
  data () {
    return {
      spiderToEdit: {
        name: '',
        domain:'',
        url: '',
        targets:'',
        repeat: 'Daily',
        starttime: new Date(),
        active: true,
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
    confirmEdit () {
      if (this.name !== '') {
        let xmlWriter = require('../utils/xmlWriter')
        if (!this.addingNew) {
          xmlWriter.deleteXml(this.$store.state.SpiderList.spiderToEdit.name)
          this.$store.dispatch('removeSpider', this.$store.state.SpiderList.spiderToEdit)
        }

        this.$store.dispatch('addSpider', this.spiderToEdit)
        //this.$store.dispatch('buildTimeTable')
        xmlWriter.writeXml(this.spiderToEdit)

        this.$router.push({ path: '/' })
      }
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