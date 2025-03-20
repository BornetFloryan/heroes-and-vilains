<template>
  <v-app-bar app>
    <v-toolbar-title>Heroes & Villains</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text @click="navigateTo('/organizations')">Organizations</v-btn>
    <v-btn text @click="navigateTo('/teams')">Teams</v-btn>
    <v-btn text @click="navigateTo('/heroes')">Heroes</v-btn>
    <v-btn text @click="handleAuth">{{ authButtonText }}</v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['secret']),
    authButtonText() {
      return this.secret ? 'Logout' : 'Login';
    }
  },
  methods: {
    ...mapActions(['setSecret']),
    handleAuth() {
      if (this.secret) {
        this.setSecret('');
      }
      if (this.$route.path !== '/auth') {
        this.$router.push('/auth');
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