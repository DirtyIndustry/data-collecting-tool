<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/common/Header.vue"
import Footer from "./components/common/Footer.vue"
import fs from "fs"
import path from 'path'

export default {
  name: "data-collecting-tool",
  data(){
    return {
      directorySelected:'',
      isLoading:false,
      tableData:[]
    }
  },
  components: {
    Header,
    Footer
  },
  methods:{
    showFileDialog(){
      const dialog = require('electron').remote.dialog
      dialog.showOpenDialog({properties: ['openDirectory']},(filename)=>{
        if(filename.length===1){
          this.directorySelected = filename[0]
          this.listingFile(this.directorySelected)
        }
      })
    },
    listingFile(filepath){
      this.isLoading=true
      const fs = require('fs')
      const path = require('path')
      fs.readdir(filepath,(err,file)=>{
        if(err){
          this.isLoading = false
          return alert(err)
        }
        this.tableData = []
        for(let filename of file){
          const stat = fs.statSync(path.join(filepath,filename))
          if(stat.isFile()){
            if(path.extname(filename).toLowerCase() === '.pdf'){
              this.tableData.push({
                filename: filename,
                filesize: stat.size
              })
            }
          }
        }
        this.isLoading = false
      })
    }
  },
  mounted() {
    let spider = {
      name: "New Spider into Vue",
      url: "www.taobao.com",
      repeat: "Yearly",
      active: true
    }
    this.$store.commit("addSpider", spider)

    this.showFileDialog()
  },
}
</script>

<style>
/* CSS */
</style>
