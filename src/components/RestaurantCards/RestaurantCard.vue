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
      <div class="restaurant_info alt-font">
        <div class="overflowable">
          <h2>{{ props.restaurant.name }}</h2>
        </div>
        <div>
          <span class="highlight">Address:</span>
          <div class="overflowable">
            <p>{{ props.restaurant.address }}</p>
          </div>
        </div>
        <div>
          <span class="highlight">Price Range:</span>
          <div class="overflowable">
            <p>{{ getFilterPriceName(props.restaurant.price_range) }}</p>
          </div>
        </div>
        <div>
          <span class="highlight">Genre:</span>
          <div class="overflowable">
            <p>{{ props.restaurant.genres.join(", ") }}</p>
          </div>
        </div>
        <RatingStars :rating="props.restaurant.rating" />
      </div>
    </div>

    <div v-if="isHomePage" class="button_section mb-3 w-100">
      <button @click="openRatingModale" class="btn btn-success">
        Mark as visited
      </button>
    </div>
    <div v-else-if="isUserPage" class="button_section mb-3 w-100">
      <button @click="emit('openRateModaleReadOnly')" class="btn btn-success">
        View review
      </button>
    </div>

    <!-- Vérification pour afficher la modale -->
    <LoginModale
      v-if="isLoginModaleOpened"
      @close-modale="isLoginModaleOpened = false"
    />

  </div>
</template>

<script setup>
import { getUserToken } from "../../api/restaurantApiURL.js";
import RateRestaurantModale from "../Modales/RateRestaurantModale.vue";
import LoginModale from "../Modales/LoginModale.vue";
import { onMounted, onUpdated, ref, watch } from "vue";
import { getFilterPriceName } from "../Utils.js";
import RatingStars from "../RatingStars.vue";

const visited = ref(false);
const localStoragePopulated = ref(false);
const isLoginModaleOpened = ref(false);
const emit = defineEmits([
  "openRateModale",
  "openRateModaleReadOnly",
]);
const props = defineProps({
  readOnly: Boolean,
  restaurant: Object,
  isUserPage: Boolean,
  isHomePage: Boolean,
});

function setVisited() {
  visited.value = true;
}
// Ajout de la fonction pour ouvrir la modale avec la vérification d'authentification
function openRatingModale() {
  const userToken = getUserToken();
  if (userToken) {
    emit('openRateModale', props.restaurant.id)
  } else {
    // window.alert('Please log in to rate this restaurant.');
    //router.push({ name: 'Login' });
    isLoginModaleOpened.value = true;
  }
}

</script>

<style scoped>
.restaurant_card {
  position:relative;
  max-width: 325px;
  height: fit-content;
  margin-right: 15px;
}
.restaurant_card_clickable {
  max-width: 100%;
  border: 1px solid #000;
  border-radius: 0.5rem 0.5rem 0.5rem 0;
  background-color: #EAE0D5;
}
.restaurant_card_clickable:hover {
  background-color: #C6AC8F;
  cursor: pointer;
}

.restaurant_image {
  width: 100%;
  height: 200px;
}
.restaurant_image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.3s;
  border-radius: 0.5rem 0.5rem 0 0;
}

.overflowable{
  max-width: 100%;
}
.overflowable > *{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.restaurant_info{
  max-width: 100%;
  padding: 1rem;
}
.restaurant_info p {
  color: rgb(192, 68, 6);
}
.restaurant_info > h1 h2 h3 {
  overflow: hidden;
}
.restaurant_info > * {
  text-align: center;
}
.restaurant_info h2 {
  font-size: 22px;
  color: #0A0908;
}
.highlight {
  color: #0A0908;
  font-weight: bold;
  font-size: 1em;
}

.button_section {
  margin-bottom: 20px;
}
.button_section > .btn {
  width: fit-content;
  border: 1px solid #000;
  border-radius: 0 0 0.5rem 0.5rem;
}

@media screen and (max-width: 990px) {
  .restaurant_card {
  margin-left: 15px;
  }
}

</style>
