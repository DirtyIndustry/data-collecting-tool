<template>
	<div>
		<div>
			<form>
				<p>Name:
					<input type="text">
				</p>
				<p>Url:
					<input type="text">
				</p>
				<p>Repeat:
					<input type="text">
				</p>
				<p>Active:
					<input type="checkbox">
				</p>
			</form>
		</div>
		<div>
			<button @click="confirmEdit">确认</button>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			confirmEdit() {
				this.$router.push({ path: '/' })
			}
		}
	}
</script>

<style>
</style>