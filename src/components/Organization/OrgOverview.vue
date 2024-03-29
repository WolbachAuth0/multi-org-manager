<template>
  <v-card class="pa-6" color="surface">
    <v-card-title>Basic Info</v-card-title>
    <v-card-text>
      These are basic details needed to set up your organization.
    </v-card-text>
    
    <v-card class="pa-6">
      <v-row>
        <v-col cols="5">
          <v-text-field v-model="org.name" 
                        :label="labels.name"
                        :hint="hints.name"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.name }}</v-card-text>
        </v-col>

        <v-col cols="5">
          <v-text-field v-model="org.display_name"
                        :label="labels.display_name"
                        :hint="hints.display_name"
          ></v-text-field>
          <v-card-text class="grey--text">{{ hints.display_name }}</v-card-text>
        </v-col>

        <v-col cols="2">
          <v-checkbox
            v-model="org.enableMFA"
            :label="labels.enableMFA"
            :hint="hints.enableMFA"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card>

    <v-divider></v-divider>
    
    <v-card-title>Branding</v-card-title>
    <v-card-text>
      These are branding settings associated with your organization.
    </v-card-text>

    <v-card class="pa-6">
      <v-row>
        <v-col cols="6">
          
          <v-row>
            <v-col cols="12">
              <!-- LOGO URL -->
              <v-text-field v-model="org.branding.logo_url" 
                            :label="labels.logo_url" 
                            :hint="hints.logo_url"
                            prepend-icon="mdi-link-variant"
              ></v-text-field>
              <!-- BACKGROUND IMAGE URL -->
              <v-text-field v-model="org.branding.backgroundImage" 
                            :label="labels.backgroundImage" 
                            :hint="hints.backgroundImage"
                            prepend-icon="mdi-link-variant"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- COLORS -->
          <v-row>
            <v-col cols="6">
              <!-- PRIMARY COLOR -->
              <label>{{ labels.primary }}</label>
              <!-- <v-card-text class="grey--text">{{ hints.primary }}</v-card-text> -->
              <v-color-picker v-model="org.branding.colors.primary"
                              mode="hexa"
                              elevation="8"
              ></v-color-picker>
            </v-col>
            
            <v-col cols="6">
              <!-- BACKGROUND COLOR -->
              <label>{{ labels.background }}</label>
              <!-- <v-card-text class="grey--text">{{ hints.background }}</v-card-text> -->
              <v-color-picker v-model="org.branding.colors.page_background"
                              mode="hexa"
                              elevation="8"
              ></v-color-picker>
              
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="6">
          <org-sample-ui :logoURL="org.branding.logo_url"
                        :primary="org.branding.colors.primary"
                        :background="org.branding.colors.page_background" 
          >
          </org-sample-ui>
        </v-col>
      </v-row>
    </v-card>
    <v-divider></v-divider>

    <v-card-title>Metadata</v-card-title>
    <v-card-text>
      Metadata related to this organization.
    </v-card-text>

    <v-card class="pa-6">
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

        <!-- NOTE: The edit value template should be removed. -->

        <!-- <template v-slot:[`item.value`]="props">
          <v-edit-dialog
            :return-value.sync="props.item.value"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.value }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.value"
                label="Edit"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template> -->

      </v-data-table>
    </v-card>

    <v-divider></v-divider>

    <v-card-actions> 
      <v-btn color="primary" @click="saveChanges">
        Save Changes
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import EventBus from '../../helpers/eventBus.js'
import OrgSampleUi from './OrgSampleUI.vue'

export default {
  name: 'Organization',
  components: {
    OrgSampleUi
  },
  data () {
    return {
      labels: {
        name: 'Name',
        display_name: 'Display Name',
        enableMFA: 'Enforce Multifactor Authentication',
        logo_url: 'Logo URL',
        backgroundImage: 'Background Image',
        primary: 'Primary Color',
        background: 'Page Background Color'
      },
      hints: {
        name: 'This is any human-readable identifier for the organization that will be used by end-users to direct them to their organization in your application.',
        display_name: 'If set, this is the name that will be displayed to end-users for this organization in any interaction with them.',
        enableMFA: 'If checked, then users of this organization will be required to provide Multi-Factor Authentication.',
        logo_url: 'If set, this is the logo that will be displayed to end-users for this organization in any interaction with them.',
        backgroundImage: 'This is the url to the background image which will be displaid in the login screen.',
        primary: 'If set, this will be the primary color for CTAs that will be displayed to end-users for this organization in your application\'s authentication flows.',
        background: 'If set, this will be the page background color that will be displayed to end-users for this organization in in your application\'s authentication flows.'
      },
      org: {
        id: 'org_DnITNWXfRvtMKNu6',
        name: 'circle-org',
        display_name: 'Organization of Circular Things',
        enableMFA: false,
        branding: {
          logo_url: 'https://cdn.worldvectorlogo.com/logos/puppet.svg',
          colors: {
            primary: '#7C64A5',
            page_background: '#322D6B'
          },
          backgroundImage: 'https://raw.githubusercontent.com/oktadev/.github/main/images/okta-dev-header.png',
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
    metadataLimit () {
      const count = Object.keys(this.metadata.items).length
      return 8 - count
    },
    metadataObject () {
      const metadata = {
        background: this.org.branding.backgroundImage,
        enable_mfa: this.org.enableMFA ? 'true' : 'false' // the metadata has to be a string
      }
      for (let item of this.metadata.items) {
        metadata[item.key] = item.value
      }
      return metadata
    },
    orgID () {
      return this.$auth.user.org_id
    },
  },
  async mounted () {
    const response = await this.fetchOrg()
    if (process.env.VUE_APP_MODE === 'development') {
      console.log('mounted: Organization', response.data)
    }

    const org = response.data
    this.org.id = org.id
    this.org.name = org.name
    this.org.display_name = org.display_name
    this.org.enableMFA = String(org.metadata['enable_mfa']).toLowerCase() == 'true' ? true : false 
    this.org.branding = {
      logo_url: org.branding.logo_url,
      colors: {
        primary: org.branding.colors.primary,
        page_background: org.branding.colors.page_background
      },
      backgroundImage: org.metadata['background'] || 'https://raw.githubusercontent.com/oktadev/.github/main/images/okta-dev-header.png'
    }

    this.metadata.items = Object.keys(org.metadata)
      .map(key => {
        return {
          key,
          value: org.metadata[key],
          index: key
        }
      })
      .filter(item => !['background', 'enable_mfa'].includes(item.key))

  },
  methods: {
    async fetchOrg () {
      const orgID = this.$auth.user.org_id
      const accesstoken = await this.$auth.getTokenSilently()
      const response = await this.$http(accesstoken).get(`/organizations/${orgID}`)
      return response.data
    },
    async saveChanges () {
      const accesstoken = await this.$auth.getTokenSilently()
      const body = {
        name: this.org.name,
        display_name: this.org.display_name,
        branding: {
          logo_url: this.org.branding.logo_url,
          colors: {
            primary: this.org.branding.colors.primary,
            page_background: this.org.branding.colors.page_background
          }
        },
        metadata: this.metadataObject
      }
      const response = await this.$http(accesstoken).patch(`/organizations/${this.orgID}`, body)
      const announcement = {
        text: response.data.message,
        type: response.data.success ? 'success' : 'error',
        top: true,
        right: true,
        left: false
      }
      EventBus.$emit('announce', announcement)

      return response.data
    },
    editMetadata () {

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
    }
  }
}
</script>

<style scoped>

</style>