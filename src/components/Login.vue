<template>
  <div class="container" v-if="!isLoggedIn">
    <div class="center-block middle">
      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
          <md-card-header>
            <h2 class="md-title">Login to GetchaPull !</h2>
          </md-card-header>

          <md-card-content>
            <div class="md-gutter">

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Username</label>
                  <md-input v-model="user.username" required @keyup.enter="submitLogIn"></md-input>
                </md-field>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Password</label>
                  <md-input v-model="user.password" type="password" required @keyup.enter="submitLogIn"></md-input>
                </md-field>
                <span v-if="infoError" class="md-error error-mine">Username/Password is invalid.</span>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-button @click.prevent="submitLogIn"
                           class="md-raised md-primary btn-lg btn-block"
                           :disabled="isProgressActive">
                  <span v-if="!isProgressActive">
                    Sign in
                  </span>
                  <span v-else>
                      <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
                  </span>
                </md-button>
              </div>

              <p class="create-acc text-center">
                Don't you have account? <router-link class="" to='/signup'>Create Account</router-link>
              </p>
            </div>
          </md-card-content>
        </md-card>
      </form>
    </div>
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
      isLoggedIn: false,
      isProgressActive: false,
      infoError: false,
    }
  },
  created() {
    if(localStorage.getItem('isLoggedIn')){
      this.isLoggedIn = localStorage.getItem('isLoggedIn');
      this.$router.push("/");
    }
  },
  methods: {
    submitLogIn() {
      this.isProgressActive = true;
      axios.post(this.$url + "/login", this.user)
      .then( (res) => {
        this.data = res.headers;
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user-token', this.data.authorization);
        localStorage.setItem('username', this.user.username);
        localStorage.setItem('expirationDate', new Date().addDays(14));
        this.$router.push("/");
      }).catch( (error) => {
        console.log(error.response.status);
        this.isProgressActive = false;
        this.infoError = true;
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
    margin-top: 100px;
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

  p, h2{
    padding-left: 15px;
  }

  .error-mine {
    color: red;
  }



</style>