<template>
  <div
    class="d-flex flex-column h-75 justify-content-center align-items-center"
  >
    <div>
      <h2 class="text-light pb-2">Login</h2>
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-group">
          <label for="email" class="text-light">Email</label>
          <input type="email" id="email" v-model="email" class="form-control" />
        </div>

        <div class="form-group">
          <label for="password" class="text-light">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
          />
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <button type="submit" class="btn button-yellow mt-3">Login</button>
      </form>
      <router-link class="nav-link text-light mt-2" to="/signUp">
        <p>
          Don't have an account?
          <span class="signup-link">Sign Up</span>
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/user";

const email = ref("");
const password = ref("");
const router = useRouter();
const errorMessage = ref(null);
const emit = defineEmits([
  'login',
])

const handleSubmit = async () => {
  const userData = {
    email: email.value,
    password: password.value,
  };
  try {
    const result = await login(userData);
    localStorage.setItem("user", JSON.stringify(result));
    localStorage.setItem("authToken", JSON.parse(localStorage.getItem('user')).token);
    router.push("/");
    emit('login');
  } catch (error) {
    email.value = "";
    password.value = "";
    errorMessage.value = error.message;
  }
};
</script>

<style>
.h-75 {
  margin-top: 200px;
}

.btn.button-yellow {
  background-color: #daa00f;
  color: #fff;
}

.form-container {
  padding: 1rem;
  border: 1px solid #000;
  border-radius: 0.5rem;
  background-color: #333;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 350px;
}

.signup-link {
  text-decoration: underline;
  font-weight: 600;
}

.error-message {
  color: red;
}
</style>
