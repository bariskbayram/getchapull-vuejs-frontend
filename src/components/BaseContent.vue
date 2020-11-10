<template>
  <div class="hello" >
    <div class="container" v-if="isUsernameAvailable">
      <div class="row" >
        <div class="col-xs-6 col-md-6">
          <button v-if="!isMyProfile" v-on:click="goMyProfile" type="button" class="btn left top-button btn-primary">MyProfile</button>
          <div class="page-header">
            <h2>Albums I've listened to so far</h2>
            <p>{{user.fullname}}</p>
          </div>
        </div>

        <div v-cloak class="col-xs-6 col-md-6">
          <div>
            <button type="button" class="btn btn-danger pull-right top-button" v-if="isLoggedIn" v-on:click="logOut">Log Out</button>
          </div>
          <img class="thumbnail pull-right" id="profile_img" v-bind:src="profile_photo" alt="/">
        </div>
      </div>

      <div class="navbar-form navbar-right">
        <input id="searchbox" type="text" class="form-control search" placeholder="Search..." v-model="filter">
      </div>

      <ul class="nav nav-tabs">
        <li v-bind:class="{active: isAlbumSection}" role=""  id="albumsbtn"><a href="#" v-on:click="isAlbumSection=true">Albums</a></li>
        <li v-bind:class="{active: !isAlbumSection}" role="" id="bandsbtn"><a href="#" v-on:click="isAlbumSection=false">Bands</a></li>
        <button v-if="isLoggedIn && isMyProfile" type="button" class="btn pull-right add-album-button" v-on:click="showModal = true">Add new album</button>
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
  import AlbumContent from './AlbumContent.vue';
  import BandContent from "@/components/BandContent";
  import AddAlbumContent from "@/components/AddAlbumContent";

  const axios = require('axios').default;

  export default {
    name: 'BaseContent',
    components:{
      AlbumContent,
      BandContent,
      AddAlbumContent
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
      logOut () {
        localStorage.clear();
        this.$router.push("/login");
      },
      goMyProfile () {
        this.$router.push("/");
      },
      checkMyProfile () {
        if(this.$route.path == "/" + localStorage.getItem('username')){
          this.isMyProfile = true;
        }else{
          this.isMyProfile = false;
        }
      }
    },
    created () {
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
  margin-top: 20px;
}

.search {
  margin-right: 75px;
}

[v-cloak] {display: none}

</style>