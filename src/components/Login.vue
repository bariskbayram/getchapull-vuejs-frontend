<template>
  <div class="container-form">
    <div class="media-box">
      <div>
        <h1>Welcome Back</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, molestiae?</p>
      </div>
    </div>
    <form novalidate class="form-box">
      <div class="form-inputs">
        <div class="form-header">
          <h1>Login</h1>
          <p>Please Login to Continue</p>
        </div>
        <div class="input-section">
          <label class="with-input-border">Username</label>
          <input type="text" v-model="user.username" autofocus=""/>
        </div>
        <div class="input-section">
          <label class="with-input-border">Password</label>
          <input type="password" v-model="user.password" />
        </div>
        <span v-if="infoError" class="error">Username/Password is invalid.</span>
        <a href="#">Forget Password?</a>
        <div class="submit-section">
          <button
              class="btn-blue btn-big-grow"
              @click.prevent="submitLogIn"
              :disabled="isProgressActive">
            <div v-if="!isProgressActive">Login</div>
            <div v-else class="spinner-loader">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
              <div class="rect6"></div>
              <div class="rect7"></div>
              <div class="rect8"></div>
            </div>
          </button>
          <router-link to='/signup'>
            <button class="btn-gray btn-small-grow">Create Account</button>
          </router-link>
        </div>
      </div>
      <div class="login-with">
        <div class="border-with-label">
          <label>Or</label>
          <hr>
        </div>
        <div class="social-media">
          <p>Continue with social media.</p>
          <div class="logos">
            <ul>
              <li><a href="#"><i class="fab fa-facebook"></i></a></li>
              <li><a href="#"><i class="fab fa-twitter"></i></a></li>
              <li><a href="#"><i class="fab fa-google"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </form>
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

  methods: {
    //Burası düzenlenecek userId de localstorage tutulcak fakat localstorage tutmak mantıklı mı bilmiyorum
    // aynı zamanda expirationDate muhabbeti çalışmıyor
    submitLogIn() {
      this.isProgressActive = true;
      axios.post(this.$url + "/login", this.user)
      .then( (res) => {
        this.data = res.headers;
        console.log(res)
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userToken', this.data.authorization);
        localStorage.setItem('username', this.user.username);
        localStorage.setItem('expirationDate', new Date().addDays(14));
        this.$router.push("/");
      }).catch( (error) => {
        console.log(error.response.status);
        this.isProgressActive = false;
        this.infoError = true;
      })
    }
  },
  created() {
    if(localStorage.getItem('isLoggedIn')){
      this.isLoggedIn = localStorage.getItem('isLoggedIn');
      this.$router.push("/");
    }else {
      document.querySelector('body').classList.remove('white-background');
      document.querySelector('body').classList.add('red-background');
    }
  }
}
</script>

<style scoped>

.btn-blue{
  padding-top: 2px;
  padding-bottom: 2px;
}

.container-form .media-box::before {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.container-form .form-box {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.container-form .form-box .form-inputs {
  flex-grow: 5;
}

@media(max-width: 500px){
  .container-form .form-box {
    border-top-right-radius: 0;
    border-bottom-left-radius: 15px;
  }

  .container-form .media-box::before {
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
  }
}


</style>