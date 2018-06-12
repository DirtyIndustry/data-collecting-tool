<template>
	<div>
		<div>
			<form>
				<p>Name:
					<input type="text" v-model="spiderToEdit.name">
				</p>
				<p>Url:
					<input type="text" v-model="spiderToEdit.url">
				</p>
				<p>Repeat:
					<input type="text" v-model="spiderToEdit.repeat">
				</p>
        <p>StartTime:<input type="datetime-local" v-model="spiderToEdit.starttime"></p>
				<p>Active:
					<input type="checkbox" v-model="spiderToEdit.active">
				</p>
			</form>
		</div>
		<div>
			<button @click="confirmEdit" v-bind:disabled = "notValid">确认</button>
      <button @click="cancelEdit">取消</button>
		</div>
	</div>
</template>

<script>
import path from 'path'

export default {
  data () {
    return {
      spiderToEdit: {
        name: "",
        url: "",
        repeat: "",
        starttime: "",
        active: true,
      },
      addingNew: true,
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
  }
}
</script>

<style>
</style>