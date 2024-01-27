import { BASE_URL_UNSECURE } from "./restaurantApiURL";

const getUserId = () => JSON.parse(localStorage.getItem("user")).id;

export const getRestaurants = async () => {
  try {
    const response = await fetch(`${BASE_URL_UNSECURE}/restaurants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    });
    if (response.status != 200) {
      throw new Error("An error occurred");
    }

    const restaurants = await response.json();
    return restaurants.items;
  } catch (e) {
    console.log(e);
  }
};

export const getRestaurantsSuggestions = async (genres, priceRange) => {
  if (genres || priceRange) {
    try {
      let url = `${BASE_URL_UNSECURE}/restaurants?limit=4`;
      if (genres) {
        url += `&genres=${encodeURIComponent(genres)}`;
      }
      if (priceRange) {
        url += `&price_range=${encodeURIComponent(priceRange)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
      });

      if (response.status != 200) {
        throw new Error("An error occurred");
      }

      const restaurants = await response.json();
      return restaurants.items;
    } catch (e) {
      console.log(e);
    }
  }
};


export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await fetch(`${BASE_URL_UNSECURE}/restaurants/${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status != 200) {
      throw new Error(`Error fetching restaurant ${restaurantId}`);
    }

    const restaurant = await response.json();
    return restaurant;
  } catch (e) {
    console.log(e);
  }
};

export const postRestaurantVisit = async (
  restaurant_id,
  rating,
  date,
  comment,
) => {
  try {
    const response = await fetch(
      `${BASE_URL_UNSECURE}/users/${getUserId()}/restaurants/visits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_id: restaurant_id,
          comment: comment,
          rating: rating,
          date: date,
        }),
      },
    );

    await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const getVisitsByRestaurantId = async (restaurantId) => {
  try {
    const response = await fetch(
      `${BASE_URL_UNSECURE}/restaurants/${restaurantId}/visits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status != 200) {
      throw new Error(`Error fetching visits for restaurant  ${restaurantId}`);
    }
    const visits = await response.json();
    return visits.items;
  } catch (e) {
    console.log(e);
  }
};

export const getUserVisits = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL_UNSECURE}/users/${userId}/restaurants/visits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status != 200) {
      throw new Error(`Error fetching user's visits  ${restaurantId}`);
    }
    const visits = await response.json();
    return visits.items;
  } catch (e) {
    console.log(e);
  }
};
