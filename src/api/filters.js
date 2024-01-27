import { getRestaurants } from "./restaurants";

export const getAllFilterTypes = async () => {
  const restaurants = await getRestaurants();
  const genresElements = [
    ...new Set(restaurants.map((item) => item.genres).flat()),
  ];
  return genresElements;
};
