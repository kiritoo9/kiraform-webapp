import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/access_token';

// import views
import HomeView from '../views/HomeView.vue'
import WorkspaceView from '../views/WorkspaceView.vue'
import CampaignView from '@/views/CampaignView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: WorkspaceView,
      meta: { requiresAuth: true }
    },
    {
      path: '/campaign/:id',
      name: 'campaign',
      component: CampaignView,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadToken();
  if (
    to.meta.requiresAuth
    &&
    (!authStore.accessToken || authStore.accessToken == "")
  ) {
    next({ path: '/' });
  } else {
    next();
  }
})

export default router
