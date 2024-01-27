<template>
  <div>
    <nav
      class="navbar navbar-expand-lg fixed-top navbar-dark px-3"
      style="background-color: #0a0908"
    >
      <router-link class="navbar-brand alt-font m-0" to="/" v-if="innerWidth <= navCollapseValue">UF.</router-link>
      <router-link class="navbar-brand alt-font" to="/" v-else>UFood.</router-link>
      <user-search :is-small="true" v-if="innerWidth <= navCollapseValue"></user-search>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="col navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
        </ul>
        <user-search :is-large="true" v-if="innerWidth >= navCollapseValue"></user-search>
        <ul class="col justify-content-end navbar-nav">
          <li v-if="props.loggedUser != null" class="nav-item" id="username">
            <router-link class="nav-link" style="color:gold;" :to="`/user/${props.loggedUser.id}`">{{props.loggedUser.name}}</router-link>
          </li>
          <li v-if="props.loggedUser == null" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="props.loggedUser != null" class="nav-item" id="btn_logout">
            <router-link class="nav-link" to="/" @click="logoutUser"
              >Logout</router-link
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from "vue";
import UserSearch from "./UserSearch.vue";
import { logout } from "../api/user";

const innerWidth = ref(window.innerWidth);
const navCollapseValue = 990;

const props = defineProps({
  loggedUser: Object,
})

const emit = defineEmits([
  'logout'
])

watch(
  () => innerWidth.value,
  (newValue) => {
    innerWidth.value = newValue;
  }
);

const logoutUser = async () => {
  await logout();
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  emit('logout');
};

const handleWindowResize = () => {
  innerWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowResize);
});
</script>

<style>
.nav_searchbar {
  border-radius: 45px;
  height: auto;
}
.w-85 {
  width: 85%;
}
.start-25 {
  left: 40%;
}
.navbar-brand {
  font-size: 30px;
}
.nav-link {
  font-size: 20px;
}
.navbar {
  height: auto;
  flex-wrap: nowrap;
}
.nav_searchbar {
  border-radius: 45px;
  height: 30px;
}
.w-85 {
  width: 85%;
}
.start-25 {
  left: 40%;
}
</style>
