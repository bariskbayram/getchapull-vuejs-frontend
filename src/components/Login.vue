<template>
  <div class="container" v-if="!isLoggedIn">
    <div class="center-block middle">
      <h2 class="text-center">Login to GetchaPull !</h2>
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

    <button v-on:click="getSpotify">Spotify</button>

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
    getSpotify () {
      var client_id = '4cdcf550c1c7458485e09e5be020a556'; // Your client id
      var client_secret = '1e906cf6ef71436cb163ca98e619aead'; // Your secret
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
      };

      axios.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

          // use the access token to access the Spotify Web API
          var token = body.access_token;
          var options = {
            url: 'https://api.spotify.com/v1/users/jmperezperez',
            headers: {
              'Authorization': 'Bearer ' + token
            },
            json: true
          };
          axios.get(options, function(error, response, body) {
            console.log(body);
          });
        }
      })},
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