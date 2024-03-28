import { createRouter, createWebHistory } from 'vue-router';
import UsersView from '../views/UsersView.vue';
import ListsView from '../views/ListsView.vue';
import ListView from '../views/ListView.vue';
import LearningView from '../views/LearningView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'users',
      component: UsersView
    },
    {
      path: '/lists',
      name: 'lists',
      component: ListsView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
    {
      path: '/learning',
      name: 'learning',
      component: LearningView
    }
  ]
});

export default router;
