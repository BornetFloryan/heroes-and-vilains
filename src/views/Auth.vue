<template>
  <v-container>
    <v-form @submit.prevent="authenticate">
      <v-text-field label="Secret Phrase" v-model="secret" @keyup.enter="authenticate" />
      <v-btn @click="authenticate">Authenticate</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      secret: ''
    };
  },
  methods: {
    ...mapActions(['setSecret']),
    authenticate() {
      this.setSecret(this.secret);
      this.$router.push('/organizations');
    }
  }
};
</script>