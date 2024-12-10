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
const client_id = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
const client_secret = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;

export default {
  name: "AddAlbumContent",
  components: {Modal, ReviewAddingModal, AlbumAddingModal, BandAddingModal, SearchBandModal},
  data() {
    return {
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
  methods: {
    closeModal() {
      this.$emit('close');
    },

    getSpotifyToken() {
      let data = {
        grant_type: 'client_credentials',
      };

      let headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: client_id,
          password: client_secret,
        },
      }

      axios.post('https://accounts.spotify.com/api/token',
          qs.stringify(data),
          headers
      ).then((res) => {
        this.token = res.data.access_token;
      });
    },

    toBandPart(bandList) {
      this.bandList = bandList;
      this.isSearchPart = false;
      this.isBandPart = true;
    },

    toAlbumPart(band) {
      this.band = band;
      this.isBandPart = false;
      this.isAlbumPart = true;
    },

    toReviewPart(album) {
      this.album = album;
      this.isAlbumPart = false;
      this.isReviewPart = true;
    },

    checkBandAndPush(review) {
      this.review = review;
      if (this.review.title === '') {
        this.review.title = 'GetchaPull ! - No Title';
      }
      if (this.review.content === '') {
        this.review.content = 'GetchaPull ! - No Content';
      }
      this.pushBand();
    },

    async pushBand() {
      const images = this.band.images;

      if (images.length !== 0) {
        this.selectedBandImage = await fetch(images[0].url).then(r => r.blob());
      } else {
        return;
      }

      const formData = new FormData();
      formData.append("multipart_file", this.selectedBandImage);
      formData.append('band_dto', new Blob([JSON.stringify({
        "name": this.band.name,
        "spotify_id": this.band.id
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
        this.band.id = res.data;
        this.pushAlbum();
      }).catch(err => {
        console.log(err);
      });
    },

    async pushAlbum() {
      const images = this.album.images;

      if (images.length !== 0) {
        this.selectedAlbumImage = await fetch(images[0].url).then(r => r.blob());
      } else {
        return;
      }

      const formData = new FormData();
      formData.append("multipart_file", this.selectedAlbumImage);
      formData.append('album_dto', new Blob([JSON.stringify({
        "name": this.album.name,
        "spotify_id": this.album.id,
        "year": this.album.release_date.substring(0,4),
        "band_id": this.band.id,
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
        this.album.id = res.data;
        this.pushReview();
      }).catch(err => {
        console.log(err);
      });
    },

    pushReview() {
      const formData = new FormData();
      formData.append('review_dto', new Blob([JSON.stringify({
        "title": this.review.title,
        "content": this.review.content,
        "point": parseInt(this.review.point),
        "album_id": this.album.id,
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
      ).then(() => {
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