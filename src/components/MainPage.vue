<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-sm-offset-0 col-md-9 col-md-offset-0 main">
        <h1 class="page-header">Posts</h1>
        <article class="post vt-post" style="border: 1px solid #eeeeee"  v-for="(post, index) in posts" v-bind:key="index">
          <h3 style="text-align: center; color: darkgreen"><a v-bind:href="'/' + post.username">{{post.username}}</a> is added a new review !</h3>
          <br>
          <div class="row">
            <div class="col-xs-12 col-sm-5 col-md-5 col-lg-4">
              <div class="post-type post-img">
                <a href="#" @click.prevent="getPostForModal(post)"><img :src="post.src" :key="reRenderCount" class="img-responsive" alt="image post" ></a>
              </div>
              <div class="author-info author-info-2">
                <br>
                <ul class="list-inline">
                  <li>
                    <div class="info">
                      <p>Posted on:</p>
                      <strong>{{post.date.split("G")[0]}}</strong></div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-xs-12 col-sm-7 col-md-7 col-lg-8">
              <div class="caption">
                <h3 class="md-heading"><a href="#" @click.prevent="getPostForModal(post)">{{ post.bandName }} - {{ post.albumName}}</a></h3>
                <p> {{ post.title }} </p>
                <h2>{{ post.point }}/10</h2>
                <a class="btn btn-default" href="#" role="button" @click.prevent="getPostForModal(post)">Read More</a> </div>
            </div>
          </div>
        </article>
      </div>
      <div class="col-sm-3 col-md-3 sidebar">
        <h1 class="page-header">New Friends</h1>
        <div class="people-nearby" v-for="(perUser, index) in notFriends" v-bind:key="index">
          <div class="nearby-user">
            <div class="row">
              <div class="col-md-5 col-sm-5">
                <br>
                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="user" class="profile-photo-lg">
              </div>
              <div class="col-md-7 col-sm-7">
                <h5><a v-bind:href="'/' + perUser.username" class="profile-link">{{perUser.fullname}}</a></h5>
                <p>{{perUser.username}}</p>
                <p class="text-muted">Total friends: {{ perUser.friends.length-1 }}</p>
                <button class="btn btn-primary" :disabled="perUser.isProgressActive" @click="addFriend(perUser.username, index)">
                  <span v-if="spinnerIndex != index">
                    Add Friend
                  </span>
                  <span v-else>
                    <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <AlbumDetails v-if="showModal" @close="showModal = false" :the-album="selectedAlbum" :props-review="selectedAlbum">

    </AlbumDetails>

  </div>
</template>

<script>

import AlbumDetails from "@/components/AlbumDetails";

const axios = require('axios').default;

export default {
  name: "MainPage",
  components: {AlbumDetails},
  data() {
    return{
      user: {},
      allUsers: [],
      notFriends: [],
      posts: [],
      reRenderCount: 0,
      spinnerIndex: null,
      showModal: false,
      selectedAlbum: null,
    }
  },

  /*her arkadaş eklenmesiyle, user.friends değiştikçe tekrar postları getiriyor
  fakat bu performansı çok etkileyebilir o yüzden şimdilik belirsiz*/
 /* watch: {
    'user.friends': 'getPosts',
  },*/
  methods: {
    getPostForModal(post){
      this.selectedAlbum = post;
      this.selectedAlbum.id = post.albumId;
      this.selectedAlbum.author = post.username;
      this.showModal = true;
    },
    addFriend (username, index) {
      console.log("addFriend");
      this.spinnerIndex = index
      axios.put(this.$url + "/api/user-profiles/add-friend", "",{
        headers: {
          'Authorization': localStorage.getItem('user-token')
        },
        params: {
          username: localStorage.getItem('username'),
          friend_username:  username
        }
      }).then( () =>{
        this.user.friends.push(username);
        this.notFriends.splice(index, 1);
        this.spinnerIndex = null;
      })
    },

    getPhoto(post){
      axios.get(this.$url + "/api/albums/" + post.albumId + "/image/download", {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
          responseType: 'arrayBuffer'
        },
        params: {
          username: post.username,
        }
      }).then( (res) => {
        post.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
        this.reRenderCount++;
      })
    },

    getPosts(){
      axios.post(this.$url + "/api/reviews/get-for-posts", this.user.friends, {
        headers: {
          'Authorization': localStorage.getItem('user-token')
        }
      }).then( (res) => {
        console.log(res);
        this.posts = res.data;
        this.posts.forEach(this.getPhoto);
      });
    }

  },
  async created() {
    if (!localStorage.getItem('isLoggedIn')) {
      this.$router.push('/login');
    } else {

      await axios.get(this.$url + "/api/user-profiles/get-user?username=" + localStorage.getItem('username'))
          .then((res) => {
            this.user = res.data;
          });

      await axios.get(this.$url + "/api/user-profiles", {
        headers: {
          'Authorization': localStorage.getItem('user-token')
        }
      }).then((res) => {
        this.allUsers = res.data;
        this.notFriends = this.allUsers.filter( (user) => {
          return !this.user.friends.includes(user.username);
        });
      });

      await this.getPosts();
    }
  }
}
</script>

<style scoped>

@media (min-width: 768px){
  .main{
    top: 50px;
  }
  
  .sidebar {
    top: 50px;
    bottom: 0;
    display: block;
    padding: 0px 20px 20px 20px;
    overflow-x: hidden;
    overflow-y: auto;
    right: 0;
    border-left: 1px solid #eee;
  }
}

@media (min-width: 992px){

  .main{
    top: 50px;
  }

  .sidebar {
    top: 50px;
    bottom: 0;
    display: block;
    padding: 0px 20px 20px 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}


@media (max-width: 768px) {
  .sidebar{
    display: none;
  }

  .main {
    top: 50px;
    padding-left: 40px;
    padding-right: 40px;
  }
}

.people-nearby .google-maps{
  background: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #f1f2f2;
  padding: 20px;
  margin-bottom: 20px;
}

.people-nearby .google-maps .map{
  height: 300px;
  width: 100%;
  border: none;
}

.people-nearby .nearby-user{
  padding: 20px 0;
  border-top: 1px solid #f1f2f2;
  border-bottom: 1px solid #f1f2f2;
  margin-bottom: 20px;
}

img.profile-photo-lg{
  height: 80px;
  width: 80px;
  border-radius: 50%;
}

body{
  margin-top:20px;
  background:#DCDCDC;
}
.content {
  padding: 35px 0px;
}

.post-list {
  padding: 90px 0px;
}

.post-detail {
  padding: 40px 0px;
  margin-top: 120px;
}

.post {
  width: 100%;
  float: left;
  -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
  background: #fff;
  margin-bottom: 40px;
  border-radius: 3px;
}

.feature-post .thumbnail .author-info {
  padding: 20px 5px 20px 40px;
  text-align: left;
  min-height: 80px;
  background: #2c3840;
  float: left;
  width: 100%;
}

.post .post-type {
  float: left;
  width: 100%;
}

.post iframe {
  padding: 0px;
  margin: 0px;
}

.post .mejs-container {
  border-radius: 3px 3px 0px 0px;
  width: 100% !important;
}

.post .post-video {
  border-radius: 3px 3px 0px 0px;
}

.post .post-video iframe {
  width: 100%;
}

.post .post-video video {
  border-radius: 3px 3px 0px 0px;
}

.post .post-multiple-img a img {
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  width: 100%;
  height: auto;
  display: block;
  min-height: 160px;
}

.post .post-multiple-img a {
  float: left;
  width: 100%;
  display: block;
}

.post .post-multiple-img a:hover img {
  opacity: 0.7;
}

.post .post-audio {
  height: auto;
}

.post .post-audio ._SMB-widget {
  width: 100%;
}

.post .post-quote blockquote {
  text-align: center;
  margin: 0px;
  padding: 25px 15px;
}

.post .post-quote blockquote h3 {
  color: #e74c3c;
  font-size: 36px;
  margin: 0px 0px 10px 0px;
}

.post .post-quote blockquote p {
  color: #333;
  font-size: 24px;
  font-weight: 300;
}

.post .post-img a {
  display: block;
}

.post .post-img:hover a img {
  opacity: 0.7;
}

.post .post-img a img {
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  width: 100%;
  height: auto;
  border-radius: 3px 3px 0px 0px;
}

.post-detail .post .caption {
  padding: 55px 45px 0px 45px;
}

.post .caption {
  float: left;
  width: 100%;
  text-align: left;
  padding: 25px 25px;
}

.post .caption h3 {
  margin: 0px 0px 20px 0px;
  color: #36a0e7;
  font-weight: 300;
  font-size: 34px;
  line-height: 42px;
}

.post .caption p {
  line-height: 28px;
  margin-bottom: 20px;
  font-size: 16px;
}

.post .author-info {
  padding: 15px 15px 15px 15px;
  text-align: left;
  min-height: 60px;
  border-bottom: 1px solid #ddd;
  background: #fcfcfc;
  float: left;
  width: 100%;
}

.post .author-info .list-inline {
  margin: 0px;
}

.post .author-info ul li:first-child {
  border-left: none;
  padding-left: 0px;
}

.post .author-info ul li {
  float: left;
  border-left: 1px solid #ddd;
  padding-left: 20px;
  padding-right: 20px;
}

.post .author-info ul li p {
  line-height: 16px;
  color: #3b4952;
  font-weight: 300;
  font-size: 14px;
  margin: 0px;
}

.post .author-info ul li strong {
  color: #3b4952;
}

.post .author-info ul li a {
  color: #3b4952;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
}

.post .author-info ul li a:hover {
  color: #e74c3c;
  text-decoration: none;
}

.post .author-info ul li .icon-box {
  margin-right: 15px;
  width: 36px;
  text-align: center;
  line-height: 36px;
  font-size: 30px;
  height: 36px;
  float: left;
  background: transparent;
  color: #aebbc5;
}

.post .author-info ul li .icon-box img {
  border-radius: 3px;
  width: 100%;
}

.post .author-info ul li .info {
  float: left;
}

.post .author-info.author-info-2 ul li:first-child {
  border-left: none;
  padding-left: 0px;
}

.post .author-info.author-info-2 ul li .icon-box {
  font-size: 28px;
}

.post .post-category {
  float: left;
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.post .post-category a {
  margin: 0px;
  font-size: 18px;
  font-weight: 300;
  color: #3b4952;
}

.post .post-category span {
  width: 12px;
  height: 12px;
  display: inline-block;
  background: #3b4952;
  vertical-align: middle;
  margin-right: 10px;
}

.post .post-category a:hover span {
  background: #e74c3c;
  color: #e74c3c;
}

.post .post-category a:hover {
  color: #e74c3c;
}

.post .tags {
  float: left;
  width: 100%;
  margin-bottom: 20px;
}

.post .tags li {
  margin-bottom: 8px;
  padding: 0px 2px;
}

.post .tags li a {
  background: #ebf1f4;
  font-size: 14px;
  font-weight: 300;
  border-radius: 3px;
  padding: 4px 8px;
  color: #3b4952;
}

.post .tags li a:hover {
  background: #3b4952;
  color: #fff;
}

.img-grid {
  float: left;
  margin-bottom: 40px;
}

.img-grid li {
  margin: 0px;
  float: left;
}

.post .caption h5 {
  text-decoration: underline;
  margin: 0px 0px 20px 0px;
  color: #3b4952;
  font-weight: 300;
  font-size: 24px;
  line-height: 30px;
}

.post .list-unstyled {
  margin-bottom: 40px;
}

.post .list-unstyled li {
  font-size: 16px;
  line-height: 28px;
  font-weight: 500;
  color: #49545b;
}

.post .list-unstyled li i {
  color: #a0b9ca;
  margin-right: 15px;
}

blockquote {
  background: #f2f6f8;
  border: 1px solid #e5e5e5;
  line-height: 28px;
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 500;
  color: #49545b;
}

.line-block {
  padding: 20px 45px;
  border-top: 1px solid #eef3f6;
  border-bottom: 1px solid #eef3f6;
  float: left;
  width: 100%;
}

.post .line-block .tags {
  margin-bottom: 0px;
}

.share-this {
  padding: 20px 45px;
  border-bottom: 1px solid #eef3f6;
  float: left;
  width: 100%;
}

.share-this p,
.share-this ul {
  margin-bottom: 0px;
}

.share-this li a {
  background: #2c3840;
  line-height: 34px;
  text-align: center;
  color: #fff;
  width: 32px;
  height: 32px;
  display: block;
  border-radius: 50%;
}

.share-this li a.pinterest {
  background: #d91c1c;
}

.share-this li a.google-plus {
  background: #f25353;
}

.share-this li a.facebook {
  background: #2b77be;
}

.share-this li a.twitter {
  background: #62bfef;
}

.related-post {
  padding: 40px 45px;
  border-bottom: 1px solid #eef3f6;
  float: left;
  width: 100%;
}

.related-post .thumbnail {
  padding: 0px;
  border: none;
}

.related-post .thumbnail .caption {
  padding: 30px 0px 0px 0px;
}

.related-post .thumbnail .caption a {
  font-size: 18px;
  line-height: 28px;
  font-weight: 300;
  color: #49545b;
}

.related-post .thumbnail .caption a:hover {
  color: #36a0e7;
}

.related-post .thumbnail:hover a img {
  opacity: 0.7;
}

.related-post h4 {
  color: #49545b;
  font-weight: 700;
  font-size: 18px;
  margin: 0px 0px 20px 0px;
}

.comment-count {
  padding: 45px 45px;
  border-bottom: 1px solid #eef3f6;
  float: left;
  width: 100%;
}

.comment-count h4 {
  font-weight: 500;
  font-size: 24px;
  color: #3b4952;
}

.comment-count p {
  margin-bottom: 0px;
}

.comment-list {
  float: left;
  width: 100%;
}

.comment-list .media:first-child {
  margin-top: 0px;
  border-bottom: 1px solid #eef3f6;
}

.comment-list .media {
  padding: 30px 45px;
  margin-top: 0px;
}

.comment-list .media .media-body .media {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: -80px;
  border-left: 1px solid #eef3f6;
  border-bottom: 1px solid #eef3f6;
}

.comment-list .media .media-body {
  position: relative;
}

.comment-list .media .media-left {
  padding-right: 20px;
}

.comment-list .media .nested-first {
  margin-top: 30px;
  border-top: 1px solid #eef3f6;
}

.comment-list .media .nested-first:before {
  position: absolute;
  left: -80px;
  top: 90px;
  content: '';
  width: 1px;
  background: #eef3f6;
  height: 170px;
}

.comment-list .media,
.comment-list .media-body {
  overflow: visible;
  zoom: 1;
}

.comment-list .media .media-body ul {
  margin-bottom: 0px;
}

.comment-list .media .media-body ul li a {
  color: #919ea8;
  font-size: 18px;
  font-weight: 500;
}

.comment-list .media .media-body ul li a:hover {
  color: #36a0e7;
}

.comment-list .media .media-body ul li a.reply-btn {
  color: #49545b;
  text-decoration: underline;
}

.comment-list .media .media-body ul li a.reply-btn:hover {
  color: #36a0e7;
}

.comment-list .media .media-body ul li {
  font-size: 18px;
  padding-right: 15px;
  color: #919ea8;
  font-weight: 500;
}

.comment-form {
  float: left;
  width: 100%;
  padding: 30px 45px;
}

.comment-form h4 {
  font-weight: 300;
  font-size: 28px;
  color: #3b4952;
  margin-bottom: 40px;
}

.comment-form .form-control {
  border-radius: 0px;
  background: #f1f4f6;
  border: none;
  height: 50px;
  color: #4a555c;
  font-size: 16px;
}

.comment-form .form-control::-webkit-input-placeholder {
  color: #4a555c;
}

.comment-form .form-control:-moz-placeholder {
  color: #4a555c;
}

.comment-form .form-control::-moz-placeholder {
  color: #4a555c;
}

.comment-form .form-control:-ms-input-placeholder {
  color: #4a555c;
}

.comment-form textarea.form-control {
  height: auto;
  min-height: 200px;
  resize: none;
}

.comment-form form {
  margin-bottom: 40px;
}

.vt-post.post .author-info ul li {
  padding-left: 15px;
  padding-right: 15px;
  float: none;
}

.vt-post.post .author-info {
  border-radius: 0px 0px 0px 3px;
  border-bottom: none;
  border-right: 1px solid #ddd;
  padding: 15px 12px 15px 12px;
}

.vt-post.post .post-img a img {
  border-radius: 3px 0px 0px 0px;
}

.vt-post.post .caption {
  padding: 25px 0px;
}

.post .caption h3 {
  margin: 0px 0px 20px 0px;
  color: #36a0e7;
  font-weight: 300;
  font-size: 34px;
  line-height: 42px;
}
.md-heading {
  font-size: 24px !important;
  line-height: 36px !important;
  margin-bottom: 15px !important;
}

.pagination>.active>a,
.pagination>.active>a:focus,
.pagination>.active>a:hover,
.pagination>.active>span,
.pagination>.active>span:focus,
.pagination>.active>span:hover {
  background-color: #3b4952;
  border-color: #3b4952;
}

.pagination>li>a,
.pagination>li>span {
  color: #2c3840;
  margin: 0px 5px;
  border-radius: 3px;
  -webkit-box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  -moz-box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  box-shadow: 0px 1px 3px 0px rgba(44, 56, 64, 0.2);
  border: none;
  font-size: 16px;
}

.pagination>li>a:focus,
.pagination>li>a:hover,
.pagination>li>span:focus,
.pagination>li>span:hover {
  background-color: #e74c3c;
  border-color: #e74c3c;
  color: #fff;
}

.pagination-wrap {
  width: 100%;
  float: left;
  margin-bottom: 35px;
}

.pagination {
  margin: 0px;
}


</style>