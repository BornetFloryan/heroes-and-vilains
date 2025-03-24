import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Auth from '@/views/Auth.vue';
import OrgList from '@/views/OrgList.vue';
import OrgDetail from '@/views/OrgDetail.vue';
import TeamList from '@/views/TeamList.vue';
import TeamDetail from '@/views/TeamDetail.vue';
import HeroList from '@/views/HeroList.vue';

Vue.use(Router);

const router = new Router({
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
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/teams',
      name: 'TeamList',
      component: TeamList,
    },
    {
      path: '/teams/:id',
      name: 'TeamDetail',
      component: TeamDetail,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/heroes',
      name: 'HeroesList',
      component: HeroList,
    },
    {
      path: '*',
      redirect: '/organizations',
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.secret.secret;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next(to.name === 'Auth' ? undefined : { name: 'Auth' });
  } else {
    next();
  }
});


export default router;