import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Secret from '@/views/Secret.vue';
import OrgList from '@/views/OrgList.vue';
import OrgDetail from '@/views/OrgDetail.vue';
import TeamList from '@/views/TeamList.vue';
import TeamDetail from '@/views/TeamDetail.vue';
import HeroList from '@/views/HeroList.vue';
import SignIn from "@/views/SignIn.vue";
import UserProfile from "@/views/UserProfile.vue";
import RegisterUser from "@/views/RegisterUser.vue";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/organizations',
    },
    {
      path: '/login',
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/secret',
      name: 'Secret',
      component: Secret
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
    },
    {
      path: "/user-profile",
      name: "UserProfile",
      component: UserProfile,
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.secret.secret;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next(to.name === 'Secret' ? undefined : { name: 'Secret' });
  } else {
    next();
  }
});


export default router;