<template>
  <v-container>
    <v-form v-model="valid" @submit.prevent="handleSignin">
      <v-text-field
          v-model="login"
          label="Login"
          required
      ></v-text-field>
      <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
      ></v-text-field>
      <v-btn type="submit" :disabled="!valid">Login</v-btn>
      <v-btn @click="goToRegister" :disabled="isAuthenticated">Register</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      login: '',
      password: '',
      valid: false,
    };
  },
  computed: {
    ...mapState('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('auth', ['signin']),
    async handleSignin() {
      try {
        const response = await this.signin({ login: this.login, password: this.password });
        if (response.error === 0) {
          this.$router.push('/user-profile');
        } else {
          this.$store.dispatch('errors/pushError', response.data);
        }
      } catch (err) {
        this.$store.dispatch('errors/pushError', err);
      }
    },
    goToRegister() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
</style>