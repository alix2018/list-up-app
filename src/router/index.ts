import { createRouter, createWebHistory } from 'vue-router';
import AccountsView from '../views/AccountsView.vue';
import ListsView from '../views/ListsView.vue';
import ListView from '../views/ListView.vue';
import FlashcardsModeView from '../views/FlashcardsModeView.vue';
import LearningModeView from '../views/LearningModeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accounts',
      component: AccountsView
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
      path: '/flashcards-mode',
      name: 'flashcards-mode',
      component: FlashcardsModeView
    },
    {
      path: '/learning-mode',
      name: 'learning-mode',
      component: LearningModeView
    }
  ]
});

export default router;
