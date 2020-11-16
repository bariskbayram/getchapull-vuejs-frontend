<template>

  <div class="hello main" >
    <div class="container" v-if="isMyProfile">
      <div class="row" >
        <div class="col-xs-6 col-md-6">
          <div class="page-header">
            <h2>Edit Your Profile</h2>
            <p>{{user.fullname}}</p>
          </div>
        </div>

        <div class="col-xs-6 col-md-6">
          <img class="thumbnail pull-right" id="profile_img" v-bind:src="profile_photo" alt="/">
        </div>
      </div>

      <ul class="nav nav-tabs">
        <li v-bind:class="{active: isInfoSection}" role=""  id="albumsbtn"><a href="#" v-on:click="isInfoSection=true">Info</a></li>
        <li style="display: none" v-bind:class="{active: !isInfoSection}" role="" id="bandsbtn"><a href="#" v-on:click="isInfoSection=false">Security</a></li>
      </ul>
      <br/><br/>

      <div class="col-xs-12 col-md-6">
        <form novalidate class="md-layout" @submit.prevent="validateUser">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-header>
              <div class="md-title">User Information</div>
            </md-card-header>

            <md-card-content>
              <div class="md-gutter">

                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label>Full Name</label>
                    <md-input class="input-mine" v-model="user.fullname" required autofocus="" @keyup.enter="validateUser"></md-input>
                    <span v-if="isFullnameError" class="md-error error-mine">Fullname's length must be more than 5.</span>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label>Password</label>
                    <md-input v-model="password" type="password" required @keyup.enter="validateUser"></md-input>
                  </md-field>
                  <span v-if="isPasswordError" class="md-error error-mine">Password's length must be more than 5.</span>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label>Password Confirm</label>
                    <md-input v-model="passwordConfirm" type="password" required @keyup.enter="validateUser"></md-input>
                  </md-field>
                  <span v-if="isPasswordConfirmError" class="md-error error-mine">Password confirmation is failed.</span>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-button @click.prevent="validateUser"
                             class="md-raised md-primary btn-lg btn-block"
                             :disabled="isProgressActive">
                   <span v-if="!isProgressActive">
                    UPDATE
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

      <div class="col-xs-12 col-md-6">
        <my-upload field="img"
                   @crop-success="cropSuccess"
                   v-model="showModal"
                   lang-type="en"
                   :width="300"
                   :height="300"
                   img-format="jpg"></my-upload>
        <md-card md-with-hover style="background: #cce4c1">
          <div @click="showModal = true" style="height: 441px">
            <md-ripple>

              <md-card-media-cover >
                <div>
                  <h3 style="margin-left: 120px; color: black">CHANGE PROFILE PHOTO</h3>
                </div>
                <md-card-media md-ratio="4:3">
                  <img :src="imgDataUrl">
                </md-card-media>
              </md-card-media-cover>

            </md-ripple>
          </div>
        </md-card>
      </div>

    </div>
    <div class="container" v-else>
      <div class="center">
        <h1 class="error-h1">Page not found !</h1>
        <p class="error-p">Something is wrong !</p>
        <p class="error-p">Üstüme gelme böyle bir sayfa yok !</p>
      </div>
    </div>
  </div>

</template>

<script>

const axios = require('axios').default;
import myUpload from 'vue-image-crop-upload';

export default {
  name: "EditProfile",
  components: {
    'my-upload': myUpload
  },
  data () {
    return {
      isMyProfile: false,
      user: {},
      profile_photo: '',
      password: '',
      passwordConfirm: '',
      isInfoSection: true,
      isProgressActive: false,
      isFullnameError: false,
      isPasswordError: false,
      isPasswordConfirmError: false,
      showModal: false,
      imgDataUrl: '',
      fileImg: '',
    }
  },
  methods: {
    cropSuccess(imgDataUrl){
      console.log('-------- crop success --------');
      this.fileImg = imgDataUrl;
      fetch(this.fileImg)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'dot.png', blob)
            this.fileImg = file;
            console.log(file);
            this.uploadProfilePhoto();
          });
    },
    uploadProfilePhoto() {
      const formData = new FormData();
      formData.append("profile_photo", this.fileImg);
      formData.append("username", localStorage.getItem('username'));
      axios.post(this.$url + "/api/user-profiles/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }).then( (res) => {
            console.log(res + " profile-photo is uploaded.");
            this.$router.push("/" + localStorage.getItem('username'));
          });
    },
    validateUser () {
      this.checkFullname();
    },
    checkFullname() {
      if(this.user.fullname.length < 4){
        this.isFullnameError = true;
      }else{
        this.isFullnameError = false;
        this.checkPassword();
      }
    },
    checkPassword() {
      if(this.password.length < 5){
        this.isPasswordError = true;
      }else if(this.password != this.passwordConfirm) {
        this.isPasswordConfirmError = true;
      }else{
        this.isPasswordError = false;
        this.isPasswordConfirmError = false;
        this.updateUser();
      }
    },
    updateUser () {
      this.isProgressActive = true;
      var userPush = {
        username: this.user.username,
        fullname: this.user.fullname,
        password: this.password
      }
      axios.put(this.$url + "/api/user-profiles/" + this.user.username, userPush, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      }).then(() => {
        this.$router.push('/' + localStorage.getItem('username'));
      });
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
    checkMyProfile () {
      if(this.$route.path == "/" + localStorage.getItem('username') + "/edit-profile"){
        this.isMyProfile = true;
      }
    },
    getProfilePhoto(){
      axios.get(this.$url + "/api/user-profiles/" + this.$route.params.username +"/image/download",{
        headers: {
          'Authorization': localStorage.getItem('user-token'),
          responseType: 'arrayBuffer'
        }
      }).then( (res) => {
        this.profile_photo = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        this.imgDataUrl = this.profile_photo;
      });
      return this.profile_photo;
    },
    checkUserIsLoggedIn(){
      if(localStorage.getItem('isLoggedIn')){
        return true;
      }
      return false;
    }
  },
  created() {
    this.checkMyProfile();
    if(!this.checkUserIsLoggedIn()){
      this.$router.push('/login');
    }else{
      axios.get(this.$url + "/api/user-profiles/get-user?username=" + this.$route.params.username)
          .then( (res) => {
            this.user = res.data;
          });
      this.profile_photo = this.getProfilePhoto();
    }
  }
}
</script>

<style scoped>
.error-h1{
  font-weight: 900;
  font-size: 7.5rem;
  padding: 10px;
}

.error-p{
  font-size: 4.5rem;
  padding: 10px;
}

.top-button{
  margin-top: 15px;
}

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

.col-xs-12 {
  margin-bottom: 50px;
}
</style>