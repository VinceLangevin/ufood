<template>
  <div class="w-100">
    <h3 class="mt-3">Favorite Restaurants</h3>
    <div v-if="props.isUserPageOwner">
      <strong>New List</strong>
      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="submitFavoritesList">
        <div class="form-group">
          <input
            type="text"
            class="form-control new-list-input"
            v-model="listName"
            placeholder="Enter list name"
          />
        </div>
        <button type="submit" class="btn btn-success btn-sm new-list-btn">
          Create List
        </button>
      </form>
    </div>

    <div v-if="allLists.length > 0" class="favorite-lists mt-3">
      <div class="d-flex favorites-section justify-content-start">
        <div v-if="isUserPageOwner">
          <favorite-list-item
            v-for="list in allLists"
            :is-user-page-owner="props.isUserPageOwner"
            :key="list.id"
            :list="list"
            :isSelected="selectedList && list.id === selectedList.id"
            @delete-list="deleteLastName"
            @update-list="saveListName"
            @select-list="selectList"
          />
        </div>
        <div v-else>
          <favorite-list-item
            v-for="list in allLists"
            :key="list.id"
            :list="list"
            :isSelected="selectedList && list.id === selectedList.id"
            @select-list="selectList"
          />
        </div>
        <div
          v-if="selectedList"
          :class="{ 'selected-list': selectedList }"
          style="flex-grow: 1; margin: 0 3rem"
        >
          <div
            v-if="detailedRestaurantList.length > 0"
            class="d-flex restaurant-container flex-wrap"
          >
            <div
              v-for="restaurant in detailedRestaurantList"
              :key="restaurant.id"
            >
              <restaurant-card :restaurant="restaurant" />
              <div
                v-if="isUserPageOwner"
                class="favorites-btn-section mb-3 w-100"
              >
                <button
                  @click="removeRestaurant(restaurant.id)"
                  class="btn btn-success"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import FavoriteListItem from "./FavoriteListItem.vue";
import RestaurantCard from "../RestaurantCards/RestaurantCard.vue";
import {
  createFavoritesList,
  deleteFavoriteList,
  updateFavoriteListName,
  removeRestaurantfromList,
} from "../../api/favorites.js";
import { getRestaurantById } from "../../api/restaurants";
import { getFavoriteLists } from "../../api/user";
import { validateTextInput } from "../Utils.js";

const listName = ref("");
const selectedList = ref(null);
const errorMessage = ref("");
const allLists = ref([]);
const detailedRestaurantList = ref([]);
const emit = defineEmits(["openRateModale"]);
const props = defineProps({
  isUserPageOwner: Boolean,
  user: Object,
});

const submitFavoritesList = async () => {
  errorMessage.value = "";
  try {
    validateTextInput(listName.value);
    const newList = await createFavoritesList(listName.value, props.user.email);
    allLists.value.push(newList);
    listName.value = "";
  } catch (error) {
    errorMessage.value = error.message || "An unexpected error occurred.";
  }
};

const getFavoritesList = async () => {
  try {
    const response = await getFavoriteLists(props.user.id);
    allLists.value = response.items;
  } catch (error) {
    errorMessage.value = error.message || "An unexpected error occurred.";
  }
};

const saveListName = async ({ id, name }) => {
  try {
    await updateFavoriteListName(id, name);
    const listIndex = allLists.value.findIndex((list) => list.id === id);
    if (listIndex !== -1) {
      allLists.value[listIndex].name = name;
    }
  } catch (error) {
    errorMessage.value = error.message || "An unexpected error occurred.";
  }
};

const deleteLastName = async (listId) => {
  try {
    await deleteFavoriteList(listId);
    allLists.value = allLists.value.filter((list) => list.id !== listId);
  } catch (error) {
    errorMessage.value = error.message || "An unexpected error occurred.";
  }
};

const selectList = async (list) => {
  selectedList.value = list;
  detailedRestaurantList.value = [];
  if (list.restaurants && list.restaurants.length > 0) {
    detailedRestaurantList.value = await Promise.all(
      list.restaurants.map((restaurant) => getRestaurantById(restaurant.id))
    );
  }
};

const removeRestaurant = async (restaurantId) => {
  try {
    await removeRestaurantfromList(selectedList.value.id, restaurantId);
    detailedRestaurantList.value = detailedRestaurantList.value.filter(
      (list) => list.id !== restaurantId
    );
  } catch (error) {
    errorMessage.value = error.message || "An unexpected error occurred.";
  }
};

onMounted(getFavoritesList);
</script>

<style scoped>
@media (max-width: 990px) {
  .favorite-lists .d-flex {
    flex-direction: column;
  }

  .selected-list {
    margin-top: 1rem;
    margin: 0 0 0 0 !important;
  }

  .restaurant-container {
    order: 3;
  }

  .favorites-section {
    padding: 0;
    flex-direction: column;
  }
}
.new-list-input {
  width: 18rem;
  border: 1px solid black;
  border-radius: 0.5rem 0.5rem 0.5rem 0;
}
.new-list-btn {
  border: 1px solid black;
  border-radius: 0 0 0.5rem 0.5rem;
}
.favorites-btn-section {
  margin-bottom: 20px;
}
.favorites-btn-section > .btn {
  border: 1px solid #000;
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
