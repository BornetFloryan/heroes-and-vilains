<template>
  <v-container>
    <v-card v-if="currentTeam">
      <v-card-title>{{ currentTeam.name }}</v-card-title>
      <v-card-text>
        <v-btn @click="openAddMemberDialog">Ajouter un membre</v-btn>
        <v-list>
          <v-list-item v-for="hero in teamMembers" :key="hero._id" v-if="hero">
            <v-list-item-content>
              <div>Nom public : {{ hero.publicName }}</div>
              <div>Vrai nom : {{ hero.realName }}</div>
              <div v-if="hero.powers && hero.powers.length > 0">Pouvoir(s) :</div>
              <div v-for="power in hero.powers" :key="power._id">
                <span>{{ power.name }} (Type: {{ power.type }}, Niveau: {{ power.level }})</span>
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="openEditMemberDialog(hero._id)">Modifier</v-btn>
              <v-btn @click="openRemoveMemberDialog(hero._id)">Supprimer</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <custom-dialog
        :visible="showAddMemberDialog"
        title="Ajouter un membre"
        @cancel="closeAddMemberDialog"
        @confirm="confirmAddMember"
    >
      <v-form v-model="valid">
        <v-select
            v-model="selectedHero"
            :items="availableHeroes"
            item-text="publicName"
            item-value="_id"
            label="Sélectionnez un héros"
            required
        ></v-select>
        <v-btn v-if="availableHeroes.length === 0" @click="openCreateHeroDialog">Créer un nouveau héros</v-btn>
      </v-form>
    </custom-dialog>

    <custom-dialog
        :visible="showCreateHeroDialog"
        title="Créer un nouveau héros"
        @cancel="closeCreateHeroDialog"
        @confirm="confirmCreateHero"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="newMember.publicName"
            label="Nom public"
            required
        ></v-text-field>
        <v-text-field
            v-model="newMember.realName"
            label="Vrai nom"
            required
        ></v-text-field>
        <v-btn @click="addPower">Ajouter un pouvoir</v-btn>
        <div v-for="(power, index) in newMember.powers" :key="index">
          <v-text-field
              v-model="power.name"
              label="Nom du pouvoir"
              required
          ></v-text-field>
          <v-text-field
              v-model="power.type"
              label="Type de pouvoir"
              required
          ></v-text-field>
          <v-text-field
              v-model="power.level"
              label="Niveau de pouvoir"
              required
          ></v-text-field>
          <v-btn @click="removePower(index)">Supprimer le pouvoir</v-btn>
        </div>
      </v-form>
    </custom-dialog>

    <custom-dialog
        v-if="editMember"
        :visible="showEditMemberDialog"
        title="Modifier le membre"
        @cancel="closeEditMemberDialog"
        @confirm="confirmEditMember"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="editMember.publicName"
            label="Nom public"
            required
        ></v-text-field>
        <v-text-field
            v-model="editMember.realName"
            label="Vrai nom"
            required
        ></v-text-field>
        <v-btn @click="addPower">Ajouter un pouvoir</v-btn>
        <div v-for="(power, index) in editMember.powers" :key="index">
          <v-text-field
              v-model="power.name"
              label="Nom du pouvoir"
              required
          ></v-text-field>
          <v-text-field
              v-model="power.type"
              label="Type de pouvoir"
              required
          ></v-text-field>
          <v-text-field
              v-model="power.level"
              label="Niveau de pouvoir"
              required
          ></v-text-field>
          <v-btn @click="removePower(index)">Supprimer le pouvoir</v-btn>
        </div>
      </v-form>
    </custom-dialog>

    <custom-dialog
        :visible="showRemoveMemberDialog"
        title="Confirmer la suppression"
        @cancel="closeRemoveMemberDialog"
        @confirm="confirmRemoveMember"
    >
      <p>Êtes-vous sûr de vouloir supprimer ce membre ?</p>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CustomDialog from '@/components/CustomDialog.vue';
import * as heroService from "@/services/hero.service";

export default {
  components: {
    CustomDialog
  },
  data() {
    return {
      showAddMemberDialog: false,
      showCreateHeroDialog: false,
      showEditMemberDialog: false,
      showRemoveMemberDialog: false,
      valid: false,
      newMember: {
        publicName: '',
        realName: '',
        powers: []
      },
      selectedHero: null,
      editMember: null,
      memberToRemove: null,
      teamMembers: []
    };
  },
  computed: {
    ...mapState('orgs', ['currentOrg']),
    ...mapState('teams', ['currentTeam']),
    ...mapState('heroes', ['heroList']),
    ...mapState(['secret']),
    availableHeroes() {
      if (!this.heroList) return [];
      return this.heroList.filter(hero => !this.heroList.includes(hero._id));
    }
  },
  methods: {
    ...mapActions('orgs', ['fetchOrgById']),
    ...mapActions('heroes', ['fetchHeroList', 'createHero', 'updateHero', 'fetchHeroById']),
    ...mapActions('teams', ['addHeroesToTeam', 'removeHeroesFromTeam', 'fetchTeamList']),
    async fetchTeamMembers() {
      await this.fetchCurrentOrg();
      console.log('this.currentOrg', this.currentOrg);
      if (this.currentTeam && this.currentOrg) {
        let teamMembers = [];
        const team = this.currentOrg.teams.find(team => team._id === this.currentTeam._id);
        if (team) {
          for (const member_id of team.members) {
            console.log('member_id', member_id);
            try {
              let response = await heroService.getHeroByIdService(member_id, this.secret);
              if (response.error === 0) {
                teamMembers.push(response.data[0]);
              }
            } catch (error) {
              alert('fetchTeamMembers ', error);
            }
          }
        }
        this.teamMembers = teamMembers;
      }
    },
    async fetchCurrentOrg(){
      if(this.currentOrg[0]){
        try{
          let response = await this.fetchOrgById({id: this.currentOrg[0]._id, secret: this.secret});
          if(response.error === 0) {
            this.currentOrg = response.data[0];
          }
        } catch (error) {
          alert('fetchCurrentOrg ', error);
        }
      }
    },
    openAddMemberDialog() {
      this.showAddMemberDialog = true;
    },
    closeAddMemberDialog() {
      this.showAddMemberDialog = false;
      this.newMember = { publicName: '', realName: '', powers: [] };
    },
    async confirmAddMember() {
      if (this.valid) {
        try{
          let response = await this.addHeroesToTeam({ idTeam: this.currentTeam._id, idHeroes: this.selectedHero });
          if (response.error === 0) {
            this.closeAddMemberDialog();
            await this.fetchTeamList();
            await this.fetchTeamMembers();
          }
        }catch(error) {
          alert('confirmAddMember ', error);
        }
      }
    },
    openCreateHeroDialog() {
      this.showCreateHeroDialog = true;
    },
    closeCreateHeroDialog() {
      this.showCreateHeroDialog = false;
      this.newMember = { publicName: '', realName: '', powers: [] };
    },
    async confirmCreateHero() {
      if (this.valid) {
        const newHero = await this.createHero(this.newMember);
        await this.addHeroesToTeam({ idTeam: this.currentTeam._id, idHeroes: newHero._id });
        this.closeCreateHeroDialog();
        await this.fetchTeamList();
        await this.fetchTeamMembers();
      }
    },
    async openEditMemberDialog(heroId) {
      const response = await this.fetchHeroById({ id: heroId, secret: this.secret });
      if (response.error === 0) {
        this.editMember = response.data[0];
        this.showEditMemberDialog = true;
      }
    },
    closeEditMemberDialog() {
      this.showEditMemberDialog = false;
      this.editMember = null;
    },
    async confirmEditMember() {
      if (this.valid) {
        await this.updateHero({
          _id: this.editMember._id,
          publicName: this.editMember.publicName,
          realName: this.editMember.realName,
          powers: this.editMember.powers,
          secret: this.secret
        });
        this.closeEditMemberDialog();
        await this.fetchTeamList();
        await this.fetchTeamMembers();
      }
    },
    openRemoveMemberDialog(heroId) {
      this.memberToRemove = heroId;
      this.showRemoveMemberDialog = true;
    },
    closeRemoveMemberDialog() {
      this.showRemoveMemberDialog = false;
      this.memberToRemove = null;
    },
    async confirmRemoveMember() {
      await this.removeHeroesFromTeam({ idTeam: this.currentTeam._id, idHeroes: this.memberToRemove });
      this.closeRemoveMemberDialog();
      await this.fetchTeamList();
      await this.fetchTeamMembers();
    },
    addPower() {
      if (this.editMember) {
        this.editMember.powers.push({ name: '', type: '', level: '' });
      } else {
        this.newMember.powers.push({ name: '', type: '', level: '' });
      }
    },
    removePower(index) {
      if (this.editMember) {
        this.editMember.powers.splice(index, 1);
      } else {
        this.newMember.powers.splice(index, 1);
      }
    }
  },
  async created() {
    await this.fetchHeroList();
    await this.fetchTeamMembers();
  }
};
</script>