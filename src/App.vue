<template>
	<v-app id="app">
		<navigation></navigation>
		
		<announcer :visible="alert.visible"
							 :text="alert.text"
							 :type="alert.type"
							 :top="alert.top"
							 :right="alert.right"
							 :left="alert.left"
							 @show="show"
							 @hide="hide"
		></announcer>

		<github-ribbon :url="github"/>
		
		<v-fade-transition mode="out-in" duration type="animation">
			<v-main class="gradient" light>	
				<v-container fluid>
					<v-layout align-center justify-center>
						<v-flex>
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
import EventBus from './helpers/eventBus.js'
import GithubRibbon from './components/GithubRibbon.vue'

export default {
	name: 'app',
	components: {
		Announcer,
		Navigation,
		GithubRibbon
	},
	metaInfo: {
		titleTemplate: 'Organization Manager | %s'
	},
	data() {
		return {
			github: 'https://github.com/WolbachAuth0/multi-org-manager',
			alert: {
        visible: false,
        text: '',
        type: 'success',
				top: true,
				right: true,
				left: false
      }
		}
	},
	async mounted() {
		if (process.env.VUE_APP_MODE === 'development') {
			console.log('node_env: ', process.env.NODE_ENV)
			console.log('clientid: ', process.env.VUE_APP_AUTH0_CLIENT_ID)
			console.log('auth0 domain: ', process.env.VUE_APP_AUTH0_DOMAIN)
			console.log('vue app api host: ', process.env.VUE_APP_API_HOST)
			console.log('vue app domain: ', process.env.VUE_APP_DOMAIN)
			console.log('vue app audience: ', process.env.VUE_APP_AUTH0_AUDIENCE)
		}
		EventBus.$on('announce', this.makeAnnouncement)
  },
	methods: {
		makeAnnouncement ({ text='announcement text', type='success', top=true, right=true, left=false }) {
			this.alert.text = text
			this.alert.type = type
			this.alert.top = top
			this.alert.right = right
			this.alert.left = left

			this.alert.visible = true

			if (process.env.VUE_APP_MODE === 'development') {
				console.log('announcer event: payload = ', this.alert)
			}
		},
		show (payload) {
			this.alert.visible = true
		},
		hide (payload) {
			this.alert.visible = false
		}
	}
}
</script>

<style scoped>
	main.gradient {
		background-image: linear-gradient(#4c73b8, #CFD8DC);
	}
</style>