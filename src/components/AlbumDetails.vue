<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>{{ theReview.bandName }} - {{ theReview.albumName }}</h1>
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
        <h2>{{ theReview.title }}</h2>
        <p>{{ theReview.content }}</p>
        <h1 style="text-align: center;">{{ theReview.point }} / 10</h1>
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
    propsReview: {}
  },
  data () {
    return {
      isMyProfile: false,
      showDialog: true,
      theReview: {}
    }
  },
  methods: {
    deleteAlbumAndReview () {
      this.deleteAlbum(this.theAlbum);
      this.deleteReview(this.theReview);
    },

    deleteAlbum (album) {
      axios.delete(this.$url + "/api/albums/" + album.id, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: localStorage.getItem('username')
        }
      })
    },

    deleteReview (review) {
      axios.delete( this.$url + "/api/reviews/" + review.reviewId, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      }).then( (res) => {
        console.log(res);
        this.$emit('close');
        this.$router.push("/");
      })
    },

    getReview () {
      console.log("review getirildi.")
      axios.get(this.$url + "/api/reviews/" + this.theAlbum.id,
          {
            headers: {
              "Authorization": localStorage.getItem('user-token'),
            },
            params: {
              username: this.theAlbum.author,
            }
          }).then(res => {
            this.theReview = res.data;
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
    this.theReview = this.propsReview;
    this.checkMyProfile();
    if(this.theReview.bandName == ''){
      this.getReview();
    }
  }
}

</script>

<style scoped></style>