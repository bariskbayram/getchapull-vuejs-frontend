<template>
  <div class="container" v-if="!isLoggedIn">
    <div class="center-block middle">
      <h2 class="text-center">Login to MetalReviews</h2>
      <p>
        <input type="text" v-model="user.username" class="form-control" placeholder="Username" required="" autofocus="">
      </p>
      <p>
        <input type="password" v-model="user.password" class="form-control" placeholder="Password" required="" v-on:keyup.enter="submitLogIn">
      </p>
      <button class="btn btn-lg btn-primary btn-block" v-on:click="submitLogIn" >Sign in</button>
    </div>
    <p class="create-acc text-center">
      Don't you have account? <router-link class="" to='/signup'>Create Account</router-link>
    </p>

  </div>
</template>

<script>

const axios = require('axios').default;

export default {
  name: "Login.vue",
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      data: {},
      isLoggedIn: false
    }
  },
  created() {
    if(localStorage.getItem('isLoggedIn')){
      this.isLoggedIn = localStorage.getItem('isLoggedIn');
      this.$router.push("/" + localStorage.getItem('username'));
    }
  },
  methods: {
    submitLogIn() {
      axios.post('https://metal-review-spring.herokuapp.com/login', this.user)
      .then( (res) => {
        this.data = res.headers;
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user-token', this.data.authorization);
        localStorage.setItem('username', this.user.username);
        this.$router.push("/" + this.user.username);
      }).then( (error) => {
        console.log(error)
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
    margin-top: 150px;
  }

  .create-acc{
    font-size: 20px;
    margin-top: 30px;
  }

  input{
    margin-top: 20px;
  }

  button{
    margin-top: 20px;
  }



</style>