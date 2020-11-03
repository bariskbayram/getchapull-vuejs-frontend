<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <img style="width:100%" v-bind:src="theAlbum.src"/>
              <h2>{{ theAlbum.name }}</h2>
              <p> {{theAlbum.year}}</p>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <h3>{{theReview.title}}</h3>
              <p>{{theReview.content}}</p>
              <h2>{{theReview.point}}/10</h2>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if="isMyProfile" class="btn btn-warning" v-on:click="$emit('close')">
                Edit
              </button>
              <button v-if="isMyProfile" class="btn btn-danger" v-on:click="deleteAlbumAndReview">
                Delete
              </button>
              <button class="btn btn-primary" v-on:click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  const axios = require('axios');

export default {
  name: "AlbumDetails",
  props: {
    theAlbum: {}
  },
  data () {
    return {
      isMyProfile: false,
      theReview: {}
    }
  },
  methods: {
    deleteAlbumAndReview () {
      this.deleteAlbum(this.theAlbum);
      this.deleteReview(this.theReview);
      this.$emit('close');
    },
    deleteAlbum (album) {
      axios.delete(this.$url + "/api/albums/" + album.id, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      })
    },
    deleteReview (review) {
      axios.delete( this.$url + "/api/reviews/" + review.reviewId, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      })
    },
    getReview () {
      axios.get(this.$url + "/api/reviews/" + this.theAlbum.id,
          {
            headers: {
              "Authorization": localStorage.getItem('user-token'),
            },
            params: {
              username: this.$route.params.username
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
    this.checkMyProfile();
    this.getReview();
  }
}

</script>

<style scoped>

</style>