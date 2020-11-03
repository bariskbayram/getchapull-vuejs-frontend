<template>
  <div class="container">
    <div id="form" class="center-block middle">
      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
          <md-card-header>
            <h2 class="md-title">Sign up to GetchaPull !</h2>
          </md-card-header>

          <md-card-content>
            <div class="md-gutter">

              <div class="md-layout-item md-small-size-100 div-mine">
                <md-field>
                  <label>Full Name</label>
                  <md-input class="input-mine" v-model="user.fullname" required autofocus=""></md-input>
                </md-field>
                <span v-if="isFullnameError" class="md-error error-mine">Fullname's length must be more than 5.</span>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Username</label>
                  <md-input v-model="user.username" required></md-input>
                </md-field>
                <span v-if="isUsernameError" class="md-error error-mine">Invalid username/Exists.</span>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Password</label>
                  <md-input v-model="user.password" type="password" required></md-input>
                </md-field>
                <span v-if="isPasswordError" class="md-error error-mine">Password's length must be more than 5.</span>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Password Confirm</label>
                  <md-input v-model="passwordConfirm" type="password" required></md-input>
                </md-field>
                <span v-if="isPasswordConfirmError" class="md-error error-mine">Password confirmation is failed.</span>
              </div>

              <div class="md-layout-item md-small-size-100">
                <md-button @click.prevent="validateForm"
                           class="md-raised md-primary btn-lg btn-block"
                           :disabled="isProgressActive">
                   <span v-if="!isProgressActive">
                    Sign up
                    </span>
                   <span v-else>
                    <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
                   </span>
                </md-button>
              </div>

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
  name: "Signup",
  data() {
    return {
      user: {
        fullname: '',
        username: '',
        password: '',

      },
      passwordConfirm: '',
      isProgressActive: false,
      isFullnameError: false,
      isUsernameError: false,
      isPasswordError: false,
      isPasswordConfirmError: false
    }
  },
  methods: {
    validateForm () {
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
      const isAvailable = this.checkUsernameIsAvailable();
      if(this.user.username.length < 4){
        this.isUsernameError = true;
      }else if(isAvailable) {
        this.isUsernameError = true;
      }else{
        this.isUsernameError = false;
        this.checkPassword();
      }
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

    checkUsernameIsAvailable(){
      axios.get(this.$url + "/api/user-profiles/search-username", {
        params: {
          username: this.user.username
        }
      }).then( (res) => {
        console.log(res)
        if(res.data == true){
          return false;
        }else{
          return true;
        }
      })
    },

    submitSignUp() {
      this.isProgressActive = true;
      axios.post(this.$url + "/api/user-profiles/signup", this.user)
          .then(() => {
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
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}

input{
  margin-top: 20px;
}

button{
  margin-top: 25px;
}

p, h2 {
  padding-left: 15px;
}

.error-mine {
  color: red;
}

.div-mine {
  margin-bottom: 15px;
}

.input-mine {
  margin-bottom: 0px;
}

</style>