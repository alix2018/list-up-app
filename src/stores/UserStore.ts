import { ref } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_CURRENT_USER_DATA, LOCAL_STORAGE_CURRENT_USER_LIST } from '@/constants';

export const useUserStore = defineStore('userStore', () => {
  const currentUserData = ref(null);
  const currentUserList = ref(null);

  function setUserData(selectedUser) {
    currentUserData.value = selectedUser;
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_DATA, JSON.stringify(currentUserData?.value));
  }

  function setUserList(selectedUserList) {
    currentUserList.value = selectedUserList;
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_LIST, JSON.stringify(currentUserList?.value));
  }

  return { currentUserData, setUserData, currentUserList, setUserList };
});
