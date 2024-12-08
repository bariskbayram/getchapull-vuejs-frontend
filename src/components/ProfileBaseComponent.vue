<template>
  <div class="container">
    <div v-if="isUsernameAvailable">
      <div class="profile-info">
        <div class="follow-section">
          <div class="about-user">
            <h2>{{ user.fullname }}</h2>
            <p>{{ user.bioInfo }}</p>
          </div>
          <button class="btn-follow btn-new-review" v-if="isLoggedIn && isMyProfile" v-on:click="showModal = true">New Review</button>
          <button class="btn-follow" v-else-if="!isYourFriend" @click="followSomeone(user.id)">Follow</button>
          <button class="btn-follow" v-else @click="unfollowSomeone(user.id)">Unfollow</button>
          <div class="follow-statistics">
            <p @click="userListShowModal = true; isFollowersModal = false">{{ followingsCount }} Followings</p>
            <p @click="userListShowModal = true; isFollowersModal = true">{{ followersCount }} Followers</p>
          </div>
        </div>
        <div class="user-image">
          <img v-bind:src="profilePhoto" />
        </div>
      </div>
      <div class="profile-sections">
        <div class="profile-buttons">
          <ul>
            <li role=""  id="albumsbtn"><a href="#" :class="{active: isAlbumSection}"  @click.prevent="isAlbumSection=true">Albums</a></li>
            <li role="" id="bandsbtn"><a href="#" :class="{active: !isAlbumSection}" @click.prevent="isAlbumSection=false">Bands</a></li>
          </ul>
        </div>
        <div class="search-block search-profile">
          <input id="searchbox" class="search-bar" type="text" placeholder="| Search" v-model="filter"/>
          <i class="fas fa-search"></i>
        </div>
      </div>
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

    <Modal v-if="userListShowModal" @closeModal="closeModal">
      <template v-slot:modal>
        <ModalUserList v-if="userListShowModal && isFollowersModal" :is-followers=isFollowersModal :user-list="followers" @closeModal="closeModal" />
        <ModalUserList v-if="userListShowModal && !isFollowersModal" :is-followers=isFollowersModal :user-list="followings" @closeModal="closeModal" />
      </template>
    </Modal>

    <AddAlbumContent v-if="showModal" @close="showModal = false" />

  </div>
</template>

<script>
  import AlbumContent from './AlbumsComponent.vue';
  import BandContent from "@/components/BandsComponent";
  import AddAlbumContent from "@/components/AddAlbumComponent";
  import ModalUserList from "@/components/ModalUserList";
  import Modal from "@/components/Modal";

  const axios = require('axios').default;

  export default {
    name: 'BaseContent',
    components:{
      Modal,
      ModalUserList,
      AlbumContent,
      BandContent,
      AddAlbumContent
    },
    computed: {
      followersCount: function() {
        return this.followers.length;
      },
      followingsCount: function() {
        return this.followings.length;
      }
    },
    watch: {
      '$route': 'createdGettingData',
    },
    data() {
      return {
        filter: "",
        isUsernameAvailable: true,
        user: {},
        followers : '',
        followings: '',
        isYourFriend: false,
        isAlbumSection: true,
        showModal: false,
        userListShowModal: false,
        isFollowersModal: false,
        profilePhoto: '',
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        isMyProfile: false,
        reRenderCount: 0
      }
    },
    methods: {

      closeModal() {
        this.userListShowModal = false;
        this.$emit('close');
      },

      getProfilePhoto() {
        axios.get(this.$url + "/api/v1/users/download_profile_photo",{
          headers: {
            'Authorization': localStorage.getItem('userToken'),
            responseType: 'arrayBuffer'
          },
          params: {
            username: this.$route.params.username
          }
        }).then( (res) => {
          this.profilePhoto = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        });
        return this.profilePhoto;
      },

      checkMyProfile() {
        if (this.$route.path === "/" + localStorage.getItem('username')) {
          this.isMyProfile = true;
        } else {
          this.isMyProfile = false;
        }
      },

      checkIsYourFriend() {
        axios.get(this.$url + "/api/v1/users/is_followed_by_user", {
          headers: {
            'Authorization': localStorage.getItem('userToken')
          },
          params: {
            user_id: localStorage.getItem('userId'),
            other_username:  this.$route.params.username
          }
        }).then((res) => {
          this.isYourFriend = res.data;
          this.reRenderCount++;
        });
      },

      followSomeone(followedId) {
        axios.put(this.$url + "/api/v1/users/follow_someone", "",{
          headers: {
            'Authorization': localStorage.getItem('userToken')
          },
          params: {
            user_id: localStorage.getItem('userId'),
            followed_id: followedId
          }
        }).then(() =>{
          this.isYourFriend = true;
          this.followers.push(
              {
                'user_id': localStorage.getItem('userId'),
                'username': localStorage.getItem('username')
              }
          );
          this.reRenderCount++;
        })
      },

      unfollowSomeone(unfollowedId) {
        axios.put(this.$url + "/api/v1/users/unfollow_someone", "",{
          headers: {
            'Authorization': localStorage.getItem('userToken')
          },
          params: {
            user_id: localStorage.getItem('userId'),
            unfollowed_id:  unfollowedId
          }
        }).then(() =>{
          this.isYourFriend = false;
          this.reRenderCount++;
        })
      },

      getUserProfile() {
        axios.get(this.$url + "/api/v1/users/get_user_by_username", {
          params: {
            username: this.$route.params.username
          }
        }).then((res) => {
            this.user = res.data;
            this.getFollowersAndFollowing()
        });
      },

      getFollowersAndFollowing() {
        axios.get(this.$url + "/api/v1/users/find_followers_by_user_id", {
          headers: {
            'Authorization': localStorage.getItem('userToken')
          },
          params: {
            user_id: this.user.id
          }
        }).then((res) => {
          this.followers = res.data;
        });

        axios.get(this.$url + "/api/v1/users/find_followings_by_user_id", {
          headers: {
            'Authorization': localStorage.getItem('userToken')
          },
          params: {
            user_id: this.user.id
          }
        }).then((res) => {
          this.followings = res.data;
        });
      },

      createdGettingData() {
        this.checkIsYourFriend();
        this.checkMyProfile();
        axios.get(this.$url + "/api/v1/users/check_username_exist",{
          params: {
            username: this.$route.params.username
          }
        }).then((res) => {
          this.isUsernameAvailable = res.data;
          if (this.isUsernameAvailable) {
            this.getUserProfile();
          }
        });

        this.profilePhoto = this.getProfilePhoto();
        if (!this.isLoggedIn) {
          this.$router.push("/login");
        }
      }
    },
    created() {
      this.createdGettingData();
    }
  }
</script>

<style scoped>

.content {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  margin-top: 45px;
}

.profile-info {
  background: rgb(158, 157, 157);
  width: 100%;
  max-width: 90%;
  display: flex;
  justify-content: space-around;
  border-radius: 30px;
  margin: 20px auto 50px auto;
  padding: 0 10px;
  box-shadow: 0 14px 18px 0 rgba(73, 62, 62, 0.241), 0 16px 50px 0 rgba(0, 0, 0, 0.446);
}

.profile-info .follow-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profile-info .follow-section .about-user {
  text-align: center;
  margin: 20px 0;
  color: rgb(67, 67, 67);
}

.profile-info .follow-section .follow-statistics {
  color: #e7e7e7;
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
}

.profile-info .follow-section .follow-statistics p {
  margin: 0 10px;
}

.profile-info .user-image{
  max-height: 160px;
  max-width: 160px;
  align-self: center;
}

.profile-info .user-image img {
  max-width: 100%;
  height: auto;
  border-radius: 100%;
}

.profile-sections {
  width: 100%;
  margin: 0 auto;
  min-height: 45px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1px solid #ddd;
}

.profile-sections .profile-buttons {
  width: 65%;
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
}

.profile-sections .profile-buttons ul {
  list-style: none;
  display: flex;
}

.profile-sections .profile-buttons ul li {
  padding: 7px 0;
}

.profile-sections .profile-buttons ul li a{
  border: 1px solid transparent;
  border-radius: 4px 4px 0 0;
  color: rgb(63, 63, 63);
  padding: 10px 15px;
}

.profile-sections .profile-buttons ul li .active {
  border-color: #bebebe;
  border-bottom-color: transparent;
  cursor: context-menu;
}

.profile-sections .search-profile {
  margin-top: 7px;
  width: 30%;
  margin-right: 10px;
}

.profile-sections .search-profile .search-bar {
  background: #e9e8e8;
}

.profile-sections .search-profile .search-bar:focus {
  background: white;
}

@media screen and (max-width: 500px){
  .profile-info {
    flex-direction: column;
  }

  .profile-info .follow-section {
    width: 100%;
  }

  .profile-info .user-image {
    margin-bottom: 10px;
  }

  .profile-sections {
    justify-content: center;
  }

  .profile-sections .profile-buttons {
    order: 2;
    width: 85%;
    flex-direction: column;
  }

  .profile-sections .profile-buttons ul{
    margin-top: 20px;
    order: 2;
  }

  .profile-sections .search-profile {
    order: 1;
    width: 60%;
    margin-bottom: 20px;
  }
}

</style>