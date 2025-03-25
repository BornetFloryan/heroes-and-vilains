<template>
  <v-app-bar app>
    <v-toolbar-title>Heroes & Villains</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="navigateTo('/organizations')">Organizations</v-btn>
    <v-btn text @click="navigateTo('/teams')">Teams</v-btn>
    <v-btn text @click="navigateTo('/heroes')">Heroes</v-btn>
    <v-btn text @click="handleSecret">{{ secretButtonText }}</v-btn>
    <v-btn text @click="handleAuth">{{ authButtonText }}</v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('secret', ['secret']),
    ...mapState('auth', ['isAuthenticated']),
    secretButtonText() {
      return this.secret ? 'Retirer secret' : 'Secret';
    },
    authButtonText() {
      return this.isAuthenticated ? 'Logout' : 'Login';
    }
  },
  methods: {
    ...mapActions('secret', ['setSecret']),
    ...mapActions('auth', ['signin', "logout"]),
    handleSecret() {
      if (this.secret) {
        this.setSecret('');
        if (this.$route.path !== '/organizations') {
          this.$router.push('/organizations');
        }
      } else {
        if (this.$route.path !== '/secret') {
          this.$router.push('/secret');
        }
      }
    },
    handleAuth() {
      if (this.isAuthenticated) {
        this.logout()
        if (this.$route.path !== '/organizations') {
          this.$router.push('/organizations');
        }
      } else {
        if (this.$route.path !== '/login') {
          this.$router.push('/login');
        }
      }
    },
    navigateTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    }
  }
};
</script>

<style scoped>
.v-toolbar-title {
  cursor: pointer;
}
</style>