<template>
  <div class="restaurant p-5">
    <div class="restaurant_info">
      <div class="restaurant_name">
        <h2>{{ restaurant.name }}</h2>
      </div>

      <RestaurantImages :images="images" />

      <div class="restaurant_flex_container">
        <div class="restaurant_details">
          <div>Genre: {{ genres }}</div>
          <div>
            Price Range: {{ getFilterPriceName(restaurant.price_range) }}
          </div>
          <div class="restaurant_reviews">
            <span>Reviews:&nbsp; </span>
            <div class="cardStars d-flex justify-content-center flex-row">
              <font-awesome-icon
                icon="fa-solid fa-star"
                v-for="star in ratingFloored"
                :key="star"
              />
              <font-awesome-icon
                icon="fa-solid fa-star-half-stroke"
                v-if="hasHalfStar"
              />
            </div>
          </div>
          <div>Address: {{ restaurant.address }}</div>
          <div>Phone: {{ restaurant.tel }}</div>
          <div v-html="hours"></div>

          <!-- <button
            @click="emit('openRateModale', restaurant.id)"
            class="rateBtn btn btn-success"
          > -->
          <button @click="openRatingModale" class="btn btn-success">
            Mark as visited
          </button>

          <button
            class="btn btn-primary"
            @click="toggleDropdown"
            v-if="isUserLoggedIn"
          >
            Add to Favorites
          </button>
          <button class="btn btn-primary" @click="addToFavorites" v-else>
            Add to Favorites
          </button>
          <LoginModale
            v-if="isLoginModaleOpened"
            @close-modale="isLoginModaleOpened = false"
          />

          <select
            v-show="showDropdown"
            v-model="selectedList"
            @change="addToFavorites"
          >
            <option value="" disabled>Select a list</option>
            <option v-for="list in allLists" :value="list.id" :key="list.id">
              {{ list.name }}
            </option>
          </select>
          <div v-if="feedbackMessage" class="feedback-message">
            {{ feedbackMessage }}
          </div>
        </div>
      </div>
    </div>
    <rate-restaurant-modale
      v-if="rateModaleOpened"
      @close-modale="rateModaleOpened = false"
      @open-pop-up-modale="
        (message) => {
          popUpMessage = message;
          popUpOpened = true;
        }
      "
      :restaurant-id="restaurant.id"
    />
    <pop-up-modale
      v-if="popUpOpened"
      @close-pop-up="popUpOpened = false"
      :message="popUpMessage"
    />
    <div><Map :coordinates="restaurantCoordinates" /></div>
    <div>
      <SuggestionsContainer
        :genres="genres"
        :priceRange="restaurant.price_range"
        :currentId="restaurant.id"
      />
    </div>
  </div>
</template>

<script setup>
import { getUserToken } from "../api/restaurantApiURL";
import { getFilterPriceName } from "../components/Utils.js";
import RestaurantImages from "../components/RestaurantImages.vue";
import Map from "../components/Map.vue";
import SuggestionsContainer from "../components/suggestions/SuggestionsContainer.vue";

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getRestaurantById } from "../api/restaurants.js";
import { getFavoriteLists } from "../api/user.js";
import { addRestaurantToFavoritesList } from "../api/favorites.js";
import LoginModale from "../components/Modales/LoginModale.vue";
import RateRestaurantModale from "../components/Modales/RateRestaurantModale.vue";
import PopUpModale from "../components/Modales/PopUpModale.vue";

const route = useRoute();
const restaurantId = ref(route.params.id);
const restaurant = ref({});
const isLoading = ref(true);
const showDropdown = ref(false);
const selectedList = ref("");
const allLists = ref([]);
const isLoginModaleOpened = ref(false);
const rateModaleOpened = ref(false);
const popUpOpened = ref(false);

const emit = defineEmits(["openRateModale"]);
const feedbackMessage = ref("");
const userData = JSON.parse(localStorage.getItem("user"));

const toggleDropdown = () => {
  if (isUserLoggedIn.value) {
    showDropdown.value = !showDropdown.value;
  } else {
    window.alert("Please log in before adding to favorites.");
  }
};

onMounted(async () => {
  try {
    const fetchedRestaurant = await getRestaurantById(restaurantId.value);
    restaurant.value = fetchedRestaurant;
  } catch (e) {
    console.error("Failed to fetch restaurants:", e);
  } finally {
    isLoading.value = false;
  }
});

const ratingFloored = computed(() => {
  const floored = Math.floor(restaurant.value.rating);
  return Number.isInteger(floored) ? floored : 0;
});

const hasHalfStar = computed(() => {
  return restaurant.value.rating % 1 > 0.5;
});

const images = computed(() => {
  return restaurant.value.pictures && restaurant.value.pictures.length
    ? restaurant.value.pictures
    : [];
});

const genres = computed(() => {
  return restaurant.value.genres ? restaurant.value.genres.join(", ") : "";
});

const hours = computed(() => {
  if (!restaurant.value || typeof restaurant.value.opening_hours !== "object") {
    return "Closed";
  }

  const hoursArray = Object.entries(restaurant.value.opening_hours).map(
    ([day, time]) => `${day}: ${time ? time : "Closed"}`
  );

  return hoursArray.join("<br>");
});

const restaurantCoordinates = computed(() => {
  if (
    restaurant.value &&
    restaurant.value.location &&
    restaurant.value.location.coordinates
  ) {
    return restaurant.value.location.coordinates;
  }
  return null;
});

const getFavoritesList = async () => {
  try {
    if (userData && userData.id) {
      const response = await getFavoriteLists(userData.id);
      allLists.value = response.items;
    } else {
      return;
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des listes de favoris:",
      error
    );
  }
};

onMounted(() => {
  getFavoritesList();
});

const isUserLoggedIn = computed(() => {
  const userToken = getUserToken();
  return Boolean(userToken);
});

const addToFavorites = async () => {
  const userToken = getUserToken();
  if (!userToken) {
    // window.alert('Please log in before adding to favorites.');
    // return;
    isLoginModaleOpened.value = true;
  }

  try {
    await addRestaurantToFavoritesList(selectedList.value, restaurantId.value);
    feedbackMessage.value = "Restaurant added to favorites!";
    setTimeout(() => (feedbackMessage.value = ""), 3000);
    toggleDropdown();
    selectedList.value = "";
  } catch (error) {
    feedbackMessage.value = "Failed to add restaurant to favorites.";
    setTimeout(() => (feedbackMessage.value = ""), 3000); // Reset after 3 seconds
  }
};

// Ajout de la fonction pour ouvrir la modale avec la vérification d'authentification
function openRatingModale() {
  const userToken = getUserToken();
  if (userToken) {
    rateModaleOpened.value = true;
  } else {
    // window.alert('Please log in to rate this restaurant.');
    //router.push({ name: 'Login' });
    isLoginModaleOpened.value = true;
  }
}
</script>

<style scoped>
.restaurant {
  /*background-image: url("https://images.unsplash.com/photo-1678924587662-d8c63e57eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80");
  background-size: cover;*/
}

.restaurant_info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.restaurant_name {
  white-space: nowrap;
  width: 70%;
  margin-top: 20px;
}

.restaurant_name h2 {
  color: #f5ddc6;
  font-size: 4vw;
}

.restaurant_flex_container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 70%;
  margin-bottom: 20px;
  color: #0a0908;
}

.restaurant_details {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 10px solid transparent;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.5);
  gap: 10px;
  position: relative;
}

.restaurant_reviews {
  display: flex;
  align-items: center;
}

@media (max-width: 820px) {
  .restaurant_name {
    width: 90%;
  }
  .restaurant_flex_container {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .restaurant_name h2 {
    font-size: 5vw;
  }
}
</style>
