<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Organisations</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="dialog = true">Créer une organisation</v-btn>
    </v-toolbar>
    <v-data-table
        v-if="orgList.length"
        :headers="headers"
        :items="orgList"
        item-key="_id"
        @click:row="goToOrgDetail"
    >
    </v-data-table>

    <v-alert v-else type="info">Aucune organisation trouvée.</v-alert>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Créer une organisation</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
                v-model="name"
                label="Nom de l'organisation"
                required
            ></v-text-field>
            <v-text-field
                v-model="passSecret"
                label="Phrase secrète"
                required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Annuler</v-btn>
          <v-btn color="blue darken-1" text @click="submit">Créer</v-btn>
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
      passSecret: '',
      targetOrgId: null,
      headers: [
        { text: 'Nom', value: 'name' },
      ],
    };
  },
  computed: {
    ...mapState('orgs', ['orgList', 'currentOrg']),
    ...mapState('secret', ['secret']),
  },
  methods: {
    ...mapActions('orgs', ['fetchOrgList', 'createOrg']),
    ...mapMutations('orgs', ['setCurrentOrg']),
    goToOrgDetail(item) {
      if (this.secret) {
        this.$router.push({ name: 'OrgDetail', params: { id: item._id } });
      } else {
        this.$store.dispatch('errors/pushError', 'Veuillez renseigner votre clé secrète.');
      }
    },
    closeDialog() {
      this.dialog = false;
      this.name = '';
    },
    async submit() {
      if (this.valid) {
        const orgExists = this.orgList.some(org => org.name === this.name);
        if (orgExists) {
          this.$store.dispatch('errors/pushError', 'Une organisation avec ce nom existe déjà.');
          return;
        }
        try {
          let response = await this.createOrg({ name: this.name, secret: this.passSecret });
          if(response.error === 0) {
            this.closeDialog();
            await this.fetchOrgList();
          } else {
            this.$store.dispatch('errors/pushError', response.data);
          }
        } catch (err) {
          this.$store.dispatch('errors/pushError', err);
        }
      }
    }
  },
  watch: {
    secret(newSecret) {
      if (newSecret && this.targetOrgId) {
        this.$router.push({name: 'OrgDetail', params: {id: this.targetOrgId}});
        this.targetOrgId = null;
      }
    }
  },
  created() {
    this.setCurrentOrg(null);
    this.fetchOrgList()
  }
};
</script>