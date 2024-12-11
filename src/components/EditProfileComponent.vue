<template>
  <div>
    <div class="container-form" v-if="isMyProfile">
      <div class="header">
        <h2>Edit Profile</h2>
        <p>{{ user.fullname }}</p>
      </div>
      <form novalidate class="edit-part">
        <div class="form-inputs">
            <div class="input-section">
              <label class="with-input-border">Fullname</label>
              <input type="text" v-model="user.fullname" autofocus=""/>
            </div>
            <span v-if="isFullnameError" class="error">Fullname's length must be more than 5.</span>
            <div class="input-section">
              <label class="with-input-border">Bio Information</label>
              <input type="text" v-model="user.bio_info"/>
            </div>
            <span v-if="isFullnameError" class="error">Fullname's length must be more than 5.</span>
            <div class="input-section">
              <label class="with-input-border">Password</label>
              <input type="password" v-model="password"/>
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
                  @click.prevent="validateUser"
                  :disabled="isProgressActive">
                <div v-if="!isProgressActive">Verify</div>
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
            </div>
          </div>
        <div class="card-image" @click="showModal = true">
          <div class="user-image" >
            <img id="profile_img" style="margin-right: 10%" v-bind:src="profilePhoto" alt="/">
          </div>
        </div>
        <my-upload field="img"
                   @crop-success="cropSuccess"
                   v-model="showModal"
                   lang-type="en"
                   :width="300"
                   :height="300"
                   img-format="jpg"></my-upload>
      </form>
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

import myUpload from 'vue-image-crop-upload';

export default {
  name: "EditProfile",
  components: {
    'my-upload': myUpload
  },
  data() {
    return {
      isMyProfile: false,
      user: {},
      profilePhoto: '',
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
    cropSuccess(imgDataUrl) {
      this.fileImg = imgDataUrl;
      fetch(this.fileImg)
        .then(res => res.blob())
        .then(blob => {
          this.fileImg = new File([blob], 'dot.png', blob);
          this.uploadProfilePhoto();
        });
    },

    uploadProfilePhoto() {
      const formData = new FormData();
      formData.append("profile_photo", this.fileImg);
      formData.append("username", localStorage.getItem('username'));
      this.$apiClient.post("/api/v1/users/upload_profile_photo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('userToken')
            }
          }
      ).then(() => {
        this.$router.push("/" + localStorage.getItem('username'));
      });
    },

    validateUser() {
      this.checkFullname();
    },

    checkFullname() {
      if (this.user.fullname.length < 4) {
        this.isFullnameError = true;
      } else {
        this.isFullnameError = false;

        if (this.password === '' && this.passwordConfirm === '') {
          this.updateUser();
        } else {
          this.checkPassword();
        }
      }
    },

    checkPassword() {
      if (this.password.length < 5) {
        this.isPasswordError = true;
      } else if (this.password !== this.passwordConfirm) {
        this.isPasswordError = false;
        this.isPasswordConfirmError = true;
      } else {
        this.isPasswordError = false;
        this.isPasswordConfirmError = false;
        this.updateUser();
      }
    },

    updateUser() {
      this.isProgressActive = true;
      let userPush = {
        username: this.user.username,
        bio_info: this.user.bio_info,
        fullname: this.user.fullname,
        password: this.password
      }

      if (this.password === '') delete userPush.password;

      this.$apiClient.put("/api/v1/users/update_user_by_username", userPush, {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        }
      }).then(() => {
        this.$router.push('/' + localStorage.getItem('username'));
      });
    },

    checkMyProfile() {
      if (this.$route.path === "/" + localStorage.getItem('username') + "/edit-profile") {
        this.isMyProfile = true;
      }
    },

    getProfilePhoto() {
      this.$apiClient.get("/api/v1/users/download_profile_photo",{
        headers: {
          'Authorization': localStorage.getItem('userToken'),
          responseType: 'arrayBuffer'
        },
        params: {
          username: this.$route.params.username
        }
      }).then( (res) => {
        this.profilePhoto = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        this.imgDataUrl = this.profilePhoto;
      });
      return this.profile_photo;
    },

    checkUserIsLoggedIn() {
      return !!localStorage.getItem('isLoggedIn');
    }
  },
  created() {
    this.checkMyProfile();
    if (!this.checkUserIsLoggedIn()) {
      this.$router.push('/login');
    } else {
      this.$apiClient.get("/api/v1/users/get_user_by_username", {
        params: {
          username : this.$route.params.username
        }
      }).then( (res) => {
            this.user = res.data;
          });
      this.profilePhoto = this.getProfilePhoto();
    }
  }
}
</script>

<style scoped>

.container-form {
  margin-top: 80px;
  flex-direction: column;
  justify-content: flex-start;
  background: white;
}

.spinner-loader {
  bottom: 10px;
  position: relative;
}

.header {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.edit-part {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 90%;
  height: 400px;
  flex-wrap: wrap;
}

.form-inputs {
  width: 40%;
}

.input-section {
  margin-top: 30px;
}

.submit-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.card-image {
  max-height: 260px;
  max-width: 260px;
  cursor: pointer;
}

.user-image {
  max-height: 260px;
  max-width: 260px;
  align-self: center;
}

.user-image img {
  max-width: 100%;
  height: auto;
  border-radius: 100%;
  border: 1px solid #c1c0c0;
}

.btn-big-grow {
  max-height: 60px;
}

.user-image :hover {
  box-shadow: 0 14px 18px 0 rgba(73, 62, 62, 0.241), 0 16px 50px 0 rgba(0, 0, 0, 0.446);;
}

@media screen and (max-width: 500px) {

  .container-form {
    min-height: 800px;
  }

  .edit-part {
    justify-content: center;
  }

  .form-inputs {
    margin-top: 40px;
    order: 2;
    width: 80%;
  }
}

</style>