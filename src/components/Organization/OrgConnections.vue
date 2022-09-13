<template>
  <v-card class="pa-6" color="surface">
    <v-card-title> Enabled Connections </v-card-title>
    <v-card-text>
      Enable connections to allow organization members to access your
      applications. These connections will be displayed on the
      {{ org.display_name }} organization’s log-in prompt.
      <a
        href="https://auth0.com/docs/organizations/configure/enable-connections"
        target="__blank"
        >Learn More</a
      >
    </v-card-text>

    <v-card class="pa-6">
      <v-data-table :headers="table.headers" :items="connections">
        <template v-slot:[`item.connection.name`]="{ item }">
          <v-avatar>
            <v-icon left>{{ icon(item.connection.strategy) }}</v-icon>
          </v-avatar>
          ({{ item.connection.strategy }}) {{ item.connection.name }}
        </template>

        <template v-slot:[`item.connection_id`]="{ item }">
          Connection ID: {{ item.connection_id }}
        </template>

        <template v-slot:[`item.assign_membership_on_login`]="{ item }">
          <v-chip color="green" outlined>{{
            item.assign_membership_on_login ? "Enabled" : "Disabled"
          }}</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-card-actions>
      <v-btn color="primary" @click="dialog = true">
        Enable New Connection
      </v-btn>
    </v-card-actions>

    <connection
      v-model="dialog"
      @close-dialog="dialog = false"
      @submit-connection="submitConnection"
    />
  </v-card>
</template>

<script>
import Connection from "./Connection.vue";
import EventBus from "./../../helpers/eventBus";
export default {
  name: "OrgConnections",
  components: {
    Connection,
  },
  data() {
    return {
      dialog: false,
      connections: [],
      table: {
        headers: [
          {
            text: "Connection",
            align: "start",
            value: "connection.name",
            filterable: false,
            sortable: false,
          },
          // { text: 'Type', value: 'connection.strategy', filterable: true, sortable: true },
          {
            text: "Identifier",
            value: "connection_id",
            filterable: true,
            sortable: true,
          },
          {
            text: "Membership on Authentication",
            value: "assign_membership_on_login",
            filterable: true,
            sortable: true,
          },
        ],
      },
    };
  },
  props: {
    org: { type: Object },
  },
  async mounted() {
    const response = await this.fetchOrgConnections();
    this.connections = response.data;
    const announcement = {
      text: response.message,
      type: response.success ? "success" : "error",
      top: true,
      right: true,
      left: false,
    };
    EventBus.$emit("announce", announcement);

    if (process.env.VUE_APP_MODE === "development") {
      console.log(`mounted: OrgConnections`, response.data);
    }
  },
  methods: {
    async submitConnection(newConnection) {
      const orgID = this.$auth.user.org_id;
      const accesstoken = await this.$auth.getTokenSilently()

      try {
        const response = await this.$http(accesstoken).post(
          `/organizations/${orgID}/connections`,
          newConnection
        )
        const announcement = {
          text: response.data.message,
          type: response.data.success ? "success" : "error",
          top: true,
          right: true,
          left: false,
        }
        EventBus.$emit("announce", announcement)

        const response2 = await this.fetchOrgConnections()
        this.connections = response2.data
      } catch (error) {
        console.log("Error", error)
      } finally {
        this.dialog = false
      }
    },
    async fetchOrgConnections() {
      const orgID = this.$auth.user.org_id;
      const accesstoken = await this.$auth.getTokenSilently();
      const response = await this.$http(accesstoken).get(
        `/organizations/${orgID}/connections`
      );
      return response.data;
    },
    icon(strategy) {
      let iconstring = "";
      switch (strategy) {
        case "auth0":
          // database icon
          iconstring = "mdi-database-outline";
          break;
        case "waad":
          // microsoft icon
          iconstring = "mdi-microsoft";
          break;
        default:
          iconstring = "mdi-file-outline";
          break;
      }
      return iconstring;
      // others
    },
  },
};
</script>