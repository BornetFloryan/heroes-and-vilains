<template>
  <v-app>
    <v-main>
      <NavBar/>
      <ErrorDialog/>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";

export default {
  name: 'App',
  components: {
    NavBar,
    ErrorDialog,
  },

  data: () => ({
  }),
};
</script>