import { type Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import type { List, User } from '@/types';
import { LOCAL_STORAGE_CURRENT_USER_DATA, LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';

export const useUserStore = defineStore('userStore', () => {
  const currentUserData: Ref<User> = ref(null);
  const currentUserList: Ref<List> = ref(null);

  function setUserData(selectedUser: User) {
    currentUserData.value = selectedUser;
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_DATA, JSON.stringify(currentUserData?.value));
  }

  function setUserList(selectedUserList: List) {
    currentUserList.value = selectedUserList;
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_LIST, JSON.stringify(currentUserList?.value));
  }

  return { currentUserData, setUserData, currentUserList, setUserList };
});
