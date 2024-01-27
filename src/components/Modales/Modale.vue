<template>
  <dialog id="modaleContainer">
    <div id="modaleHeader">
      <button
        type="button"
        class="btn btn-danger m-2"
        @click="emit('closeModale')"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>
    <div id="modaleContent" class="d-flex justify-content-center">
      <slot />
      
    </div>
  </dialog>
</template>

<script setup>
import { onMounted,defineEmits } from "vue";
// import LoginModale from "./LoginModale.vue";

const emit = defineEmits(["closeModale"]);

onMounted(() => {
  document.getElementById("modaleContainer").showModal();
});
</script>

<style>
#modaleContainer {
  --modale-width: 60%;
  --modale-height: fit-content;
  --modale-left-margin-offset: calc(var(--modale-width) / -2);
  --modale-top-margin-offset: calc(var(--modale-height) / -2);

  position: fixed;
  left: 50%;
  z-index: 100;
  margin-left: var(--modale-left-margin-offset);
  padding: 0;

  width: var(--modale-width);
  height: var(--modale-height);

  background: #c6ac8f;
  border: none;
  border-radius: 10px;

  animation: fadeIn 0.5s;
}

#modaleHeader {
  display: flex;
  justify-content: flex-end;
  background-color: #0a0908;
  height: auto;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media (width < 990px) {
  #modaleContainer {
    --modale-width: 90%;

    width: var(--modale-width);
  }
}
</style>
