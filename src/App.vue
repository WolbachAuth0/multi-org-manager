<template>
	<v-app id="app">
		<navigation></navigation>
			
		<v-fade-transition mode="out-in" duration type="animation">
			<v-main>
				
				<v-container fluid>
					
					<v-layout align-center justify-center>
						<v-flex md10 sm12>
        			<router-view></router-view>
						</v-flex>
					</v-layout>

				</v-container>

			</v-main>
		</v-fade-transition>
		
		<v-footer app>
			<span></span>
		</v-footer>
	</v-app>
</template>

<script>
import Navigation from '@/components/Navigation'

export default {
	name: 'app',
	components: {
		Navigation
	},
	metaInfo: {
		title: 'Home',
		titleTemplate: 'Aaron Wolbach | %s'
	},
	data() {
		return {}
	},
	mounted() {
		console.log('clientid: ', process.env.VUE_APP_AUTH0_CLIENT_ID)
		console.log('domain: ', process.env.VUE_APP_AUTH0_DOMAIN)
	}
}
</script>
