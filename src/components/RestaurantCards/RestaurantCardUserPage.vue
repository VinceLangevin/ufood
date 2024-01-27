<template>
  <div
    class="restaurant_card d-flex flex-column justify-content-start align-items-center"
  >
    <div
      class="restaurant_card_clickable d-flex flex-column align-items-center"
      @click="this.$router.push('/restaurant/' + props.restaurant.id)"
    >
      <div class="restaurant_image">
        <img
          :src="props.restaurant.pictures[2]"
          :alt="props.restaurant.name + ' Image'"
        />
      </div>

      <div class="restaurant_info">
        <h2>{{ props.restaurant.name }}</h2>
        <div>
          <span class="highlight">Address:</span>
          {{ props.restaurant.address }}
        </div>
        <div>
          <span class="highlight">Price Range:</span>
          {{ getFilterPriceName(props.restaurant.price_range) }}
        </div>
        <div>
          <span class="highlight">Genre:</span>
          {{ props.restaurant.genres.join(", ") }}
        </div>

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
      </div>
    </div>

    <div class="button_section">
      <button @click="viewReview" class="visitedBtn btn btn-success">
        View review
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getFilterPriceName } from "./Utils.js";

const ratingFloored = Math.floor(props.restaurant.rating);
const rating = props.restaurant.rating;

const visited = ref(false);

const isRatingModaleOpened = ref(false);

const emit = defineEmits(["openRateModaleReadOnly"]);

const props = defineProps({
  restaurant: Object,
});

function viewReview() {
  emit("openRateModaleReadOnly");
}
</script>

<style scoped>
.cardStars {
  color: rgba(51, 92, 28, 0.514) !important;
}

#cardRouterLink {
  text-decoration: none;
  color: black !important;
}

.restaurant_card_clickable:hover {
  background-color: #cfb8a6;
  cursor: pointer;
}
.restaurant_card_clickable {
  color: #000 !important;
  border: 1px solid #000;
  border-radius: 0.5rem;
  gap: 1rem;
  background-color: #cec6be;
  margin-bottom: 7px;
}

.visitedBtn {
  width: fit-content;
}

.rateBtn {
  width: fit-content;
}

.restaurant_info > h1 h2 h3 {
  overflow: hidden;
}

.restaurant_info > * {
  text-align: center;
  margin: 10px auto 10px auto;
}

.restaurant_info h2 {
  font-size: 22px;
  color: #5e503f !important;
}

.button_section {
  width: 100%;
  height: 100%;
}

.button_section > .btn {
  border: 1px solid #000;
  border-radius: 0.5rem;
}
</style>
