<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const props = defineProps({
  coordinates: Array,
});

const mapContainer = ref(null);
const map = ref(null);

function initializeMap(coordinates) {
  if (map.value != null) {
    map.value.off();
    map.value.remove();
    map.value = null;
  }

  map.value = L.map(mapContainer.value).setView(
    [coordinates[1], coordinates[0]],
    13,
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map.value);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      L.Routing.control({
        waypoints: [
          L.latLng(position.coords.latitude, position.coords.longitude),
          L.latLng(coordinates[1], coordinates[0]),
        ],
        routeWhileDragging: true,
      }).addTo(map.value);
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    { enableHighAccuracy: true },
  );
}

watch(
  () => props.coordinates,
  (newCoordinates) => {
    if (newCoordinates && newCoordinates.length === 2) {
      initializeMap(newCoordinates);
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  nextTick(() => {
    if (props.coordinates && props.coordinates.length === 2) {
      initializeMap(props.coordinates);
    }
  });
});
</script>

<style scoped>
.map {
  height: 600px;
  width: 70%;
  margin: 0 auto;
}

::v-deep .leaflet-routing-container {
  font-size: 10px;
  max-height: 250px;
  overflow-y: auto;
}

@media (max-width: 820px) {
  .map {
    width: 90%;
  }
}

@media (max-width: 480px) {
  .map {
    height: 400px;
  }
  ::v-deep .leaflet-routing-container {
    max-height: 150px;
  }
}
</style>
