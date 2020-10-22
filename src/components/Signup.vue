<template>
  <div class="container">
    <div class="center-block middle">
      <h2 class="text-center">Sign up to MetalReviews</h2>
      <p>
        <input type="text" v-model="user.fullname" class="form-control" placeholder="Full name" required="">
      </p>
      <p>
        <input type="text" v-model="user.username" class="form-control" placeholder="Username" required="" autofocus="">
      </p>
      <p>
        <input type="password" v-model="user.password" class="form-control" placeholder="Password" required="">
      </p>
      <button class="btn btn-lg btn-primary btn-block" v-on:click="submitSignUp" v-on:keyup.enter="submitSignUp" >Sign up</button>
    </div>
  </div>
</template>

<script>

const axios = require('axios').default;

export default {
  name: "Signup",
  data () {
    return {
      user: {
        username: '',
        password: '',
        fullname: ''
      }
    }
  },
  methods: {
    submitSignUp () {
      axios.post("https://metal-review-spring.herokuapp.com/api/user-profiles/signup", this.user)
      .then( res => {
        console.log(res);
        this.$router.push("/login");
      })
    }
  }
}
</script>

<style scoped>
body{
  background-color: aqua;
  color: blue;
}
.middle{
  width: fit-content;
  mso-vertical-page-align: middle;
  margin-top: 190px;
}

input{
  margin-top: 20px;
}

button{
  margin-top: 30px;
}

</style>