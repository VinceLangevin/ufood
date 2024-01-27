<template>
  <div class="position-relative test">
    <div class="d-flex flex-row">
      <input
        class="form-control restaurantInput"
        type="search"
        placeholder="Search for Restaurant"
        v-model="restaurantInput"
        aria-label="Search"
        @input="handleInputChange"
      />
      <button @click="searchRestaurant" class="btn btn-success searchBtn">Search</button>
    </div>

    <div class="userResultsContainer" v-if="isOpened">
      <div v-if="matchedRestaurants.length > 0">
        <div
          v-for="restaurant in matchedRestaurants"
          :key="restaurant"
          class="restaurantResult"
        >
          <span class="alt-font" @click="selectRestaurant(restaurant)">{{
            restaurant.name
          }}</span>
        </div>
      </div>

      <div v-if="matchedRestaurants.length === 0 && restaurantInput.length !== 0">
        <span class="not-found-message">Nothing Found</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getRestaurants } from "../../api/restaurants.js";
import { useRouter } from "vue-router";

const restaurantInput = ref("");
const matchedRestaurants = ref([]);
const isOpened = ref(true);
const selectedRestaurant = ref(null);
const router = useRouter();
const restaurantNames = ref([]);
const emits = defineEmits(["updateRestaurantNames"]);

async function searchRestaurant() {
  try {
    const data = await getRestaurants(restaurantInput.value);

    if (data.length > 0) {
      matchedRestaurants.value = data.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(restaurantInput.value.toLowerCase())
      );
      restaurantNames.value = matchedRestaurants.value.map((r) => r.name);
      isOpened.value = matchedRestaurants.value.length > 0;
    } else {
      matchedRestaurants.value = [];
      isOpened.value = false;
    }
    emits("updateRestaurantNames", restaurantNames.value);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

onMounted(() => {
  document.addEventListener("click", (e) => handleDocumentClick(e));
});
onBeforeUnmount(() => {
  document.removeEventListener("click", (e) => handleDocumentClick(e));
});

function handleDocumentClick(e) {
  const input = document.querySelector("restaurantInput");
  if (e.target != input) isOpened.value = false;
  else isOpened.value = true;
}
function handleSearchInputClick() {
  if (matchedUsers.value.length > 0) {
    isOpened.value = true;
  }
}

function handleInputChange() {
  if (restaurantInput.value.length > 0) {
    searchRestaurant();
  } else {
    matchedRestaurants.value = [];
    restaurantNames.value = [];
    emits("updateRestaurantNames", restaurantNames.value);
    isOpened.value = false;
  }
}

function selectRestaurant(restaurant) {
  restaurantInput.value = restaurant.name;
  selectedRestaurant.value = restaurant;

  isOpened.value = false;
  router.push({ name: "Restaurant", params: { id: restaurant.id } });
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 10px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  transition: border-color 0.3s;
}
.search-input:focus {
  border-color: #007bff;
  outline: none;
}
.userResultsContainer {
  cursor: pointer;
}

.restaurantResult {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  color: #000;
  transition: background-color 0.3s;
}
.restaurantResult:hover {
  background-color: #f4f1f1;
  color: #100f0f;
}
</style>
