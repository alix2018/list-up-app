import { createRouter, createWebHistory } from 'vue-router';
import UsersView from '../views/UsersView.vue';
import ListsView from '../views/ListsView.vue';
import ListCreate from '../views/ListCreate.vue';
import ListView from '../views/ListView.vue';
import LearningFlashcardsView from '../views/LearningFlashcardsView.vue';
import LearningTypingView from '../views/LearningTypingView.vue';

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
      path: '/create-list',
      name: 'create-list',
      component: ListCreate
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: LearningFlashcardsView
    },
    {
      path: '/typing',
      name: 'typing',
      component: LearningTypingView
    }
  ]
});

export default router;
