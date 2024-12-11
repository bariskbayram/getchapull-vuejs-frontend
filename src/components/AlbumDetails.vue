<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>{{ thePost.band_name }} - {{ thePost.album_name }}</h1>
      <a href="#" @click.prevent="deleteReview" v-if="isMyProfile" >
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
        <h2>{{ thePost.title }}</h2>
        <p>{{ thePost.content }}</p>
        <h1 style="text-align: center;">{{ thePost.point }} / 10</h1>
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
  data() {
    return {
      isMyProfile: false,
      showDialog: true,
      thePost: {}
    }
  },
  methods: {
    deleteReview() {
      this.$apiClient.delete("/api/v1/reviews/delete_review_by_review_id", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        },
        params: {
          review_id : this.thePost.id
        }
      }).then(() => {
        this.$emit('close');
        this.$router.push("/");
      })
    },

    getPost() {
      this.$apiClient.get("/api/v1/reviews/get_post_by_album_id_and_username", {
        headers: {
          "Authorization": localStorage.getItem('userToken'),
        },
        params: {
          album_id: this.theAlbum.id,
          username: this.$route.params.username,
        }
      }).then(res => {
        this.thePost = res.data;
      })
    },

    checkMyProfile() {
      this.isMyProfile = this.$route.path === "/" + localStorage.getItem('username');
   }
  },
  mounted() {
    this.thePost = this.propsPost;
    this.checkMyProfile();
    if (this.thePost.band_name === '') {
      this.getPost();
    }
  }
}

</script>

<style scoped></style>