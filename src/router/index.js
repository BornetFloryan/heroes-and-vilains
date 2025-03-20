import Vue from 'vue';
import Router from 'vue-router';
import Auth from '@/views/Auth.vue';
import OrgList from '@/views/OrgList.vue';
import OrgDetail from '@/views/OrgDetail.vue';
import TeamList from '@/views/TeamList.vue';
import TeamDetail from '@/views/TeamDetail.vue';
import HeroList from '@/views/HeroList.vue';
import HeroDetail from "@/views/HeroDetail.vue";


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/organizations',
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
    {
      path: '/organizations',
      name: 'OrgList',
      component: OrgList
    },
    {
      path: '/organizations/:id',
      name: 'OrgDetail',
      component: OrgDetail,
      props: true
    },
    {
      path: '/teams',
      name: 'TeamList',
      component: TeamList
    },
    {
      path: '/teams/:id',
      name: 'TeamDetail',
      component: TeamDetail,
      props: true
    },
    {
      path: '/heroes',
      name: 'HeroesList',
      component: HeroList
    },
    {
      path: '/teams/:id',
      name: 'HeroDetail',
      component: HeroDetail,
    }
  ]
});