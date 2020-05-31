<template>

	<router-view name='AdminComponent'/>

</template>

<script>

	export default {

		name: 'AdminIndex',
		beforeCreated() {

			if (this.$parent.$parent.user['userCategories.name'] != 'ADMIN') {

				this.$router.go(-1);

			}

		}

	}

</script>

<style scoped>

</style>
