<template>
  <v-dialog v-model="this.isError" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-card-text>{{ this.errorMsg }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="popError">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('errors', ['isError', 'errorMsg']),
  },
  methods: {
    ...mapActions('errors', ['popError']),
  },
};
</script>