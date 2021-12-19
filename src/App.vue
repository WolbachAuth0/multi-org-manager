<template>
	<v-app id="app">
		<navigation></navigation>
		
		<announcer :visible="alert.visible"
							 :text="alert.text"
							 :type="alert.type"
							 @show="show"
							 @hide="hide"
		></announcer>

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
import Announcer from './components/Announcer.vue'
import Navigation from './components/Navigation.vue'
import YoutubeBackground from './components/YoutubeBackground.vue'
import EventBus from './helpers/eventBus.js'

export default {
	name: 'app',
	components: {
		Announcer,
		Navigation,
		YoutubeBackground
	},
	// TODO: need to install the vue-meta package to get this to work.
	metaInfo: {
		title: 'Home',
		titleTemplate: 'Aaron Wolbach | %s'
	},
	data() {
		return {
			alert: {
        visible: false,
        text: '',
        type: 'success',
      }
		}
	},
	mounted() {
		if (process.env.VUE_APP_MODE === 'development') {
			console.log('node_env: ', process.env.NODE_ENV)
			console.log('clientid: ', process.env.VUE_APP_AUTH0_CLIENT_ID)
			console.log('auth0 domain: ', process.env.VUE_APP_AUTH0_DOMAIN)
			console.log('vue app api host: ', process.env.VUE_APP_API_HOST)
			console.log('vue app domain: ', process.env.VUE_APP_DOMAIN)
		}
		EventBus.$on('announce', this.makeAnnouncement)
	},
	methods: {
		makeAnnouncement ({ text='announcement text', type='success' }) {
			this.alert.text = text
			this.alert.type = type
			this.alert.visible = true 
		},
		show (payload) {
			if (process.env.VUE_APP_MODE === 'development') {
				console.log('show announcer event: payload = ', payload)
			}
			this.alert.visible = true
		},
		hide (payload) {
			if (process.env.VUE_APP_MODE === 'development') {
				console.log('hide announcer event: payload = ', payload)
			}
			this.alert.visible = false
		}
	}
}
</script>
