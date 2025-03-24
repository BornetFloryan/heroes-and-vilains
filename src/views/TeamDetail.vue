<template>
  <v-container>
    <v-card v-if="currentTeam">
      <v-btn @click="goBack">Retour</v-btn>
      <v-card-title>{{ currentTeam.name }}</v-card-title>
      <v-card-text>
        <v-btn @click="openAddMemberDialog">Ajouter un membre</v-btn>
        <v-list>
          <v-list-item v-for="hero in teamMembers" :key="hero._id" v-if="hero">
            <v-list-item-content>
              <div>Nom public : {{ hero.publicName }}</div>
              <div>Vrai nom : {{ hero.realName }}</div>
              <div v-if="hero.powers && hero.powers.length > 0">Pouvoir(s) :</div>
              <ul v-if="hero.powers && hero.powers.length > 0">
                <li v-for="power in hero.powers" :key="power._id">
                  {{ power.name }} (Type: {{ power.type }}, Niveau: {{ power.level }})
                </li>
              </ul>
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
        :confirmDisabled="!isHeroSelected"
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
      <v-btn @click="openCreateHeroDialog">Créer un héros</v-btn>
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
          <v-row>
            <v-col>
              <v-text-field
                  v-model="power.name"
                  label="Nom du pouvoir"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="power.type"
                  label="Type de pouvoir"
                  type="number"
                  :rules="[v => (v >= 1 && v <= 7) || 'Type de pouvoir doit être entre 1 et 7']"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="power.level"
                  label="Niveau de pouvoir"
                  type="number"
                  :rules="[v => (v >= 0 && v <= 100) || 'Niveau de pouvoir doit être entre 0 et 100']"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="removePower(index)">Supprimer</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </custom-dialog>

    <custom-dialog
        v-if="editMember"
        :visible="showEditMemberDialog"
        title="Modifier le membre"
        @cancel="closeEditMemberDialog"
        @confirm="openConfirmEditDialog"
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
          <v-row>
            <v-col>
              <v-text-field
                  v-model="power.name"
                  label="Nom du pouvoir"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="power.type"
                  label="Type de pouvoir"
                  type="number"
                  :rules="[v => (v >= 1 && v <= 7) || 'Type de pouvoir doit être entre 1 et 7']"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  v-model="power.level"
                  label="Niveau de pouvoir"
                  type="number"
                  :rules="[v => (v >= 0 && v <= 100) || 'Niveau de pouvoir doit être entre 0 et 100']"
                  required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click="removePower(index)">Supprimer</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-form>
    </custom-dialog>

    <custom-dialog
        :visible="showConfirmEditDialog"
        title="Confirmer les modifications"
        @cancel="closeConfirmEditDialog"
        @confirm="confirmEditMember"
    >
      <p>Êtes-vous sûr de vouloir enregistrer les modifications apportées à ce membre ?</p>
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
import { mapActions, mapMutations, mapState } from 'vuex';
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
      showConfirmEditDialog: false,
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
    ...mapState('teams', ['currentTeam']),
    ...mapState('heroes', ['heroList']),
    ...mapState('secret', ['secret']),
    availableHeroes() {
      if (!this.heroList) return [];
      return this.heroList.filter(hero => !this.heroList.includes(hero._id));
    },
    isHeroSelected() {
      return this.selectedHero !== null;
    }
  },
  methods: {
    ...mapActions('heroes', ['fetchHeroList', 'createHero', 'updateHero', 'fetchHeroById']),
    ...mapActions('teams', ['addHeroesToTeam', 'removeHeroesFromTeam', 'fetchTeamList']),
    ...mapMutations('teams', ['setCurrentTeam']),
    ...mapMutations('orgs', ['setCurrentOrg']),
    async fetchTeamMembers() {
      if (this.currentTeam) {
        let teamMembers = [];
        for (const member_id of this.currentTeam.members) {
          try {
            let response = await heroService.getHeroByIdService(member_id, this.secret);
            if (response.error === 0) {
              teamMembers.push(response.data[0]);
            } else {
              this.$store.dispatch('errors/pushError', response.data);
            }
          } catch (err) {
            this.$store.dispatch('errors/pushError', err);
          }
        }
        this.teamMembers = teamMembers;
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
            this.setCurrentTeam(response.data);
            this.closeAddMemberDialog();
            await this.fetchTeamMembers();
            await this.fetchTeamList();
          } else {
            this.$store.dispatch('errors/pushError', response.data);
          }
        }catch(err) {
          this.$store.dispatch('errors/pushError', err);
        }
      }
    },
    openCreateHeroDialog() {
      this.showCreateHeroDialog = true;
    },
    closeCreateHeroDialog() {
      this.showCreateHeroDialog = false;
      this.newMember = {publicName: '', realName: '', powers: []};
    },
    async confirmCreateHero() {
      if (this.valid) {
        if (this.heroList.some(hero => hero.publicName === this.newMember.publicName) ||
            this.teamMembers.some(member => member.publicName === this.newMember.publicName)) {
          alert('Le(s) nom(s) est déjà utilisé !');
          return;
        }
        try {
          let response = await this.createHero(this.newMember);
          if (response.error === 0) {
            this.newMember = response.data;
            try {
              response = await this.addHeroesToTeam({idTeam: this.currentTeam._id, idHeroes: this.newMember._id});
              if (response.error === 0) {
                this.setCurrentTeam(response.data);
                this.closeCreateHeroDialog();
                this.closeAddMemberDialog()
                await this.fetchTeamList();
                await this.fetchTeamMembers();
              } else {
                this.$store.dispatch('errors/pushError', response.data);
              }
            } catch (err) {
              this.$store.dispatch('errors/pushError', err);
            }
          }
        } catch (err) {
          alert('confirmCreateHero : ' + err);
        }
      }
    },
    async openEditMemberDialog(heroId) {
      const response = await this.fetchHeroById({id: heroId});
      if (response.error === 0) {
        this.editMember = response.data[0];
        this.showEditMemberDialog = true;
      } else {
        this.$store.dispatch('errors/pushError', response.data);
      }
    },
    closeEditMemberDialog() {
      this.showEditMemberDialog = false;
      this.editMember = null;
    },
    openConfirmEditDialog() {
      this.showConfirmEditDialog = true;
    },
    closeConfirmEditDialog() {
      this.showConfirmEditDialog = false;
    },
    async confirmEditMember() {
      if (this.valid) {
        if (this.heroList.some(hero => hero.publicName === this.editMember.publicName && hero._id !== this.editMember._id) ||
            this.heroList.some(hero => hero.realName === this.editMember.realName && hero._id !== this.editMember._id)) {
          this.closeConfirmEditDialog();
          this.$store.dispatch('errors/pushError', 'Le(s) nom(s) est déjà utilisé !');
          return;
        }
        await this.updateHero({
          _id: this.editMember._id,
          publicName: this.editMember.publicName,
          realName: this.editMember.realName,
          powers: this.editMember.powers,
        });
        this.closeConfirmEditDialog();
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
      try {
        let response = await this.removeHeroesFromTeam({idTeam: this.currentTeam._id, idHeroes: this.memberToRemove});
        if (response.error === 0) {
          this.setCurrentTeam(response.data);
          this.closeRemoveMemberDialog();
          await this.fetchTeamList();
          await this.fetchTeamMembers();
        } else {
          this.$store.dispatch('errors/pushError', response.data);
        }
      } catch (err) {
        this.$store.dispatch('errors/pushError', err);
      }
    },
    addPower() {
      if (this.editMember) {
        this.editMember.powers.push({name: '', type: '', level: ''});
      } else {
        this.newMember.powers.push({name: '', type: '', level: ''});
      }
    },
    removePower(index) {
      if (this.editMember) {
        this.editMember.powers.splice(index, 1);
      } else {
        this.newMember.powers.splice(index, 1);
      }
    },
    goBack() {
        this.$router.go(-1);
    },
  },
  async created() {
    if (!this.secret) {
      this.$router.push('/organizations');
      this.setCurrentTeam(null);
      this.setCurrentOrg(null);
    } else {
      await this.fetchHeroList();
      await this.fetchTeamMembers();
    }
  }
};
</script>