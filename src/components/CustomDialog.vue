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
        <v-btn v-if="showCancel" color="blue darken-1" text @click="cancel">{{ cancelText }}</v-btn>
        <v-btn :disabled="confirmDisabled" color="blue darken-1" text @click="confirm">{{ confirmText }}</v-btn>
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
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: 'Annuler'
    },
    confirmText: {
      type: String,
      default: 'Valider'
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