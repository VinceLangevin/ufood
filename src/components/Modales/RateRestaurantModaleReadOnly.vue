<template>
  <modale @close-modale="emit('closeModale')">
    <div
      class="d-flex w-100 mb-5 justify-content-center flex-column align-items-center"
    >
      <h1 class="mt-3 text-center alt-font">Review</h1>

      <div
        id="starsContainer"
        class="d-flex justify-content-center text-warning"
      >
        <font-awesome-icon
          class="starYellow"
          icon="fa-solid fa-star"
          v-if="props.visit.rating >= 1"
        />
        <font-awesome-icon class="starGrey" icon="fa-solid fa-star" v-else />

        <font-awesome-icon
          class="starYellow"
          icon="fa-solid fa-star"
          v-if="props.visit.rating >= 2"
        />
        <font-awesome-icon class="starGrey" icon="fa-solid fa-star" v-else />

        <font-awesome-icon
          class="starYellow"
          icon="fa-solid fa-star"
          v-if="props.visit.rating >= 3"
        />
        <font-awesome-icon class="starGrey" icon="fa-solid fa-star" v-else />

        <font-awesome-icon
          class="starYellow"
          icon="fa-solid fa-star"
          v-if="props.visit.rating >= 4"
        />
        <font-awesome-icon class="starGrey" icon="fa-solid fa-star" v-else />

        <font-awesome-icon
          class="starYellow"
          icon="fa-solid fa-star"
          v-if="props.visit.rating >= 5"
        />
        <font-awesome-icon class="starGrey" icon="fa-solid fa-star" v-else />
      </div>

      <div class="d-flex w-50 mt-3 flex-column justify-content-start">
        <label class="alt-font" for="visitDate">Date de visite</label>
        <input
          :value="props.visit.date"
          id="visitDate"
          class="w-100 rounded date"
          type="text"
          readonly
        />
      </div>

      <textarea
        :value="props.visit.comment"
        class="rounded textArea mt-3 w-50"
        name="ratingComment"
        id="ratingComment"
        cols="30"
        rows="10"
        placeholder="Comment..."
        readonly
      ></textarea>
    </div>
  </modale>
</template>

<script setup>
import Modale from "./Modale.vue";

const props = defineProps({
  visit: Object,
});

const emit = defineEmits([
  'closeModale'
])
</script>

<style>
.starYellow {
  font-size: 2em;
  color: yellow;
}

.starGrey {
  font-size: 2em;
  color: grey;
}

#restaurantRating {
  appearance: none;
}

.sendBtn {
  background-color: #5e503f;
  color: #0a0908;
  width: 100px;
}

.textArea {
  padding: 10px;
  resize: none;
  border: none;
  outline: none !important;
}

.date {
  border: none;
  outline: none !important;
}

h1 {
  color: #0a0908;
}
</style>
