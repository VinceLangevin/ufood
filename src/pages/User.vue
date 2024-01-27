<template>
  <div v-if="!isLoading" class="user-container d-flex justify-content-center">
    <div class="user-section d-flex flex-column align-items-center">
      <button
        v-if="!isUserPageOwner && !isFollowed"
        @click="followUser"
        class="btn btn-success"
      >
        Follow
      </button>
      <button
        v-else-if="!isUserPageOwner && isFollowed"
        @click="unfollowUser"
        class="btn btn-success"
      >
        Unfollow
      </button>
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
      <hr />
      <h4><font-awesome-icon icon="fa-solid fa-star" /> {{ user.rating }}</h4>
      <hr />

      <section class="followers-section">
        <h2>Followers</h2>
        <ul v-if="user.followers && user.followers.length > 0">
          <li v-for="follower in user.followers" :key="follower.id">
            <router-link :to="{ name: 'User', params: { id: follower.id } }">
              {{ follower.name }}
            </router-link>
          </li>
        </ul>
        <p v-else>No followers found.</p>
      </section>

      <section class="following-section">
        <h2>Following</h2>
        <ul v-if="user.following && user.following.length > 0">
          <li v-for="followed in user.following" :key="followed.id">
            <router-link :to="{ name: 'User', params: { id: followed.id } }">
              {{ followed.name }}
            </router-link>
          </li>
        </ul>
        <p v-else>No following found.</p>
      </section>

      <div
        v-if="!isLoading && restaurants.length > 0"
        class="cardContainer d-flex flex-row flex-wrap pt-3 justify-content-center"
      >
        <restaurant-card
          v-for="(visit, index) in visits"
          :key="visit.id"
          :restaurant="restaurants[index]"
          :is-user-page="true"
          @open-rate-modale-read-only="viewReview(visit)"
        />
      </div>
      <div
        class="d-flex flex-column justify-content-center"
        v-else-if="!isLoading && restaurants.length == 0"
      >
        <p class="pt-2">No restaurant recently visited</p>
        <router-link class="nav-link" to="/">
          <button class="btn btn-success back-button">See all restaurants</button>
        </router-link>
      </div>

      <hr />
      <section v-if="!isLoading" class="d-flex w-100 justify-content-start">
        <FavoriteContainer :is-user-page-owner="isUserPageOwner" :user="user" />
      </section>
    </div>

    <rate-restaurant-modale-read-only
      v-if="rateModaleOpened"
      :visit="review"
      @close-modale="rateModaleOpened = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, watch } from "vue";
import { useRoute } from "vue-router";
import * as api from "../api/restaurants";
import * as apiUser from "../api/user";
import FavoriteContainer from "../components/favorites/FavoriteContainer.vue";
import RestaurantCard from "../components/RestaurantCards/RestaurantCard.vue";
import RateRestaurantModaleReadOnly from "../components/Modales/RateRestaurantModaleReadOnly.vue";

const route = useRoute();
const selectedValue = ref("1");
const visits = ref([]);
const restaurants = ref([]);
const rateModaleOpened = ref(false);
const review = ref({});
const isLoading = ref(true);
const user = ref({});
const isUserPageOwner = ref(false);
const isFollowed = ref(false);
const loggedUser = ref(JSON.parse(localStorage.getItem("user")));

onMounted(() => {
  userPageSetup(route.params.id);
});

watch(
  () => route.params.id,
  (newVal, oldVal) => {
    userPageSetup(newVal);
  }
);

async function userPageSetup(userID) {
  try {
    isLoading.value = true;
    user.value = await apiUser.getUserInfo(userID);
    const fetchedVisits = await api.getUserVisits(userID);
    visits.value = fetchedVisits;
    const tempRestaurants = await getRestaurantsAsync(fetchedVisits);
    restaurants.value = tempRestaurants;

    isUserPageOwner.value = checkIfUserPageOwner();
    if (!isUserPageOwner.value) {
      isFollowed.value = loggedUser.value.following.some(
        (cuser) => cuser.id == user.value.id
      );
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  } finally {
    selectedValue.value = "1";
    isLoading.value = false;
  }
}

async function getRestaurantsAsync(visits) {
  let tempRestaurants = [];

  const apiPromises = visits.map((visit) => {
    return api.getRestaurantById(visit.restaurant_id).then((data) => {
      return data;
    });
  });

  try {
    tempRestaurants = await Promise.all(apiPromises);
  } catch (error) {
    console.error("Error fetching restaurants", error);
  }

  return tempRestaurants;
}

async function followUser() {
  try {
    const follow = await apiUser.followUser(user.value.id);
  } catch {
    throw new Error("error trying to follow user");
  } finally {
    const result = await apiUser.getUserInfo(loggedUser.value.id);
    localStorage.setItem("user", JSON.stringify(result));
    isFollowed.value = true;
  }
}

async function unfollowUser() {
  try {
    const unfollow = await apiUser.unfollowUser(user.value.id);
  } catch {
    throw new Error("error trying to unfollow user");
  } finally {
    const result = await apiUser.getUserInfo(loggedUser.value.id);
    localStorage.setItem("user", JSON.stringify(result));
    isFollowed.value = false;
  }
}

function viewReview(visit) {
  review.value = visit;
  rateModaleOpened.value = true;
}

function checkIfUserPageOwner() {
  if (localStorage.getItem("user") != null) {
    if (JSON.parse(localStorage.getItem("user")).id == user.value.id) return true;
    else return false;
  }
}
</script>

<style>
.user-section {
  width: 80%;
  color: rgb(237, 223, 217);
}

.select-box {
  display: inline-block;
}

.cardContainer {
  width: auto;
}

.user-section {
  padding: 3rem !important;
}

.back-button {
  width: 100%;
}

@media (max-width: 990px) {
  .user-section {
    padding: 1rem !important;
  }
}
</style>
