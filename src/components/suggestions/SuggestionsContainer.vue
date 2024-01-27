<template>
  <div class="w-100">
    <h3 class="mt-3">You might also like</h3>
    <div
      class="d-flex flex-wrap justify-content-center pt-5"
      v-if="suggestions"
    >
      <restaurant-card
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        :is-home-page="false"
        :restaurant="suggestion"
      ></restaurant-card>
    </div>
    <div class="text-center pt-5" v-else>
      <h2>No result</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from "vue";
import { getRestaurantsSuggestions } from "../../api/restaurants";
import RestaurantCard from "../RestaurantCards/RestaurantCard.vue";

const props = defineProps({
  genres: String,
  priceRange: Number,
  currentId: String,
});

const suggestions = ref([]);

async function fetchSuggestions() {
  try {
    const fetchedRestaurantsSuggestions = await getRestaurantsSuggestions(
      props.genres,
      props.priceRange
    );
    suggestions.value = fetchedRestaurantsSuggestions.filter(
      (e) => e.id != props.currentId
    );
  } catch (e) {
    console.error("Failed to fetch restaurants:", e);
  }
}

watch(() => props.genres, fetchSuggestions);
watch(() => props.priceRange, fetchSuggestions);
watch(() => props.currentId, fetchSuggestions);

onMounted(fetchSuggestions);
</script>

<style scoped>
h3 {
  color: #f5ddc6;
  text-align: center;
  padding-top: 40px;
}
</style>
