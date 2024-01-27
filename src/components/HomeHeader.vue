<template>
  <div class="header-container">
    <div class="header-content">
      <h1 class="header-title alt-font">
        Taste the World. One Restaurant at a Time.
      </h1>
      <search-bar
        class="searchbar mt-3"
        @updateRestaurantNames="handleRestaurantNamesUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import SearchBar from "../components/searchBar/SearchBar";

const restaurantNamesInHome = ref([]);
const emit = defineEmits(["update:restaurantNamesInHome"]);

function handleRestaurantNamesUpdate(names) {
  restaurantNamesInHome.value = names;
  emit("update:restaurantNamesInHome", names);
}
</script>

<style scoped>
.header-container {
  background-image: url("https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3570&q=80;");
  height: 400px;
  width: 100%;

  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.header-container:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}
.header-content {
  z-index: 2;
}
.searchbar {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 25px;
}
.header-title {
  color: #fff;
  margin-bottom: 20px;
}
</style>
