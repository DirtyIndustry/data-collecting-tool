<template>
	<div>
		<div>
			<form>
				<p>Name:
					<input type="text" v-model="name">
				</p>
				<p>Url:
					<input type="text" v-model="url">
				</p>
				<p>Repeat:
					<input type="text" v-model="repeat">
				</p>
				<p>Active:
					<input type="checkbox" v-model="active">
				</p>
			</form>
		</div>
		<div>
			<button @click="confirmEdit">确认</button>
      <button @click="cancelEdit">取消</button>
		</div>
	</div>
</template>

<script>
import fs from "fs";
import path from "path";

export default {
  data() {
    return {
      name: "",
      url: "",
      repeat: "",
      active: true
    };
  },
  computed: {
    folderpath() {
      return path.join(__static,'Entry Files')
    }
  },
  methods: {
    confirmEdit() {
      if (this.name !== "") {
        let spider = {
          name: this.name,
          url: this.url,
          repeat: this.repeat,
          active: this.active
        };
        this.$store.commit("addSpider", spider);
        let filename = this.folderpath +'/'+ spider.name + '.xml'
        
        let convert = require('xml-js')
        let options = {compact: true, ignoreComment: false, spaces: 2}
        
        var xmlString = convert.json2xml(spider, options)

        fs.writeFile(filename,xmlString,(err)=>{
          if(err){
            return console.log(err)
          }
          console.log(spider)
          console.log(xmlString)
        })
        this.$router.push({ path: "/" });
      }
    },
    cancelEdit() {
      this.$router.push({ path: "/" });
    }
  },
};
</script>

<style>
</style>