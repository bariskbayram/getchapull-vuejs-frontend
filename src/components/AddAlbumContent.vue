<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <p>Adding a new album review !</p>
            </slot>
          </div>

          <div class="modal-body">
            <slot v-if="isBandPart" name="body">
              <input type="text" class="input-lg" v-model="band.band_name" placeholder="Band name">
              <br/><br/>
              <br/><br/>
              <input type="file" v-on:change="onBandFileChanged">
            </slot>
            <slot v-if="isAlbumPart" name="body">
              <input type="text" class="input-lg" v-model="album.album_title" placeholder="Album title">
              <br/><br/>
              <input class="input-lg" type="number" v-model="album.year" placeholder="Year">
              <br/><br/>
              <br/><br/>
              <input type="file" v-on:change="onAlbumFileChanged">
              <br/><br/>
            </slot>
            <slot v-if="isReviewPart" name="body">
              <input type="text" class="input-lg" v-model="review.review_title" placeholder="Review Title">
              <br/><br/>
              <input type="text" class="input-lg" v-model="review.review_content" placeholder="Review Content">
              <br/><br/>
              <input type="number" class="input-lg" v-model="review.review_point" placeholder="Review Point">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-danger" v-on:click="$emit('close')">
                Cancel
              </button>
              <button v-if="isBandPart" class="btn btn-success" v-on:click="toAlbumPart">
                Next
              </button>
              <button v-if="isAlbumPart" class="btn btn-success" v-on:click="toReviewPart">
                Next
              </button>
              <button v-if="isReviewPart" class="btn btn-success" v-on:click="pushReview">
                Create
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
  name: "AddAlbumContent",
  data(){
    return{
      isBandPart: true,
      isAlbumPart: false,
      isReviewPart: false,
      band: {
        band_id: '',
        band_name: '',
        selectedBandFile:null
      },
      album: {
        album_id: '',
        album_title: '',
        year: '',
        selectedAlbumFile:null,
      },
      review: {
        review_title: '',
        review_content: '',
        review_point: ''
      }
    }
  },
  methods:{
    toAlbumPart () {
      axios.get("https://metal-review-spring.herokuapp.com/api/bands/" + this.band.band_name + "?username=" + this.$route.params.username,
      {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      }).then(res => {
        console.log(res)
        if(res.data == false){
          this.pushBand();
        }
        this.isBandPart = false;
        this.isAlbumPart = true;
      })
    },
    toReviewPart () {
      this.pushAlbum();
      this.isAlbumPart = false;
      this.isReviewPart = true;
    },
    onAlbumFileChanged(event){
      this.album.selectedAlbumFile = event.target.files[0]
    },
    onBandFileChanged(event){
      this.band.selectedBandFile = event.target.files[0]
    },
    pushBand () {
      console.log("pushband")

      const formData = new FormData();
      formData.append("band_file", this.band.selectedBandFile);
      formData.append("band_name", this.band.band_name);
      formData.append("username", this.$route.params.username);
      axios.post("https://metal-review-spring.herokuapp.com/api/bands/image/upload",
          formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then( (res) => {
        console.log("band uploaded successfully");
        this.band.band_id = res.data;
      }).catch(err => {
        console.log(err);
      });
    },
    pushAlbum () {
      console.log("pushAlbum")

      const formData = new FormData();
      console.log("this.band.band_id" + this.band.band_id)

      formData.append("album_file", this.album.selectedAlbumFile);
      formData.append("album_title", this.album.album_title);
      formData.append("band_id", this.band.band_id);
      formData.append("year", this.album.year);
      formData.append("username", this.$route.params.username);
      axios.post("https://metal-review-spring.herokuapp.com/api/albums/image/upload",
          formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then( (res) => {
        console.log("album uploaded successfully");
        this.album.album_id = res.data;
      }).catch(err => {
        console.log(err);
      });
    },
    pushReview () {
      console.log("pushReview")

      const formData = new FormData();
      formData.append("review_title", this.review.review_title);
      formData.append("review_content", this.review.review_content);
      formData.append("review_point", this.review.review_point);
      formData.append("album_id", this.album.album_id);
      formData.append("username", this.$route.params.username);
      axios.post("https://metal-review-spring.herokuapp.com/api/reviews",
          formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then( () => {
        console.log("review uploaded successfully");
        this.$emit('close');
      }).catch(err => {
        console.log(err);
      });
    }

  }
}
</script>

<style scoped>

</style>