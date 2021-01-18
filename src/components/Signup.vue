<template>
  <div class="container-form">
    <div class="media-box">
      <div>
        <h1>Join Us</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam, molestiae?</p>
      </div>
    </div>
    <form novalidate class="form-box">
      <div class="form-inputs">
        <div class="form-header">
          <h1>Singup</h1>
        </div>
        <div class="input-section">
          <label class="with-input-border">Fullname</label>
          <input type="text" v-model="user.fullname" autofocus=""/>
        </div>
        <span v-if="isFullnameError" class="error">Fullname's length must be more than 5.</span>
        <div class="input-section">
          <label class="with-input-border">Username</label>
          <input type="text" v-model="user.username"/>
        </div>
        <span v-if="isUsernameError" class="error">Invalid username/Exists.</span>
        <div class="input-section">
          <label class="with-input-border">Email</label>
          <input type="email" v-model="user.email"/>
        </div>
        <span v-if="isEmailError" class="error">Invalid email/Exists.</span>
        <div class="input-section">
          <label class="with-input-border">Password</label>
          <input type="password" v-model="user.password"/>
        </div>
        <span v-if="isPasswordError" class="error">Password's length must be more than 5.</span>
        <div class="input-section">
          <label class="with-input-border">Password Confirm</label>
          <input type="password" v-model="passwordConfirm"/>
        </div>
        <span v-if="isPasswordConfirmError" class="error">Password confirmation is failed.</span>
        <div class="submit-section">
          <button
              class="btn-blue btn-big-grow"
              @click.prevent="validateForm"
              :disabled="isProgressActive">
            <div v-if="!isProgressActive">Create Account</div>
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
          <router-link to='/login'>
            <button class="btn-gray btn-small-grow">Login</button>
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
  name: "Signup",
  data() {
    return {
      user: {
        fullname: '',
        username: '',
        email: '',
        password: ''
      },
      passwordConfirm: '',
      isProgressActive: false,
      isFullnameError: false,
      isUsernameError: false,
      isEmailError: false,
      isPasswordError: false,
      isPasswordConfirmError: false
    }
  },
  methods: {
    validateForm () {
      console.log("validate çalişti")
      this.checkFullname();
    },

    checkFullname() {
      if(this.user.fullname.length < 4){
        this.isFullnameError = true;
      }else{
        this.isFullnameError = false;
        this.checkUsername();
      }
    },

    checkUsername() {
      if(this.user.username.length < 4){
        this.isUsernameError = true;
      }else{
        this.isUsernameError = false;
        this.checkUsernameIsExist();
      }
    },

    checkUsernameIsExist(){
      axios.get(this.$url + "/api/v1/users/check_username_exist", {
        params: {
          username: this.user.username
        }
      }).then( (res) => {
        if(res.data == true){
          this.isUsernameError = true;
        }else{
          this.checkEmail();
        }
      })
    },

    checkEmail() {
      if(this.user.email.length < 4 || !this.user.email.includes("@")){
        this.isEmailError = true;
      }else{
        this.isEmailError = false;
        this.checkEmailIsExist();
      }
    },

    checkEmailIsExist(){
      axios.get(this.$url + "/api/v1/users/check_email_exist", {
        params: {
          email: this.user.email
        }
      }).then( (res) => {
        if(res.data == true){
          this.isEmailError = true;
        }else{
          this.checkPassword();
        }
      })
    },

    checkPassword() {
      if(this.user.password.length < 5){
        this.isPasswordError = true;
      }else if(this.user.password != this.passwordConfirm) {
        this.isPasswordConfirmError = true;
      }else{
        this.isPasswordError = false;
        this.isPasswordConfirmError = false;
        this.submitSignUp();
      }
    },

    submitSignUp() {
      this.isProgressActive = true;
      axios.post(this.$url + "/api/v1/users/signup", this.user)
          .then(() => {
            this.$router.push("/login");
          })
    }
  },
  created() {
    document.querySelector('body').classList.remove('white-background');
    document.querySelector('body').classList.add('red-background');
  }
}
</script>

<style scoped>

body {
  background: rgb(119, 42, 42);
}

.container-form .media-box {
  order: 2;
}

.btn-blue{
  padding-top: 2px;
  padding-bottom: 2px;
}

.container-form .media-box::before {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.container-form .form-box {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.container-form .form-box .form-inputs {
  flex-grow: 4;
}

.container-form .form-box .form-inputs .input-section {
  margin-top: 10px;
}

@media(max-width: 500px){
  .container-form .form-box {
    order: 2;
    border-top-left-radius: 0;
    border-bottom-right-radius: 15px;
  }

  .container-form .media-box::before {
    border-top-left-radius: 15px;
    border-bottom-right-radius: 0;
  }
}

</style>