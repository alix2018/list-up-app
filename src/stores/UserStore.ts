import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', () => {
  const userData = ref(null);
  const currentUserList = ref(null);

  function setUser(selectedUser) {
    userData.value = selectedUser;
    console.log('set user', userData.value);
  }

  function setUserList(selectedUserList) {
    currentUserList.value = selectedUserList;
    console.log('set user', currentUserList.value);
  }

  return { userData, setUser, currentUserList, setUserList };
});
