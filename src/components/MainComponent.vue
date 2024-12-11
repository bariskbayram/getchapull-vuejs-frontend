<template>
  <div class="container">
    <div class="main-section">
      <div class="stats-section">
        <div class="stats-block">
          <div class="profile-image">
            <a v-bind:href="'/' + user.username" ><img v-bind:src="profilePhoto" /></a>
          </div>
          <div class="stats">
            <div class="your-stats">
              <div>
                <p class="stats-point">{{ reviewCount }}</p>
                <p class="stats-text">Total reviews </p>
              </div>
              <div class="border-div"></div>
              <div>
                <p class="stats-point">{{ scorePoint }}</p>
                <p class="stats-text">Popularity score </p>
              </div>
            </div>
          </div>
          <div class="add-review-div">
            <button class="btn-follow btn-new-review" v-on:click="showNewReviewModal = true">
              <i class="fas fa-plus plus"></i>
              New Review</button>
          </div>
        </div>
      </div>
      <div class="posts-section">
        <div class="post" v-for="(post, index) in posts" v-bind:key="index">
          <div class="post-action">
            <a v-bind:href="'/' + post.username"><img v-bind:src="post.userPhoto" /></a>
            <p><a v-bind:href="'/' + post.username"><span class="user">{{ post.username }}</span></a> added a new review. <span class="time">{{ formatMoment(post.created_at) }}</span></p>
          </div>
          <div class="post-content">
            <div class="album-cover">
              <a href="#" @click.prevent="getPostForAlbumModal(post)"><img :src="post.src" :key="reRenderCount"/></a>
            </div>
            <div class="album-review">
              <h3>
                <a href="#" @click.prevent="getPostForBandModal(post)">{{ post.band_name }}</a>
                -
                <a href="#" @click.prevent="getPostForAlbumModal(post)">{{ post.album_name}}</a></h3>
              <p>{{ post.title }}</p>
              <h2>{{ post.point }} / 10</h2>
              <button class="btn-read-more" @click.prevent="getPostForAlbumModal(post)">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="add-friend">
        <div class="friend" v-for="(perUser, index) in notFriends" v-bind:key="index">
          <a class="img-a" v-bind:href="'/' + perUser.username"><img v-bind:src="perUser.profilePhoto" /></a>
          <div class="friend-info">
            <h5><a v-bind:href="'/' + perUser.username">{{ perUser.username }}</a></h5>
            <button :disabled="perUser.isProgressActive" @click="followSomeone(perUser.id, index)">
              <div v-if="spinnerIndex != index">
                    Follow
                  </div>
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
      </div>
    </div>

    <Modal v-if="showAlbumModal">
      <template v-slot:modal>
        <AlbumDetails @close="showAlbumModal = false"
                      :the-album="selectedAlbum" :props-post="selectedAlbum" />
      </template>
    </Modal>

    <Modal v-if="showBandModal">
      <template v-slot:modal>
        <BandDetails @close="showBandModal = false" :the-band="selectedBand" />
      </template>
    </Modal>

    <AddReviewModalComponent v-if="showNewReviewModal" @close="showNewReviewModal = false" />

  </div>
</template>

<script>

import AlbumDetails from "@/components/Album/AlbumDetails.vue";
import BandDetails from "@/components/Band/BandDetails.vue";
import Modal from "@/components/Modal.vue";
import AddReviewModalComponent from "@/components/Review/AddReviewModalComponent.vue";
import moment from "moment";

export default {
  name: "MainComponent",
  components: {AlbumDetails, BandDetails, Modal, AddReviewModalComponent},
  computed: {
    reviewCount: function() {
      return this.aCount;
    },
    scorePoint: function() {
      return this.aCount*2 + this.bCount*3;
    }
  },
  data() {
    return {
      user: {},
      profilePhoto: '',
      allUsers: [],
      notFriends: [],
      posts: [],
      aCount: 0,
      bCount: 0,
      reRenderCount: 0,
      spinnerIndex: null,
      showNewReviewModal: false,
      showAlbumModal: false,
      showBandModal: false,
      selectedAlbum: null,
      selectedBand: {},
    }
  },

  methods: {
    formatMoment(date) {
      return moment(date).fromNow();
    },

    getAlbumCount() {
      this.$apiClient.get("/api/v1/albums/get_reviewed_album_count_by_user", {
        headers: {
          "Authorization": localStorage.getItem('userToken'),
        },
        params: {
          username: localStorage.getItem('username')
        }
      }).then(res => {
        this.aCount = res.data;
      })
    },

    getBandCount() {
      this.$apiClient.get("/api/v1/bands/get_reviewed_band_count_by_user", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        },
        params: {
          username: localStorage.getItem('username')
        }
      }).then(res => {
        this.bCount = res.data;
      });
    },

    getProfilePhoto() {
      this.$apiClient.get("/api/v1/users/download_profile_photo",{
        headers: {
          'Authorization': localStorage.getItem('userToken'),
          responseType: 'arrayBuffer'
        },
        params: {
          username: localStorage.getItem('username')
        }
      }).then((res) => {
        this.profilePhoto = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        this.showAlbumModal = true;
        this.showAlbumModal = false;
      });
      return this.profilePhoto;
    },

    getPostForAlbumModal(post) {
      this.selectedAlbum = post;
      this.selectedAlbum.id = post.album_id;
      this.selectedAlbum.author = post.username;
      this.showAlbumModal = true;
    },

    getPostForBandModal(post) {
      this.selectedBand.src = null;
      this.selectedBand.bandName = post.band_name;
      this.selectedBand.id = post.band_id;
      this.selectedBand.postOwner = post.username;
      this.showBandModal = true;
    },

    followSomeone(followedId, index) {
      this.spinnerIndex = index
      this.$apiClient.put("/api/v1/users/follow_someone", "",{
        headers: {
          'Authorization': localStorage.getItem('userToken')
        },
        params: {
          user_id: localStorage.getItem('userId'),
          followed_id:  followedId
        }
      }).then(() =>{
        this.notFriends.splice(index, 1);
        this.spinnerIndex = null;
      })
    },

    getPhoto(post) {
      this.$apiClient.get("/api/v1/albums/download_album_image", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
          responseType: 'arrayBuffer'
        },
        params: {
          album_id: post.album_id
        }
      }).then( (res) => {
        post.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
        this.reRenderCount++;
      })

      this.$apiClient.get("/api/v1/users/download_profile_photo",{
        headers: {
          'Authorization': localStorage.getItem('userToken'),
          responseType: 'arrayBuffer'
        },
        params: {
          username: post.username
        }
      }).then((res) => {
        post.userPhoto = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        this.showAlbumModal = true;
        this.showAlbumModal = false;
      });
    },

    getPosts() {
      this.$apiClient.post("/api/v1/reviews/get_all_post_by_user_id", "", {
        headers: {
          'Authorization': localStorage.getItem('userToken')
        },
        params: {
          user_id : localStorage.getItem('userId')
        }
      }).then((res) => {
        this.posts = res.data;
        this.posts.forEach(this.getPhoto);
      });
    },

    getOtherUsers() {
      this.$apiClient.get("/api/v1/users/get_user_suggestion", {
        headers: {
          'Authorization': localStorage.getItem('userToken')
        },
        params: {
          user_id: this.user.id
        }
      }).then((res) => {
        this.notFriends = res.data;
        if (this.notFriends === '')
            this.notFriends = [];
        this.notFriends.forEach(this.getNotFriendsPhoto)
      });
    },

    getNotFriendsPhoto(user) {
      this.$apiClient.get("/api/v1/users/download_profile_photo",{
        headers: {
          'Authorization': localStorage.getItem('userToken'),
          responseType: 'arrayBuffer'
        },
        params: {
          username: user.username
        }
      }).then((res) => {
        user.profilePhoto = "data:image/jpg;base64," + Buffer.from(res.data, 'binary')
        this.showAlbumModal = true;
        this.showAlbumModal = false;
      });
    }

  },
  async created() {

    if (!localStorage.getItem('isLoggedIn')) {
      this.$router.push('/login');
    } else {
      this.getAlbumCount();
      this.getBandCount();
      this.getProfilePhoto();

      this.$apiClient.get("/api/v1/users/get_user_by_username", {
        params: {
          username: localStorage.getItem('username')
        }
      }).then((res) => {
        this.user = res.data;
        localStorage.setItem('userId', this.user.id);
        this.getOtherUsers();
        this.getPosts();
      });
    }
  }
}
</script>

<style scoped>

.border-div {
  border-bottom: 1px solid #c6c6c6;
}

a {
  color: black;
}

a:visited {
  color: black;
}

a:hover{
  color: #515151;
}

.spinner-loader > div {
  height: 50%;
}

.content {
  display: flex;
  min-height: 600px;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 45px;
}

.content .main-section{
  min-width: 300px;
  min-height: 600px;
  flex-grow: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.content .main-section .stats-section{
  width: 90%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content .main-section .stats-section .stats-block{
  background: rgb(255, 255, 255);
  width: 100%;
  min-height: 150px;
  border-radius: 15px 15px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  box-shadow: 0 14px 18px 0 rgba(73, 62, 62, 0.241), 0 16px 50px 0 rgba(0, 0, 0, 0.446);;
}

.content .main-section .stats-section .stats-block .profile-image {
  max-height: 100px;
  max-width: 100px;
  align-self: center;
  flex-grow: 1;
  margin-left: 40px;
}

.content .main-section .stats-section .stats-block .profile-image img{
  max-width: 100%;
  height: auto;
  border-radius: 100%;
}

.content .main-section .stats-section .stats-block .stats {
  flex-grow: 3;
  min-width: 150px;
  margin: 20px 20px;
  height: auto;
  display: flex;
  justify-content: space-between;
}

.content .main-section .stats-section .stats-block .add-review-div {
  flex-grow: 1;
  align-self: center;
  height: 70px;
}

.btn-new-review {
  width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 0 auto;
}

.plus {
  font-size: 2.5rem;
}

.content .main-section .stats-section .stats-block .stats .your-stats {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 auto;
}

.content .main-section .stats-section .stats-block .stats .your-stats div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.content .main-section .stats-section .stats-block .stats .your-stats div p {
  margin-left: 10px;
  font-size: 1.4rem;
}

.content .main-section .posts-section{
  width: 95%;
  min-width: 785px;
  min-height: 600px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}

.content .main-section .posts-section .post {
  width: 100%;
  min-height: 250px;
  background: rgb(255, 255, 255);
  margin: 10px 0;
  border-radius: 20px;
  box-shadow: 0 4px 8px 0 rgba(73, 62, 62, 0.241), 0 6px 20px 0 rgba(0, 0, 0, 0.446);;
}

.content .main-section .posts-section .post .post-action {
  padding: 10px 10px;
  width: 100%;
  max-height: 55px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.2rem;
  border-bottom: ridge;
}

.content .main-section .posts-section .post .post-action img {
  max-width: 35px;
  height: auto;
  border-radius: 100%;
  margin-right: 10px;
}

.content .main-section .posts-section .post .post-action p .user{
  font-weight: bold;
  font-size: 1.2rem;
}

.content .main-section .posts-section .post .post-action p .time{
  font-style: italic;
  font-size: 1rem;
  margin-left: 10px;
  color: gray;
}

.content .main-section .posts-section .post .post-content {
  display: flex;
  width: 95%;
  min-height: 300px;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.content .main-section .posts-section .post .post-content .album-cover{
  width: 260px;
  height: 260px;
  position: relative;
}

.content .main-section .posts-section .post .post-content .album-cover img {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
}

.content .main-section .posts-section .post .post-content .album-review {
  width: 400px;
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 1.5rem;
}

.btn-read-more{
  width: 80px;
  height: 40px;
  border: 1px solid rgba(6, 51, 92, 0.72);
  border-radius: 4px;
  outline: 0;
  cursor: pointer;
  background: white;
  color: rgba(6, 51, 92, 0.72);
  font-weight: 400;
}

.btn-read-more:hover{
  border: 1px solid white;
  background: rgba(6, 51, 92, 0.72);
  color: white;
}

.content .sidebar-section {
  min-width: 300px;
  min-height: 200px;
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.content .sidebar-section .add-friend {
  width: 90%;
  margin: 0 auto;
  min-height: 200px;
  margin-top: 20px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 30px;
  align-items: center;
}

.content .sidebar-section .add-friend .friend {
  width: 90%;
  min-height: 100px;
  background: rgb(255, 255, 255);
  margin: 10px 0;
  border-radius: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 4px 8px 0 rgba(73, 62, 62, 0.241), 0 6px 20px 0 rgba(0, 0, 0, 0.446);;
}

.content .sidebar-section .add-friend .friend .img-a {
  flex-grow: 1;
  margin-left: 10px;
}


.content .sidebar-section .add-friend .friend img {
  max-width: 65px;
  height: auto;
  border-radius: 100%;
}

.content .sidebar-section .add-friend .friend .friend-info {
  /*display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;*/
  max-width: 70%;
  flex-grow: 4;
  text-align: center;
}

.content .sidebar-section .add-friend .friend .friend-info a{
  font-size: 1.2rem;
}

.content .sidebar-section .add-friend .friend .friend-info button{
  align-self: center;
  margin: 10px auto;
  width: 60px;
  height: 30px;
  border: 1px solid rgb(108, 110, 150);
  color: rgb(108, 110, 150);
  background: white;
  cursor: pointer;
  outline: 0;
}

.content .sidebar-section .add-friend .friend .friend-info button:hover {
  border-color: white;
  color: white;
  background: rgb(108, 110, 150);
}

@media screen and (max-width: 1100px){
  .content .sidebar-section .add-friend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }

  .content .sidebar-section .add-friend .friend {
    max-width: 250px;
  }
}

@media screen and (max-width: 768px) {

  .content .main-section .posts-section {
    min-width: 80%;
  }

  .content .main-section .posts-section .post .post-content {
    padding-top: 10px;
    width: 100%;
  }

  .content .main-section .stats-section .stats-block .add-review-div{
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 650px) {
  .content .main-section .stats-section .stats-block .profile-image {
    margin-left: 10px;
    margin-top: 5px;
  }
}

@media screen and (max-width:500px){
  .content .main-section .posts-section .post .post-content .album-review {
    font-size: 1.3rem;
  }

  .content .main-section .posts-section .post .post-action p {
    font-size: 0.8rem;
  }

  .content .main-section .posts-section .post .post-action p .user {
    font-size: 0.8rem;
  }

  .content .main-section .posts-section .post .post-action p .time {
    font-size: 0.8rem;
  }

  .content .main-section .stats-section .stats-block .stats {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .content .main-section .stats-section {
    margin-top: 10px;
    min-height: 200px;
  }

  .content .main-section .stats-section .stats-block {
    min-height: 200px;
  }
}

</style>