<template>
  <div id="app">
    <navigation-bar :loggedUser="loggedUser" @logout="this.loggedUser = null" />

    <router-view @login="getLoggedUser" :key="$route.fullPath" />
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import NavigationBar from "./components/NavigationBar.vue";
import "./stylesheets/home.css";

export default {
  name: "app",
  components: {
    NavigationBar,
  },
  data() {
    return {
      loggedUser: {},
    };
  },
  methods: {
    getLoggedUser() {
      this.loggedUser = JSON.parse(localStorage.getItem("user"));
    },
    handleDocumentClick(event) {
      const navbar = document.querySelector(".navbar-collapse");
      if (navbar) {
        navbar.classList.remove("show");
      }
    },
  },
  mounted() {
    this.loggedUser = JSON.parse(localStorage.getItem("user"));
    document.addEventListener("click", this.handleDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleDocumentClick);
  },
};
</script>

<style>
body {
  font-family: "Ubuntu", sans-serif;
}
.alt-font {
  font-family: "Croissant One", cursive;
}
</style>
