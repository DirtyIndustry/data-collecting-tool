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
import fs from "fs";
import path from "path";

export default {
  data() {
    return {
      spiderToEdit: {
        name: "",
        url: "",
        repeat: "",
        active: true
      },
      addingNew: true,
    };
  },
  computed: {
    folderpath() {
      return path.join(__static, "Entry Files");
    },
    isEqual(){
      if(this.$store.state.SpiderList.spiderToEdit === null){
        return this.spiderToEdit.name === ""
      }else{
        return this.spiderToEdit.name === this.$store.state.SpiderList.spiderToEdit.name
      }
    },
    isContain() {
      return this.$store.state.SpiderList.filelist.includes(this.spiderToEdit.name.toLowerCase())
    },
    notValid() {
        return !(this.isEqual === this.isContain)
    },
  },
  methods: {
    confirmEdit() {
      if (this.name !== "") {
        if (!this.addingNew) {
          //let oldname = this.$store.state.SpiderList.spiderToEdit.name
          fs.unlink(this.folderpath + "/" + this.$store.state.SpiderList.spiderToEdit.name + ".xml", (err) => {
              if (err) {
                return console.log(err);
              }
            }
          );
          this.$store.commit(
            "removeSpider",
            this.$store.state.SpiderList.spiderToEdit.name
          );
        }
        this.$store.commit("addSpider", this.spiderToEdit);
        let filename = this.folderpath + "/" + this.spiderToEdit.name + ".xml";
        let xml2js = require("xml2js");
        let xmlValues = new xml2js.Builder({ rootname: "spider" });
        let xmlString = xmlValues.buildObject(this.spiderToEdit);
        fs.writeFile(filename, xmlString, err => {
          if (err) {
            return console.log(err);
          }
        });
        this.$store.commit('setSpiderToEdit', null)
        this.$router.push({ path: "/" });
      }
    },
    cancelEdit() {
      this.$store.commit('setSpiderToEdit', null)
      this.$router.push({ path: "/" });
    },
  },
  mounted() {
    if (this.$store.state.SpiderList.spiderToEdit !== null) {
      this.spiderToEdit = JSON.parse(
        JSON.stringify(this.$store.state.SpiderList.spiderToEdit)
      );
      this.addingNew = false;
    } else {
      this.addingNew = true;
    }
  }
};
</script>

<style>
</style>