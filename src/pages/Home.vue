<template>
  <div class="main-container">
    <home-header @update:restaurantNamesInHome="handleRestaurantNamesUpdate" />
    <div class="d-flex restaurants-section">
      <div class="p-5">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="swicthCarte"
            v-model="showMap"
          />
          <label class="form-check-label" for="swicthCarte"
            ><h5>Carte</h5></label
          >
        </div>
        <restaurant-filters :onFilterChange="handleFilterChange" />
      </div>

      <section class="w-100" v-if="!showMap">
        <div class="text-center pt-5" v-if="isLoading">
          <div class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <h2>Loading restaurants...</h2>
        </div>
        <div
          class="d-flex flex-wrap justify-content-center pt-5"
          v-else-if="filtered_restaurants && filtered_restaurants.length"
        >
          <restaurant-card
            v-for="restaurant in filtered_restaurants"
            :is-home-page="true"
            :key="restaurant.id"
            @open-rate-modale="
              (id) => {
                rateRestaurantId = id;
                rateModaleOpened = true;
              }
            "
            :restaurant="restaurant"
          ></restaurant-card>
        </div>
        <div class="text-center pt-5" v-else>
          <h2>No result</h2>
        </div>
      </section>
      <section class="w-100 h-100" v-else>
        <div class="p-5">
          <HomeMap
            :coordinates="filteredRestaurantCoordinates"
            :names="filteredRestaurantNames"
            :namesSearch="restaurantNamesInHome"
          />
        </div>
      </section>

      <rate-restaurant-modale
        v-if="rateModaleOpened"
        @close-modale="rateModaleOpened = false"
        @open-pop-up-modale="
          (message) => {
            popUpMessage = message;
            popUpOpened = true;
          }
        "
        :restaurant-id="rateRestaurantId"
      />
      <pop-up-modale
        v-if="popUpOpened"
        @close-pop-up="popUpOpened = false"
        :message="popUpMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from "vue";
import { getRestaurants } from "../api/restaurants.js";
import { getAllFilterTypes } from "../api/filters.js";
import RestaurantCard from "../components/RestaurantCards/RestaurantCard.vue";
import RestaurantFilters from "../components/RestaurantFilters.vue";
import RateRestaurantModale from "../components/Modales/RateRestaurantModale.vue";
import PopUpModale from "../components/Modales/PopUpModale.vue";
import HomeHeader from "../components/HomeHeader.vue";
import HomeMap from "../components/HomeMap.vue";

const restaurants = ref([]);
const rateRestaurantId = ref();
const filtered_restaurants = ref([]);
const isLoading = ref(true);
const rateModaleOpened = ref(false);
const showMap = ref(false);

const filterPrices = ref([1, 2, 3]);
const selectedPrices = reactive({});
const filterTypes = ref([]);
const selectedTypes = reactive({});
const filterRatings = ref([5, 4, 3, 2, 1]);
const selectedRatings = reactive({});
const restaurantNamesInHome = ref([]);
const popUpOpened = ref(false);

function handleRestaurantNamesUpdate(names) {
  restaurantNamesInHome.value = names;
}
const filteredRestaurantCoordinates = computed(() => {
  return filtered_restaurants.value.map(
    (restaurant) => restaurant.location.coordinates
  );
});
const filteredRestaurantNames = computed(() => {
  return filtered_restaurants.value.map((restaurant) => restaurant.name);
});

const handleFilterChange = (filters) => {
  const { selectedPrices, selectedTypes, selectedRatings } = filters;

  const selectedPriceValues = Object.keys(selectedPrices)
    .filter((key) => selectedPrices[key])
    .map(Number);
  const selectedTypeValues = Object.keys(selectedTypes).filter(
    (key) => selectedTypes[key]
  );
  const selectedRatingValues = Object.keys(selectedRatings)
    .filter((key) => selectedRatings[key])
    .map(Number);

  filtered_restaurants.value = restaurants.value.filter((restaurant) => {
    const matchesPrice =
      selectedPriceValues.length === 0 ||
      selectedPriceValues.includes(restaurant.price_range);
    const matchesType =
      selectedTypeValues.length === 0 ||
      selectedTypeValues.some((type) => restaurant.genres.includes(type));
    const matchesRating =
      selectedRatingValues.length === 0 ||
      selectedRatingValues.includes(Math.floor(restaurant.rating));

    return matchesPrice && matchesType && matchesRating;
  });
};

onMounted(async () => {
  try {
    const fetchedRestaurants = await getRestaurants();
    restaurants.value = fetchedRestaurants;
    filtered_restaurants.value = fetchedRestaurants;
  } catch (e) {
    console.error("Failed to fetch restaurants:", e);
  } finally {
    isLoading.value = false;
  }
});

filterPrices.value.forEach((range) => {
  selectedPrices[range] = false;
});

onMounted(async () => {
  try {
    const genres = await getAllFilterTypes();
    filterTypes.value = genres;
    genres.forEach((genre) => {
      selectedTypes[genre] = false;
    });
  } catch (e) {
    console.log(e);
  }
});

filterRatings.value.forEach((rating) => {
  selectedRatings[rating] = false;
});

watch(
  [selectedPrices, selectedTypes, selectedRatings],
  ([newValPrice, newValType, newValRating]) => {
    const getSelectedKeys = (obj, defaultValue) => {
      const selectedKeys = Object.keys(obj).filter((key) => obj[key]);
      return selectedKeys.length > 0 ? selectedKeys : defaultValue;
    };

    const priceFilterList = getSelectedKeys(newValPrice, ["1", "2", "3"]).map(
      Number
    );
    const typeFilterList = getSelectedKeys(newValType, filterTypes.value);
    const ratingFilterList = getSelectedKeys(
      newValRating,
      filterRatings.value
    ).map(Number);

    filtered_restaurants.value = restaurants.value.filter(
      (restaurant) =>
        priceFilterList.includes(restaurant.price_range) &&
        typeFilterList.some((el) => restaurant.genres.includes(el)) &&
        ratingFilterList.includes(Math.floor(restaurant.rating))
    );
  }
);
</script>

<style scoped>
.form-check-label {
  color: #eae0d5;
}
@media screen and (max-width: 990px) {
  .restaurants-section {
    flex-direction: column;
  }
}
</style>
