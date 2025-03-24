<template>
  <v-container>
    <v-card v-if="currentOrg">
      <v-btn @click="goBack">Retour</v-btn>
      <v-card-title>{{ currentOrg.name }}</v-card-title>
      <v-card-text>
        <v-btn @click="openAddTeamDialog">Ajouter une équipe</v-btn>
        <v-list>
          <v-list-item v-for="team in currentOrg.teams" :key="team._id">
            <v-list-item-content>{{ team.name }}</v-list-item-content>
            <v-list-item-action>
              <v-btn @click="viewTeam(team)">Voir</v-btn>
              <v-btn @click="openRemoveTeamDialog(team._id)">Supprimer</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <custom-dialog
        :visible="showNoOrgDialog"
        title="Aucune organisation à afficher"
        @confirm="goBackToOrgList"
        :showCancel="false"
        confirmText="OK"
    >
      <p>Il n'y a aucune organisation à afficher. Veuillez vérifier votre code secret ou réessayer plus tard.</p>
    </custom-dialog>

    <custom-dialog
        :visible="showRemoveTeamDialog"
        title="Confirmer la suppression"
        @cancel="closeRemoveTeamDialog"
        @confirm="confirmRemoveTeam"
    >
      <p>Êtes-vous sûr de vouloir supprimer cette équipe ?</p>
    </custom-dialog>

    <custom-dialog
        :visible="showAddTeamDialog"
        title="Ajouter une équipe"
        :confirmDisabled="!selectedTeam"
        @cancel="closeAddTeamDialog"
        @confirm="confirmAddTeam"
    >
      <v-select
          v-model="selectedTeam"
          :items="recruitableTeams"
          item-text="name"
          item-value="_id"
          label="Sélectionnez une équipe à ajouter"
      ></v-select>
    </custom-dialog>
  </v-container>
</template>

<script>
import CustomDialog from '@/components/CustomDialog.vue';
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  components: {
    CustomDialog
  },
  data() {
    return {
      showNoOrgDialog: false,
      showRemoveTeamDialog: false,
      showAddTeamDialog: false,
      selectedTeam: null,
      teamToRemove: null,
    };
  },
  computed: {
    ...mapState('orgs', ['currentOrg']),
    ...mapState('teams', ['teamList']),
    ...mapState('secret', ['secret']),
    recruitableTeams() {
      if (!this.currentOrg) return [];
      return this.teamList.filter(team => !this.currentOrg.teams.some(orgTeam => orgTeam._id === team._id));
    }
  },
  methods: {
    ...mapActions('orgs', ['fetchOrgById', 'addTeamToOrg', 'removeTeamFromOrg']),
    ...mapActions('teams', ['fetchTeamList']),
    ...mapMutations('teams', ['setCurrentTeam']),
    ...mapMutations('orgs', ['setCurrentOrg']),
    async loadOrganization() {
      try {
        await this.fetchOrgById({ id: this.$route.params.id });
        if (!this.currentOrg) {
          this.showNoOrgDialog = true;
        }
      } catch (err) {
        alert(err);
        this.showNoOrgDialog = true;
      }
    },
    viewTeam(team) {
      this.setCurrentTeam(team);
      this.$router.push(`/teams/${team._id}`);
    },
    openAddTeamDialog() {
      this.showAddTeamDialog = true;
    },
    closeAddTeamDialog() {
      this.showAddTeamDialog = false;
      this.selectedTeam = null;
    },
    async confirmAddTeam() {
      if (this.selectedTeam) {
        try {
          let response = await this.addTeamToOrg({ idTeam: this.selectedTeam });
          if(response.error === 0){
            await this.loadOrganization();
            this.closeAddTeamDialog();
          } else {
            this.$store.dispatch('errors/pushError', response.data);
          }
        } catch (err) {
          this.$store.dispatch('errors/pushError',err);
        }
      }
    },
    openRemoveTeamDialog(teamId) {
      this.teamToRemove = teamId;
      this.showRemoveTeamDialog = true;
    },
    closeRemoveTeamDialog() {
      this.showRemoveTeamDialog = false;
      this.teamToRemove = null;
    },
    async confirmRemoveTeam() {
      try {
        let response = await this.removeTeamFromOrg({ idTeam: this.teamToRemove });
        if (response.error === 0) {
          await this.loadOrganization();
          this.closeRemoveTeamDialog();
        } else {
          this.$store.dispatch('errors/pushError', response.data);
        }
      } catch (err) {
        this.$store.dispatch('errors/pushError', err);
      }
    },
    goBackToOrgList() {
      this.$router.push('/organizations');
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  async mounted() {
    if(!this.secret){
      if (this.$router.currentRoute.path !== '/organizations') {
        this.$router.push('/organizations');
      }
      this.setCurrentTeam(null);
      this.setCurrentOrg(null);
    } else {
      await this.loadOrganization();
      await this.fetchTeamList();
    }
  },
};
</script>