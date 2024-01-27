<template>
  <div
    class="d-flex flex-column h-75 justify-content-center align-items-center"
  >
    <h2 class="text-light">Sign Up</h2>
    <form
      @submit.prevent="handleSubmit"
      class="p-5 border border-dark rounded bg-dark d-flex flex-column"
      style="gap: 1rem; min-width: 350px"
    >
      <div class="form-group">
        <label for="name" class="text-light">Name</label>
        <input type="text" id="name" v-model="name" class="form-control" />
      </div>

      <div class="form-group">
        <label for="email" class="text-light">Email</label>
        <input type="email" id="email" v-model="email" class="form-control" />
      </div>

      <div class="form-group">
        <label for="password" class="text-light">New Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
        />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="btn button-yellow mt-3">Sign Up</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createNewUser } from "../api/user.js";

export default {
  name: "SignupForm",
  setup(props, { emit }) {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const errorMessage = ref(null);

    const handleSubmit = async () => {
      const userData = {
        name: name.value,
        email: email.value,
        password: password.value,
      };
      try {
        const result = await createNewUser(userData);
        localStorage.setItem("user", JSON.stringify(result));
        // emit("asLoggedIn", {
        //   isLoggedIn: true,
        // });
        router.push("/login");
      } catch (error) {
        name.value = "";
        email.value = "";
        password.value = "";
        errorMessage.value = error.message;
      }
    };

    return {
      name,
      email,
      password,
      handleSubmit,
      errorMessage,
    };
  },
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

.error-message {
  color: red;
}
</style>
