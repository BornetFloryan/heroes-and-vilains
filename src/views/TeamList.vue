<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Équipes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="openDialog">Créer une équipe</v-btn>
    </v-toolbar>
    <v-data-table
        :headers="headers"
        :items="teamList"
        item-key="_id"
    >
    </v-data-table>

    <custom-dialog
        :visible="dialog"
        title="Créer une équipe"
        :confirmDisabled="!isFormValid"
        @cancel="closeDialog"
        @confirm="submit"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="teamName"
            label="Nom de l'équipe"
            required
        ></v-text-field>
      </v-form>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CustomDialog from '@/components/CustomDialog.vue';

export default {
  components: {
    CustomDialog
  },
  data() {
    return {
      dialog: false,
      valid: false,
      teamName: '',
      headers: [
        { text: 'Nom', value: 'name' },
      ]
    };
  },
  computed: {
    ...mapState('teams', ['teamList']),
    isFormValid() {
      return this.teamName.trim() !== '';
    }
  },
  methods: {
    ...mapActions('teams', ['fetchTeamList', 'createTeam']),
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.teamName = '';
    },
    async submit() {
      if (this.valid) {
        const teamExists = this.teamList.some(team => team.name === this.teamName);
        if (teamExists) {
          alert('Une équipe avec ce nom existe déjà.');
          return;
        }
        try{
          let response = await this.createTeam(this.teamName);
          if(response.error === 0){
            this.closeDialog();
            this.fetchTeamList();
          } else {
            this.$store.dispatch('errors/pushError', response.data);
          }
        } catch (err) {
          this.$store.dispatch('errors/pushError', err);
        }
      }
    },
  },
  created() {
    this.fetchTeamList();
  },
};
</script>