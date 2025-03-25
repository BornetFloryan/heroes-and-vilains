<template>
  <div>
    <h1>Enregistrement Utilisateur</h1>
    <v-form v-model="valid">
      <v-text-field
          v-model="login"
          label="Login"
          required
      ></v-text-field>
      <v-text-field
          v-model="password"
          label="Mot de passe"
          type="password"
          required
      ></v-text-field>
      <v-select
          v-model="hero"
          :items="heroList"
          item-text="publicName"
          item-value="_id"
          label="Nom du Héro"
          required
      ></v-select>
      <VueRecaptcha
          :sitekey="siteKey"
          :loadRecaptchaScript="true"
          ref="recaptcha"
          @verify="onCaptchaVerify"
          @expired="onCaptchaExpired"
      ></VueRecaptcha>
      <v-btn @click="registerUser" :disabled="!valid || !captchaVerified">S'enregistrer</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import VueRecaptcha from 'vue-recaptcha';
import Config from '@/commons/config';

export default {
  name: 'RegisterUser',
  components: {
    VueRecaptcha
  },
  data() {
    return {
      login: '',
      password: '',
      hero: '',
      valid: false,
      captchaVerified: false,
      captchaToken: '',
      siteKey: Config.captchaSiteKey
    };
  },
  computed: {
    ...mapState('heroes', ['heroList'])
  },
  methods: {
    ...mapActions('auth', ['register']),
    ...mapActions('heroes', ['fetchHeroList', 'fetchHeroById']),
    onCaptchaVerify(token) {
      this.captchaToken = token;
      this.captchaVerified = true;
    },
    onCaptchaExpired() {
      this.captchaToken = null;
      this.captchaVerified = false;
    },
    async registerUser() {
      if (this.captchaToken === null) {
        this.pushError('Veuillez cliquer sur le captcha');
        return
      }
      if (this.valid && this.captchaVerified && this.hero){
        const user = {
          login: this.login,
          password: this.password,
          captchaToken: this.captchaToken,
          hero: this.heroList.find(h => h._id === this.hero).publicName,
        };
        this.currentHero = null;
        try {
          const response = await this.register(user);
          if (response.error === 0) {
            this.$router.push('/login');
          } else {
            console.error('Error Response:', response);
            this.$store.dispatch('errors/pushError', response.data);
          }
        } catch (err) {
          console.error('Request Error:', err);
          this.$store.dispatch('errors/pushError', err);
        }
      } else {
        console.warn('Form is invalid or captcha is not verified');
      }
    },
  },
  async created() {
    await this.fetchHeroList();
  }
};
</script>

<style scoped>
</style>