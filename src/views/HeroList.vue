<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Héros</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="dialog = true">Créer un héros</v-btn>
    </v-toolbar>
    <v-data-table
        v-if="heroList.length"
        :headers="headers"
        :items="heroList"
        item-key="_id"
    >
    </v-data-table>

    <v-alert v-else type="info">Aucun héros trouvé.</v-alert>

    <custom-dialog
        :visible="dialog"
        title="Créer un héros"
        :confirmDisabled="!isFormValid"
        @cancel="closeDialog"
        @confirm="submit"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="publicName"
            label="Nom public"
            required
        ></v-text-field>
        <v-text-field
            v-model="realName"
            label="Vrai nom"
            required
        ></v-text-field>
        <v-divider></v-divider>
        <v-btn @click="addPower">Ajouter un pouvoir</v-btn>
        <v-list>
          <v-list-item v-for="(power, index) in powers" :key="index">
            <v-text-field
                v-model="power.name"
                label="Nom du pouvoir"
                required
            ></v-text-field>
            <v-text-field
                v-model="power.type"
                label="Type de pouvoir"
                type="number"
                :rules="[v => (v >= 1 && v <= 7) || 'Type de pouvoir doit être entre 1 et 7']"
                required
            ></v-text-field>
            <v-text-field
                v-model="power.level"
                label="Niveau de pouvoir"
                type="number"
                :rules="[v => (v >= 0 && v <= 100) || 'Niveau de pouvoir doit être entre 0 et 100']"
                required
            ></v-text-field>
            <v-btn @click="removePower(index)">Supprimer</v-btn>
          </v-list-item>
        </v-list>
      </v-form>
    </custom-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import CustomDialog from '@/components/CustomDialog.vue';

export default {
  components: {
    CustomDialog
  },
  data() {
    return {
      dialog: false,
      valid: false,
      publicName: '',
      realName: '',
      powers: [],
      targetHeroId: null,
      headers: [
        { text: 'Nom public', value: 'publicName' },
        { text: 'Vrai nom', value: 'realName' },
      ],
    };
  },
  computed: {
    ...mapState('heroes', ['heroList']),
    ...mapState('secret', ['secret']),
    isFormValid() {
      return this.publicName && this.realName;
    }
  },
  methods: {
    ...mapActions('heroes', ['fetchHeroList', 'createHero']),
    closeDialog() {
      this.dialog = false;
      this.publicName = '';
      this.realName = '';
      this.powers = [];
    },
    addPower() {
      this.powers.push({ name: '', type: '', level: '' });
    },
    removePower(index) {
      this.powers.splice(index, 1);
    },
    async submit() {
      if (this.valid) {
        const heroData = {
          publicName: this.publicName,
          realName: this.realName,
          powers: this.powers.filter(power => power.name && power.type && power.level)
        };
        try{
          let response = await this.createHero({ ...heroData });
          if(response.error === 0){
            this.closeDialog();
            await this.fetchHeroList();
          } else {
            this.$store.dispatch('errors/pushError', response.data.data);
          }
        } catch (err) {
          this.$store.dispatch('errors/pushError', err);
        }
      }
    }
  },
  async created() {
    await this.fetchHeroList();
  }
};
</script>