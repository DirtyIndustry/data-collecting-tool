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
export default {
  data() {
    return {
      name: "",
      url: "",
      repeat: "",
      active: true
    };
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
        this.$router.push({ path: "/" });
      }
    },
    cancelEdit(){
      this.$router.push({ path: "/" });
    },
  }
};
</script>

<style>
</style>