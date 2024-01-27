<template>
  <div
    class="position-relative test"
    :class="{ small: props.isSmall, large: props.isLarge }"
  >
    <div class="d-flex flex-row">
      <input
        class="form-control usernameInput"
        type="search"
        placeholder="Search for users"
        v-model="usernameInput"
        aria-label="Search"
        @click="handleSearchInputClick"
      />
      <button @click="searchUser" class="btn btn-success searchBtn">
        Search
      </button>
    </div>
    <div class="userResultsContainer" v-if="isOpened">
      <div v-for="user in matchedUsers" :key="user.id" class="userResult" @click="this.$router.push('/user/' + user.id)">
        <span class="alt-font">{{ user.name }}</span>
      </div>
    </div>

    <PopUpModale v-if="popUpOpened"
    @close-pop-up="popUpOpened=false"
    :message="'You need to be logged in to use this feature...'"
    />

  </div>
</template>
  
  <script setup>
import { ref, defineProps, onMounted, onBeforeUnmount } from "vue";
import { getUsers } from "../api/userSearch.js";
import PopUpModale from "./Modales/PopUpModale.vue";

const usernameInput = ref("");
const matchedUsers = ref([]);
const isOpened = ref(true);
const popUpOpened = ref(false);

const props = defineProps({
  isSmall: Boolean,
  isLarge: Boolean,
});

async function searchUser() {
  try {

    if(localStorage.getItem('user') == null){
      popUpOpened.value = true;
      return;
    }

    const data = await getUsers(usernameInput);
    matchedUsers.value = data;
    isOpened.value = true;
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

onMounted(() => {
  document.addEventListener("click", (e) => handleDocumentClick(e));
});
onBeforeUnmount(() => {
  document.removeEventListener("click", (e) => handleDocumentClick(e));
});

function handleDocumentClick(e) {
  const input = document.querySelector("usernameInput");
  if (e.target != input) isOpened.value = false;
  else isOpened.value = true;
}
function handleSearchInputClick() {
  if (matchedUsers.value.length > 0) {
    isOpened.value = true;
  }
}
</script>
  
  <style>
.userResultsContainer {
  position: absolute;
  width: 100%;
  background-color: white;
}
.userResult {
  padding: 0.5rem;
  color: black;
}
.userResult:hover {
  background-color: rgb(54, 59, 59);
}
.usernameInput {
  border: 1px solid #000;
  border-radius: 0.5rem 0 0 0.5rem;
}
.searchBtn {
  border: 1px solid #000;
  border-radius: 0 0.5rem 0.5rem 0;
}
.small {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
.large {
  width: 40%;
}
.test {
}
</style>