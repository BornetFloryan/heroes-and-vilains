<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="teamList"
        item-key="_id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Teams</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog">Create Team</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <custom-dialog
        :visible="dialog"
        title="Create Team"
        :confirmDisabled="!isFormValid"
        @cancel="closeDialog"
        @confirm="submit"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="teamName"
            label="Team Name"
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
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
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
        await this.createTeam(this.teamName);
        this.closeDialog();
        this.fetchTeamList();
      }
    },
  },
  created() {
    this.fetchTeamList();
  },
};
</script>