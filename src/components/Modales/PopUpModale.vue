<template>
  <dialog id="popUpContainer">
    <div id="popUpHeader">
      <button
        type="button"
        class="btn btn-danger btn-sm m-1"
        @click="emit('closePopUp')"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>
    <div id="popUpContent" class="d-flex justify-content-center">
      {{ props.message }}
    </div>
  </dialog>
</template>

<script setup>
import { defineEmits, defineProps, onMounted } from "vue";

const emit = defineEmits(["closePopUp"]);

const props = defineProps({
  message: String,
});

onMounted(() => {
  document.getElementById("popUpContainer").showModal();
});
</script>

<style scoped>
#popUpContainer {
  --modale-width: 17%;
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

  background-color: #c6ac8f;
  border: none;
  border-radius: 10px;

  animation: fadeIn 0.5s;
}

#popUpHeader {
  display: flex;
  justify-content: flex-end;
  background-color: #060a0b;
  height: auto;
}

#popUpContent {
  font-size: 1.5rem;
  padding: 1rem;
  color: white;
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
  #popUpContainer {
    --modale-width: 90%;

    width: var(--modale-width);
  }
}
</style>
