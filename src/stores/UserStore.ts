import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', () => {
  const currentUserData = ref(null);
  const currentUserList = ref(null);

  function setUser(selectedUser) {
    currentUserData.value = selectedUser;
    localStorage.setItem('CURRENT_USER_DATA', JSON.stringify(currentUserData?.value));
  }

  function setUserList(selectedUserList) {
    currentUserList.value = selectedUserList;
    console.log('set user', currentUserList.value);
    localStorage.setItem('CURRENT_USER_LIST', JSON.stringify(currentUserList?.value));
  }

  return { currentUserData, setUser, currentUserList, setUserList };
});
