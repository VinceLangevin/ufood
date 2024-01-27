<template>
  <div class="cardStars d-flex justify-content-center flex-row">
    <font-awesome-icon
      icon="fa-solid fa-star"
      v-for="star in ratingFloored"
      :key="star"
    />
    <font-awesome-icon
      icon="fa-solid fa-star-half-stroke"
      v-if="rating - ratingFloored > 0.5"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  rating: Number,
});

const ratingFloored = computed(() => Math.floor(props.rating));
</script>

<style scoped>
.cardStars {
  color: rgba(51, 92, 28, 0.514);
}
</style>
