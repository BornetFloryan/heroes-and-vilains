<template>
  <v-dialog v-model="visible" persistent :max-width="maxWidth">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">Annuler</v-btn>
        <v-btn :disabled="confirmDisabled" color="blue darken-1" text @click="confirm">Valider</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Dialog'
    },
    maxWidth: {
      type: String,
      default: '600px'
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm');
    }
  }
};
</script>