<template>

	<router-view name='AppsComponent'/>

</template>

<script>

	export default {

		name: 'Apps_Index',
		beforeCreated() {

			if (!this.$parent.$parent.apps && this.$parent.$parent.$parent.user['userCategories.name'] != 'ADMIN') {

				this.$router.go(-1);

			}

		},

	}

</script>

<style scoped>

</style>
