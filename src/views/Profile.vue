/<template>
  <v-card>

    <v-card-title>
      <v-avatar tile v-if="logoIsAvailable">
        <v-img :src="org.branding.logo_url" max-height="40" max-width="40" ></v-img>
      </v-avatar>
      <v-avatar tile v-else>
        <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
      </v-avatar>

      <h2 v-if="orgNameIsAvailable">{{ org.display_name }}</h2>
    </v-card-title>

    <v-tabs v-model="tab">
      <v-tabs-slider color="blue"></v-tabs-slider>
      <v-tab key="profile">Profile</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item key="profile">
        <v-card class="pa-6" color="surface">
          <v-card-title>
            User Profile
          </v-card-title>

          <v-card-text>
            Manage your personal, contact, and security information.
          </v-card-text>

          <v-card class="pa-6">
            <v-list>
              <v-list-item class="px-2">
                <v-list-item-avatar>
                  <img :src="profile.picture" :alt="profile.name">
                </v-list-item-avatar>					
              </v-list-item>
            </v-list>

            <v-row>
              <v-col cols="3">
                <v-text-field v-model="profile.given_name" label="First Name" :disabled="isDisabled"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="profile.family_name" label="Last Name" :disabled="isDisabled"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="profile.email" label="Email" disabled></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field v-model="profile.nickname" label="Nickname" :disabled="isDisabled"></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <v-divider></v-divider>

          <v-card-text v-if="isDisabled">
            NOTE: We cannot update the user profile when the user comes in from the {{ connection }} connection. Please
            update the user profile with that identity provider.
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="saveChanges" :disabled="isDisabled">
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    
  </v-card>
</template>

<script>
export default {
  name: 'Profile',
  metaInfo: {
    title: 'User Profile',
  },
  data () {
    return {
      tab: 0,
      org: {},
      profile: {},
      orgAvailable: false,
    }
  },
  async created () {
    const org = await this.fetchOrg()
    const profile = await this.fetchProfile()
    this.org = org.data
    this.profile = {
      email: profile.data.email,
      given_name: profile.data.given_name,
      family_name: profile.data.family_name,
      nickname: profile.data.nickname,
      name: profile.data.name,
      picture: profile.data.picture
    }
      
    console.log(profile.data)
  },
  computed: {
    logoIsAvailable () {
      return this.org && this.org.branding && this.org.branding.logo_url
    },
    orgNameIsAvailable () {
      return this.org && this.org.display_name
    },
    connection () {
      return this.$auth.user.sub.split('|')[0]
    },
    isDisabled () {
      return !['auth0', 'email', 'sms'].includes(this.connection)
    }
  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      return response.data
    },
    async fetchProfile () {
      const userId = this.$auth.user.sub
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/users/${userId}`)
      return response.data
    },
    async saveChanges () {
      const accesstoken = await this.$auth.getTokenSilently()
      const body = {
        given_name: this.profile.given_name,
        family_name: this.profile.family_name,
        nickname: this.profile.nickname,
        name: this.profile.name,
        picture: this.profile.picture
      }
      const response = await this.$http(accesstoken).patch(`/users/${this.$auth.user.sub}`, body)
      const announcement = {
        text: response.data.message,
        type: response.data.success ? 'success' : 'error',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)
      console.log(response.data)
      return response.data
    }
  }
}
</script>
