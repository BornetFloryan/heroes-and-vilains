<template>
  <v-container>
    <v-data-table
        v-if="orgList.length"
        :headers="headers"
        :items="orgList"
        item-key="_id"
        @click:row="goToOrgDetail"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Organizations</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = true">Create Organization</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-alert v-else type="info">Aucune organisation trouvée.</v-alert>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Organization</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
                v-model="name"
                label="Organization Name"
                required
            ></v-text-field>
            <v-text-field
                v-model="secret"
                label="Secret Phrase"
                required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submit">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      dialog: false,
      valid: false,
      name: '',
      targetOrgId: null,
      headers: [
        { text: 'Name', value: 'name' },
      ],
    };
  },
  computed: {
    ...mapState('orgs', ['orgList', 'currentOrg']),
    ...mapState(['secret']),
  },
  methods: {
    ...mapActions('orgs', ['fetchOrgList', 'createOrg']),
    ...mapMutations('orgs', ['setCurrentOrg']),
    async fetchOrganizations() {
      try {
        await this.fetchOrgList();
      } catch {
        alert("Accès refusé : clé incorrecte ou expirée.");
      }
    },
    goToOrgDetail(item) {
      if (!this.secret) {
        this.targetOrgId = item._id;
        alert("Accès refusé : clé manquante.");
        this.$router.push('/auth');
      } else {
        this.$router.push({ name: 'OrgDetail', params: { id: item._id } });
      }
    },
    closeDialog() {
      this.dialog = false;
      this.name = '';
    },
    async submit() {
      if (this.valid) {
        await this.createOrg({ name: this.name, secret: this.secret });
        this.closeDialog();
        this.fetchOrganizations();
      }
    }
  },
  watch: {
    secret(newSecret) {
      if (newSecret && this.targetOrgId) {
        this.$router.push({ name: 'OrgDetail', params: { id: this.targetOrgId } });
        this.targetOrgId = null;
      }
    }
  },
  created() {
    this.setCurrentOrg(null);
    this.fetchOrganizations();
  }
};
</script>