<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>{{ thePost.bandName }} - {{ thePost.albumName }}</h1>
      <a href="#" @click.prevent="deleteAlbumAndReview" v-if="isMyProfile" >
        <i class="fas fa-trash-alt delete-icon"></i>
      </a>
    </div>
    <div class="modal-close" @click="$emit('close')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="modal-image">
        <img :src="theAlbum.src" />
      </div>
      <div class="modal-info">
        <h2>{{ thePost.reviewTitle }}</h2>
        <p>{{ thePost.reviewContent }}</p>
        <h1 style="text-align: center;">{{ thePost.reviewPoint }} / 10</h1>
      </div>
    </div>
  </div>
</template>

<script>
  const axios = require('axios');

export default {
  name: "AlbumDetails",
  props: {
    theAlbum: {},
    propsPost: {}
  },
  data () {
    return {
      isMyProfile: false,
      showDialog: true,
      thePost: {}
    }
  },
  methods: {
    deleteAlbumAndReview () {
      this.deleteAlbum(this.theAlbum);
      this.deleteReview(this.thePost);
    },

    deleteAlbum (album) {
      axios.delete(this.$url + "/api/v1/albums/delete_album_by_album_id_for_user", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        },
        params: {
          album_id: album.albumId,
          user_id: localStorage.getItem('userId')
        }
      })
    },

    deleteReview (thePost) {
      axios.delete( this.$url + "/api/v1/reviews/delete_review_by_review_id", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        },
        params: {
          review_id : thePost.reviewId
        }
      }).then( (res) => {
        console.log(res);
        this.$emit('close');
        this.$router.push("/");
      })
    },

    getPost () {
      axios.get(this.$url + "/api/v1/reviews/get_post_by_album_id_and_username", {
            headers: {
              "Authorization": localStorage.getItem('userToken'),
            },
            params: {
              album_id: this.theAlbum.albumId,
              username: this.$route.params.username,
            }
          }).then(res => {
            this.thePost = res.data;
      })
    },

    checkMyProfile () {
      if(this.$route.path == "/" + localStorage.getItem('username')){
        this.isMyProfile = true;
      }else{
        this.isMyProfile = false;
      }
   }
  },
  mounted() {
    this.thePost = this.propsPost;
    this.checkMyProfile();
    if(this.thePost.bandName == ''){
      this.getPost();
    }
  }
}

</script>

<style scoped></style>