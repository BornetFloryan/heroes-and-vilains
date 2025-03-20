<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="accept">Ok</v-btn>
        <v-btn color="red darken-1" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
  },
  data() {
    return {
      visible: false,
      resolve: null,
    };
  },
  methods: {
    open() {
      this.visible = true;
      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    },
    accept() {
      this.visible = false;
      this.resolve(true);
    },
    cancel() {
      this.visible = false;
      this.resolve(false);
    },
  },
};
</script>