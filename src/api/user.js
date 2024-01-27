import { BASE_URL, getUserToken } from "./restaurantApiURL";

export const createNewUser = async (data) => {
  const formData = new URLSearchParams(data).toString();
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (response.status === 401) {
    throw new Error("Email account already exists.");
  }

  if (response.status != 200) {
    throw new Error("An error occurred");
  }

  const result = await response.json();
  return result;
};

export const login = async (data) => {
  const formData = new URLSearchParams(data).toString();
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (response.status === 401) {
    throw new Error("Incorrect email or password.");
  }

  if (response.status != 200) {
    throw new Error("An error occurred");
  }

  const result = await response.json();
  return result;
};

export const logout = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      "Authorization": getUserToken(),
    },
  });

  if (response.ok) {
    console.log("Logout successful");
  } else {
    console.error("Logout failed:", response.status);
  }
};

export const getFavoriteLists = async (ownerId) => {
  const url = `${BASE_URL}/users/${ownerId}/favorites`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating favorites list:", error);
    throw error;
  }
};

export const getUserInfo = async (ownerId) => {
  const url = `${BASE_URL}/users/${ownerId}/`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating favorites list:", error);
    throw error;
  }
};

export const followUser = async (
  user_id,
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow`,
      {
        method: "POST",
        headers: {
          "Authorization": getUserToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user_id,
        }),
      },
    );

    await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const unfollowUser = async (
  user_id,
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/follow/${user_id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": getUserToken(),
          "Content-Type": "application/json",
        },
      },
    );

    await response.json();
    return response;
  } catch (e) {
    console.log(e);
  }
};
