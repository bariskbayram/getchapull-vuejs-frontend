<template class="add-album-content">
  <Modal>
    <template v-slot:modal>
      <SearchBandModal :token="token" v-if="isSearchPart" @closeModal="closeModal" @toBandPart="toBandPart"></SearchBandModal>
      <BandAddingModal :token="token" :bandList="bandList" v-if="isBandPart" @closeModal="closeModal" @toAlbumPart="toAlbumPart"></BandAddingModal>
      <AlbumAddingModal :token="token" :bandId="band.id" v-if="isAlbumPart" @closeModal="closeModal" @toReviewPart="toReviewPart"></AlbumAddingModal>
      <ReviewAddingModal v-if="isReviewPart" @closeModal="closeModal" @pushAllDatas="checkBandAndPush"></ReviewAddingModal>
    </template>
  </Modal>
</template>

<script>
import SearchBandModal from "@/components/ModalSearchBand";
import BandAddingModal from "@/components/ModalBandAdding";
import AlbumAddingModal from "@/components/ModalAlbumAdding";
import ReviewAddingModal from "@/components/ModalReviewAdding";
import Modal from "@/components/Modal";

import qs from 'qs';

const axios = require('axios');

var client_id = '4cdcf550c1c7458485e09e5be020a556';
var client_secret = '1e906cf6ef71436cb163ca98e619aead';

export default {
  name: "AddAlbumContent",
  components: {Modal, ReviewAddingModal, AlbumAddingModal, BandAddingModal, SearchBandModal},
  data(){
    return{
      token: '',
      isSearchPart: true,
      isBandPart: false,
      isAlbumPart: false,
      isReviewPart: false,
      band: {},
      album: {},
      review: {},
      bandList: {},
      selectedBandImage: {},
      selectedAlbumImage: {},
      showDialog: true
    }
  },
  methods:{

    closeModal () {
      this.$emit('close');
    },

    getSpotifyToken () {
      var data = {
        grant_type: 'client_credentials',
      };

      var headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: client_id,
          password: client_secret,
        },
      }

      axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers)
          .then( (res) => {
            this.token = res.data.access_token;
          });
    },

    toBandPart (bandList) {
      this.bandList = bandList;
      this.isSearchPart = false;
      this.isBandPart = true;
    },

    toAlbumPart (band) {
      this.band = band;
      this.isBandPart = false;
      this.isAlbumPart = true;
    },

    toReviewPart (album) {
      this.album = album;
      this.isAlbumPart = false;
      this.isReviewPart = true;
    },

    checkBandAndPush (review) {
      this.review = review;
      if(this.review.reviewTitle == ''){
        this.review.reviewTitle = 'GetchaPull ! - No Title';
      }
      if(this.review.reviewContent == ''){
        this.review.reviewContent = 'GetchaPull ! - No Content';
      }
      this.pushBand();
    },

    async pushBand() {
      console.log("pushband")

      const images = this.band.images;

      if (images.length != 0) {
        let blob = await fetch(images[0].url).then(r => r.blob());
        this.selectedBandImage = blob;
      } else {
        return;
      }

      const formData = new FormData();
      formData.append("multipart_file", this.selectedBandImage);
      formData.append('band_dto', new Blob([JSON.stringify({
        "band_name": this.band.name,
        "band_spotify_id": this.band.id
      })], {
        type: "application/json"
      }));
      axios.post(this.$url + "/api/v1/bands/upload_band_with_image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('userToken')
            }
          }
      ).then((res) => {
        console.log("band uploaded successfully");
        this.band.bandId = res.data;
        console.log(this.band.bandId);
        this.pushAlbum();
      }).catch(err => {
        console.log(err);
      });
    },

    async pushAlbum() {
      console.log("pushAlbum")

      const images = this.album.images;

      if (images.length != 0) {
        let blob = await fetch(images[0].url).then(r => r.blob());
        this.selectedAlbumImage = blob;
      } else {
        return;
      }

      const formData = new FormData();
      formData.append("multipart_file", this.selectedAlbumImage);
      formData.append('album_dto', new Blob([JSON.stringify({
        "album_name": this.album.name,
        "album_spotify_id": this.album.id,
        "album_year": this.album.release_date.substring(0,4),
        "band_id": this.band.bandId,
        "user_id": localStorage.getItem('userId')
      })], {
        type: "application/json"
      }));

      axios.post(this.$url + "/api/v1/albums/upload_album_with_image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('userToken')
            }
          }
      ).then((res) => {
        console.log("album uploaded successfully");
        this.album.albumId = res.data;
        console.log(this.album.albumId);
        this.pushReview();
      }).catch(err => {
        console.log(err);
      });
    },

    pushReview () {
      console.log("pushReview")

      const formData = new FormData();
      formData.append('review_dto', new Blob([JSON.stringify({
        "review_title": this.review.reviewTitle,
        "review_content": this.review.reviewContent,
        "review_point": parseInt(this.review.reviewPoint),
        "album_id": this.album.albumId,
        "user_id": localStorage.getItem('userId')
      })], {
        type: "application/json"
      }));

      axios.post(this.$url + "/api/v1/reviews/upload_review",
          formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('userToken')
            }
          }
      ).then( () => {
        console.log("review uploaded successfully");
        this.$router.push("/" + localStorage.getItem('username')).catch( () => {});
        this.$emit('close');
      }).catch(err => {
        console.log(err);
      });
    }
  },
  created() {
    this.getSpotifyToken();
  }
}
</script>

<style scoped>

</style>