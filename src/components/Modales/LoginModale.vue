<template>
  <modale @close-modale="$emit('closeLoginModale')">
    <div class="card d-flex w-100 justify-content-center flex-column align-items-center">
      <button type="button" class="btn btn-danger m-2" @click="$emit('closeModale')">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
      <h1 class="mt-3 text-center alt-font">Please log in</h1>
      <p class="mt-3">You need to log in to perform this action.</p>
      <button @click="redirectToLogin" class="btn btn-success">Log In</button>
    </div>
  </modale>
</template>

<script setup>
import { useRouter } from "vue-router";
import { defineProps, onMounted } from "vue";
const emit = defineEmits(["closeModale"]);
const router = useRouter();
function redirectToLogin() {
  emit("closeModale");
  router.push("/login");
}
</script>

<style scoped>
.card {
  background-color: #eeddca;
  border: none;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
