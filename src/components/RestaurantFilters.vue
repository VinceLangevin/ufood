<template>
  <div class="accordion" id="accordionFilters">
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <h6 class="mb-0">Filters</h6>
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse show"
        data-bs-parent="#accordionFilters"
      >
        <div class="accordion-body">
          <div class="pb-3">
            <button class="clear-filters" @click="clearFilters">
              <font-awesome-icon icon="fa-solid fa-xmark" /> Clear Filters
            </button>
          </div>
          <h6>Price</h6>
          <div v-for="price in filterPrices" :key="price" class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :value="price"
              :id="`filterPrices${price}`"
              v-model="selectedPrices[price]"
            />
            <label :for="`filterPrices${price}`" class="form-check-label">
              {{ getFilterPriceName(price) }}
            </label>
          </div>

          <hr />
          <h6>Cuisine / Food Types</h6>

          <div
            v-for="(type, index) in filterTypes"
            :key="index"
            class="form-check"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="type"
              :id="`filterTypes${index + 1}`"
              v-model="selectedTypes[type]"
            />
            <label :for="`filterTypes${index + 1}`" class="form-check-label">
              {{ type }}
            </label>
          </div>

          <hr />
          <h6>Ratings</h6>

          <div v-for="rating in filterRatings" :key="rating" class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :value="rating"
              :id="`filterRatings${rating}`"
              v-model="selectedRatings[rating]"
            />
            <label :for="`filterRatings${rating}`" class="form-check-label">
              <font-awesome-icon
                v-for="n in rating"
                :key="n"
                icon="fa-solid fa-star"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { getAllFilterTypes } from "../api/filters.js";

const props = defineProps({
  onFilterChange: Function,
});

const filterPrices = ref([1, 2, 3]);
const selectedPrices = reactive({});
const filterTypes = ref([]);
const selectedTypes = reactive({});
const filterRatings = ref([5, 4, 3, 2, 1]);
const selectedRatings = reactive({});

filterPrices.value.forEach((price) => {
  selectedPrices[price] = false;
});
filterRatings.value.forEach((rating) => {
  selectedRatings[rating] = false;
});

onMounted(async () => {
  try {
    const genres = await getAllFilterTypes();
    filterTypes.value = genres;
    genres.forEach((genre) => {
      selectedTypes[genre] = false;
    });
  } catch (e) {
    console.error("Failed to fetch filter types:", e);
  }
});

const clearFilters = () => {
  for (const price in selectedPrices) {
    selectedPrices[price] = false;
  }
  for (const type in selectedTypes) {
    selectedTypes[type] = false;
  }
  for (const rating in selectedRatings) {
    selectedRatings[rating] = false;
  }
};

const getFilterPriceName = (price) => {
  switch (price) {
    case 1:
      return "Cheap";
    case 2:
      return "Moderate";
    case 3:
      return "Expensive";
    default:
      return "";
  }
};

watch([selectedPrices, selectedTypes, selectedRatings], () => {
  props.onFilterChange({ selectedPrices, selectedTypes, selectedRatings });
});
</script>
<style scoped>
.form-check-label {
  font-size: 14px;
  color: #0a0908;
}
.clear-filters {
  font-size: 14px;
}
.accordion {
  border-radius: 0.5rem;
  min-width: 250px;
}
.accordion-item {
  border: 1px solid black;
  background-color: #eae0d5;
}
.accordion-button,
.accordion-button:not(.collapsed) {
  background-color: #5e503f;
  color: #eae0d5;
}
</style>
