<template>
  <v-container>
    <v-data-table
        v-if="heroList.length"
        :headers="headers"
        :items="heroList"
        item-key="_id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Heroes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = true">Create Hero</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>

    <v-alert v-else type="info">Aucun héros trouvé.</v-alert>

    <custom-dialog
        :visible="dialog"
        title="Create Hero"
        :confirmDisabled="!isFormValid"
        @cancel="closeDialog"
        @confirm="submit"
    >
      <v-form v-model="valid">
        <v-text-field
            v-model="publicName"
            label="Hero Public Name"
            required
        ></v-text-field>
        <v-text-field
            v-model="realName"
            label="Hero Real Name"
            required
        ></v-text-field>
        <v-divider></v-divider>
        <v-btn @click="addPower">Add Power</v-btn>
        <v-list>
          <v-list-item v-for="(power, index) in powers" :key="index">
            <v-text-field
                v-model="power.name"
                label="Power Name"
                required
            ></v-text-field>
            <v-text-field
                v-model="power.type"
                label="Power Type"
                type="number"
                min="1"
                max="7"
                required
            ></v-text-field>
            <v-text-field
                v-model="power.level"
                label="Power Level"
                type="number"
                min="0"
                max="100"
                required
            ></v-text-field>
            <v-btn @click="removePower(index)">Remove</v-btn>
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
        { text: 'Public Name', value: 'publicName' },
        { text: 'Real Name', value: 'realName' },
      ],
    };
  },
  computed: {
    ...mapState('heroes', ['heroList', 'currentHero']),
    ...mapState(['secret']),
    isFormValid() {
      return this.publicName && this.realName;
    }
  },
  methods: {
    ...mapActions('heroes', ['fetchHeroList', 'createHero']),
    ...mapMutations('heroes', ['setCurrentHero']),
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
        await this.createHero({ ...heroData, secret: this.secret });
        this.closeDialog();
        await this.fetchHeroList()
      }
    }
  },
  async created() {
    await this.fetchHeroList();
    this.setCurrentHero(null);
  }
};
</script>