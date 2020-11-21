<template>
  <div class="hello main" >
    <div class="container main" v-if="isUsernameAvailable">
      <div class="row" >
        <div class="col-xs-6 col-md-6">
          <div class="page-header">
            <h2>Albums I've listened to so far</h2>
            <p>{{user.fullname}}</p>
          </div>
        </div>

        <div class="col-xs-6 col-md-6">
          <img class="thumbnail pull-right" id="profile_img" v-bind:src="profile_photo" alt="/">
        </div>
      </div>

      <div class="navbar-form navbar-right">
        <input id="searchbox" type="text" class="form-control search" placeholder="Search..." v-model="filter">
      </div>

      <ul class="nav nav-tabs">
        <li v-bind:class="{active: isAlbumSection}" role=""  id="albumsbtn"><a href="#" @click.prevent="isAlbumSection=true">Albums</a></li>
        <li v-bind:class="{active: !isAlbumSection}" role="" id="bandsbtn"><a href="#" @click.prevent="isAlbumSection=false">Bands</a></li>
        <button v-if="isLoggedIn && isMyProfile" type="button" class="btn pull-right add-album-button" v-on:click="showModal = true">Add New Review</button>
      </ul>
      <br/><br/>

    </div>
    <div class="container" v-else>
      <div class="center">
        <h1 class="error-h1">Page not found !</h1>
        <p class="error-p">Something is wrong !</p>
        <p class="error-p">Üstüme gelme böyle bir sayfa yok !</p>
      </div>
    </div>

    <div id="content"  class="container"  role="main">
      <AlbumContent v-if="isAlbumSection" :filter="filter"/>
      <BandContent v-else :filter="filter"/>
    </div>

    <AddAlbumContent v-if="showModal" @close="showModal = false">
    </AddAlbumContent>

  </div>
</template>

<script>
  import AlbumContent from './AlbumsComponent.vue';
  import BandContent from "@/components/BandsComponent";
  import AddAlbumContent from "@/components/AddAlbumComponent";

  const axios = require('axios').default;

  export default {
    name: 'BaseContent',
    components:{
      AlbumContent,
      BandContent,
      AddAlbumContent
    },
    watch: {
      '$route': 'createdGettingData'
    },
    data(){
      return{
        filter: "",
        isUsernameAvailable: true,
        user: {},
        isAlbumSection: true,
        showModal: false,
        profile_photo: '',
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        isMyProfile: false,
      }
    },
    methods: {
      getProfilePhoto(){
        axios.get(this.$url + "/api/user-profiles/" + this.$route.params.username +"/image/download",{
          headers: {
            'Authorization': localStorage.getItem('user-token'),
            responseType: 'arrayBuffer'
          }
        }).then( (res) => {
          this.profile_photo = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        });
        return this.profile_photo;
      },
      goEditProfile () {
        this.$router.push("/" + localStorage.getItem('username') + "/edit-profile");
      },
      checkMyProfile () {
        if(this.$route.path == "/" + localStorage.getItem('username')){
          this.isMyProfile = true;
        }else{
          this.isMyProfile = false;
        }
      },
      createdGettingData(){
        axios.get(this.$url + "/api/user-profiles/search-username?username=" + this.$route.params.username)
            .then( (res) => {
              this.isUsernameAvailable = res.data;
            });
        if(this.isUsernameAvailable){
          axios.get(this.$url + "/api/user-profiles/get-user?username=" + this.$route.params.username)
              .then( (res) => {
                this.user = res.data;
              });
        }
        this.checkMyProfile();
        this.profile_photo = this.getProfilePhoto();
        if(!this.isLoggedIn){
          this.$router.push("/login");
        }
      }
    },
    created () {
      this.createdGettingData();
    }
  }
</script>

<style scoped>

@media (min-width: 768px) {
  .main {
    top: 50px;
  }
}

@media (min-width: 992px) {

  .main {
    top: 50px;
  }
}

@media (max-width: 768px) {
  .main {
    top: 50px;
    padding-left: 40px;
    padding-right: 40px;
  }
}

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
  margin-top: 20px;
}

.search {
  margin-right: 75px;
}

</style>