<template>
  <div>
    <v-card class="pa-6">
      <v-row>
        <v-col cols="6">
          <v-card-title>Basic Info</v-card-title>
          <v-card-text>
            These are basic details needed to set up your organization.
          </v-card-text>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="org.name" 
                        :label="labels.name"
                        :hint="hints.name"
                        :disabled="readOnly"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.name }}</v-card-text>

          <v-text-field v-model="org.display_name"
                        :label="labels.display_name"
                        :hint="hints.display_name"
                        :disabled="readOnly"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.display_name }}</v-card-text>
        </v-col>
      </v-row>
      
      <v-divider></v-divider>
      
      <v-row>
        <v-col cols="6">
          <v-card-title>Branding</v-card-title>
          <v-card-text>
            These are branding settings associated with your organization.
          </v-card-text>
          
          <v-text-field v-model="org.branding.logo_url" 
                        :label="labels.logo_url" 
                        :hint="hints.logo_url"
                        prepend-icon="mdi-link-variant"
                        :disabled="readOnly"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.logo_url }}</v-card-text>

          <v-text-field v-model="org.branding.colors.primary" 
                        :label="labels.primary" 
                        :hint="hints.primary"
                        prepend-icon="mdi-palette" 
                        :disabled="readOnly"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.primary }}</v-card-text>

          <v-text-field v-model="org.branding.colors.page_background" 
                        :label="labels.background" 
                        :hint="hints.background"
                        prepend-icon="mdi-palette"
                        :disabled="readOnly"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.background }}</v-card-text>

        </v-col>

        <v-col cols="6">
          <v-card :color="org.branding.colors.page_background" class="pa-6 ma-3">

            <v-card outlined raised class="pa-6 mx-6">
              <div class="d-flex justify-center my-2">
                <v-avatar tile v-if="logoIsAvailable">
                  <v-img :src="org.branding.logo_url" max-height="40" max-width="40" ></v-img>
                </v-avatar>
                <v-avatar tile v-else>
                  <v-progress-circular :size="40" color="primary" indeterminate></v-progress-circular>
                </v-avatar>
              </div>

              <v-card-text class="text-center blue-grey lighten-4 my-2">
              </v-card-text>

              <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
              </v-card-subtitle>

              <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
              </v-card-subtitle>

              <v-card-subtitle class="justify-center blue-grey lighten-4 my-2">
              </v-card-subtitle>

              <v-card-text class="text-center blue-grey lighten-4 my-2">
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn :color="org.branding.colors.primary">
                  <span class="purple lighten-5"></span>
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-card-text :class="fontClass">
              Mock UI Preview<br/>
              For organization branding representation only,<br/>
              any other customization will not visible.
            </v-card-text>
          </v-card>
          
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card-title>Metadata</v-card-title>
      <v-card-text>
        Metadata related to this organization.
      </v-card-text>

      <v-row>
        <v-col cols="5">
          <v-text-field v-model="metadata.key"
                        label="key ..." 
                        :disabled="false"
                        prepend-icon="mdi-key-outline"
          ></v-text-field>
        </v-col>

        <v-col cols="5">
          <v-text-field v-model="metadata.value"
                        label="value ..."
                        :disabled="false"
                        prepend-icon="mdi-tag-outline"
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-btn @click="addMetadata">
            <v-icon left>mdi-plus</v-icon>
            Add
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table :headers="metadata.headers"
                    :items="metadata.items"
                    hide-default-footer
      >
        <template v-slot:[`item.index`]="{ item }">
          <v-btn icon color="red" @click="removeMetadata(item.key)">
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
        </template>
      </v-data-table>

      <v-divider></v-divider>

      <v-row>
        <v-col cols="12">
          <v-card-actions> 
            <v-btn color="primary" @click="updateOrg">
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>

    </v-card>
  </div>
</template>

<script>
import EventBus from '../helpers/eventBus.js'

export default {
  name: 'Organization',
  data () {
    return {
      labels: {
        name: 'Name',
        display_name: 'Display Name',
        logo_url: 'Logo URL',
        primary: 'Primary Color',
        background: 'Page Background Color'
      },
      hints: {
        name: 'This is any human-readable identifier for the organization that will be used by end-users to direct them to their organization in your application.',
        display_name: 'If set, this is the name that will be displayed to end-users for this organization in any interaction with them.',
        logo_url: 'If set, this is the logo that will be displayed to end-users for this organization in any interaction with them.',
        primary: 'If set, this will be the primary color for CTAs that will be displayed to end-users for this organization in your application\'s authentication flows.',
        background: 'If set, this will be the page background color that will be displayed to end-users for this organization in in your application\'s authentication flows.'
      },
      org: {
        id: 'org_DnITNWXfRvtMKNu6',
        name: 'circle-org',
        display_name: 'Organization of Circular Things',
        branding: {
          logo_url: 'https://cdn.worldvectorlogo.com/logos/puppet.svg',
          colors: {
            primary: '#7C64A5',
            page_background: '#322D6B'
          }
        }
      },
      metadata: {
        key: null,
        value: null,
        items: [],
        headers: [
          { text: 'Key', value: 'key', filterable: false, sortable: false },
          { text: 'Value', value: 'value', filterable: false, sortable: false },
          { text: '', value: 'index' },
        ]
      }
    }    
  },
  computed: {
    logoIsAvailable () {
      return this.org && this.org.branding && this.org.branding.logo_url
    },
    readOnly () {
      // TODO: see if the access token has the update:organization permission.
      return true
    },
    fontClass () {
      const hex = this.org.branding.colors.page_background
      const l = this.computeLightness(hex)
      const classname = l <= 50 ? 'text-center white--text' : 'text-center black--text'
      console.log(`hex: ${hex}, L: ${l}%, class="${classname}"`)
      return classname
    },
    metadataLimit () {
      const count = Object.keys(this.metadata.items).length
      return 10 - count
    },
    metadataObject () {
      const metadata = {}
      for (let item of this.metadata.items) {
        metadata[item.key] = item.value
      }
      return metadata
    }
  },
  async mounted () {
    const response = await this.fetchOrg()
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Organization', response)
    }

    const org = response.data
    this.org.id = org.id
    this.org.name = org.name
    this.org.display_name = org.display_name
    this.org.branding = {
      logo_url: org.branding.logo_url,
      colors: {
        primary: org.branding.colors.primary,
        page_background: org.branding.colors.page_background
      }
    }

    this.metadata.items = Object.keys(org.metadata)
      .map(key => {
        return {
          key,
          value: org.metadata[key],
          index: key
        }
      })
  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      return response.data
    },
    async updateOrg () {
      const orgId = this.$auth.user.org_id
      // const accesstoken = await this.$auth.getTokenSilently()
      // const response = await this.$http(accesstoken).put(`/organizations/${orgID}`, this.org)
      // return response.data
      const announcement = {
        text: 'TODO: Should update Organization.',
        type: 'success'
      }
      EventBus.$emit('announce', announcement)

      console.log(this.org)
    },
    addMetadata () {
      // is this key already in the metadata?
      const key = this.metadata.key
      const value = this.metadata.value
      const index = this.metadata.items.findIndex(x => x.key == key)
      if (index > -1) {
        // then update it ...
        this.metadata.items[index].value = this.metadata.value
        this.metadata.items[index].index = key
      } else {
        // add a new one ...
        const item = { key, value, index: key }
        this.metadata.items.push(item)
      }
      this.metadata.key = null
      this.metadata.value = null
    },
    removeMetadata (key) {
      const index = this.metadata.items.findIndex(x => x.key == key)
      if (index > -1) {
        this.metadata.items.splice(index, 1);
      }
    },
    computeLightness (hex) {
      // parse the RGB value from the hex color
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      let r = parseInt(result[1], 16)/255
      let g = parseInt(result[2], 16)/255
      let b = parseInt(result[3], 16)/255

      // next compute the HSL "lightness" value 
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const l = Math.round((max + min) * 50)
      return l
    }
  }
}
</script>

<style scoped>

</style>