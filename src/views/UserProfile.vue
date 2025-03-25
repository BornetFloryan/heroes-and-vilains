<template>
  <div>
    <div v-if="user">
      <h1>Profil Utilisateur</h1>
      <p><strong>Login:</strong> {{ user.login }}</p>
      <v-card v-if="user.hero">
        <v-card-title>Détails du Héros</v-card-title>
        <v-card-text>
          <div>Nom public : {{ user.hero.publicName }}</div>
          <div>Vrai nom : {{ user.hero.realName }}</div>
          <div v-if="user.hero.powers && user.hero.powers.length > 0">Pouvoir(s) :</div>
          <ul v-if="user.hero.powers && user.hero.powers.length > 0">
            <li v-for="power in user.hero.powers" :key="power._id">
              {{ power.name }} (Type: {{ power.type }}, Niveau: {{ power.level }})
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="openEditHeroDialog">Modifier</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>Aucun héros associé</v-card-title>
      </v-card>
    </div>
    <div v-else>
      <p>Chargement des données de l'utilisateur...</p>
    </div>

    <custom-dialog
        v-if="editHero"
        :visible="showEditHeroDialog"
        title="Modifier le héros"
        @cancel="closeEditHeroDialog"
        @confirm="confirmEditHero"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="editHero.publicName"
            label="Nom public"
            required
        ></v-text-field>
        <v-text-field
            v-model="editHero.realName"
            label="Vrai nom"
            required
        ></v-text-field>
        <v-btn @click="addPower">Ajouter un pouvoir</v-btn>
        <div v-for="(power, index) in editHero.powers" :key="index">
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import CustomDialog from '@/components/CustomDialog.vue';

export default {
  name: 'UserProfile',
  components: {
    CustomDialog
  },
  data() {
    return {
      showEditHeroDialog: false,
      showRemoveHeroDialog: false,
      valid: false,
      editHero: null,
    };
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    ...mapActions('auth', ['getUser', 'updateHero']),
    openEditHeroDialog() {
      this.editHero = { ...this.user.hero };
      this.showEditHeroDialog = true;
    },
    closeEditHeroDialog() {
      this.showEditHeroDialog = false;
      this.editHero = null;
    },
    async confirmEditHero() {
      if (this.valid) {
        await this.updateHero(this.editHero);
        this.closeEditHeroDialog();
        await this.getUser();
      }
    },
    addPower() {
      this.editHero.powers.push({ name: '', type: '', level: '' });
    },
    removePower(index) {
      this.editHero.powers.splice(index, 1);
    },
  },
  async created() {
    if (this.user) {
      try {
        let response = await this.getUser();
        if (response.error > 0) {
          this.$router.push('/organizations');
        }
      } catch (err) {
        this.$store.dispatch('errors/pushError', err);
      }
    } else {
      this.$router.push('/login');
    }
  },
};
</script>

<style scoped>
</style>