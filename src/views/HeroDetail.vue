<template>
  <v-container>
    <v-card v-if="currentHero">
      <v-card-title>{{ currentHero.publicName }}</v-card-title>
      <v-card-subtitle>{{ currentHero.realName }}</v-card-subtitle>
      <v-card-text>
        <v-list>
          <v-list-item v-for="power in currentHero.powers" :key="power">
            <v-list-item-content>{{ power }}</v-list-item-content>
          </v-list-item>
        </v-list>
        <v-btn @click="goBackToHeroList">Retour à la liste des héros</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showNoHeroDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Aucun héros à afficher</span>
        </v-card-title>
        <v-card-text>
          <p>Il n'y a aucun héros à afficher. Veuillez vérifier votre code secret ou réessayer plus tard.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="goBackToHeroList">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      showNoHeroDialog: false,
    };
  },
  computed: {
    ...mapState('heroes', ['currentHero']),
    ...mapState(['secret']),
  },
  methods: {
    ...mapActions('heroes', ['fetchHeroById']),
    ...mapMutations('heroes', ['setCurrentHero']),
    async loadHero() {
      try {
        await this.fetchHeroById({ id: this.$route.params.id, secret: this.secret });
        if (!this.currentHero) {
          this.showNoHeroDialog = true;
        }
      } catch (err) {
        alert("Accès refusé : clé incorrecte ou expirée.");
        this.showNoHeroDialog = true;
      }
    },
    goBackToHeroList() {
      this.$router.push('/heroes');
    },
  },
  async mounted() {
    await this.loadHero();
  },
};
</script>