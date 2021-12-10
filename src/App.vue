<template>
	<v-app id="app">
		<navigation></navigation>
		
		<youtube-background></youtube-background>
		
		<v-fade-transition mode="out-in" duration type="animation">
			<v-main>		
				<v-container fluid>
					<v-layout align-center justify-center>
						<v-flex md10 sm12>
        			<router-view :key="$route.fullPath"></router-view>
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
import YoutubeBackground from '@/components/YoutubeBackground'

export default {
	name: 'app',
	components: {
		Navigation,
		YoutubeBackground
	},
	metaInfo: {
		title: 'Home',
		titleTemplate: 'Aaron Wolbach | %s'
	},
	data() {
		return {}
	},
	mounted() {
		if (process.env.VUE_APP_MODE === 'development') {
			console.log('node_env: ', process.env.NODE_ENV)
			console.log('clientid: ', process.env.VUE_APP_AUTH0_CLIENT_ID)
			console.log('auth0 domain: ', process.env.VUE_APP_AUTH0_DOMAIN)
			console.log('vue app api host: ', process.env.VUE_APP_API_HOST)
			console.log('vue app domain: ', process.env.VUE_APP_DOMAIN)
		}
	}
}
</script>
