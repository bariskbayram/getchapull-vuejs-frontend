<template class="add-album-content">
  <md-dialog :md-active.sync="showDialog"
               @md-closed="$emit('close')" @md-clicked-outside="$emit('close')">

    <BandAddingModal :token="token" v-if="isBandPart" @closeModal="closeModal" @toAlbumPart="toAlbumPart"></BandAddingModal>
    <AlbumAddingModal :token="token" :bandId="band.id" v-if="isAlbumPart" @closeModal="closeModal" @toReviewPart="toReviewPart"></AlbumAddingModal>
    <ReviewAddingModal v-if="isReviewPart" @closeModal="closeModal" @pushAllDatas="checkBandAndPush"></ReviewAddingModal>

  </md-dialog>
</template>

<script>
import BandAddingModal from "@/components/ModalBandAdding";
import AlbumAddingModal from "@/components/ModalAlbumAdding";
import ReviewAddingModal from "@/components/ModalReviewAdding";

import qs from 'qs';

const axios = require('axios');

var client_id = '4cdcf550c1c7458485e09e5be020a556';
var client_secret = '1e906cf6ef71436cb163ca98e619aead';

export default {
  name: "AddAlbumContent",
  components: {ReviewAddingModal, AlbumAddingModal, BandAddingModal},
  data(){
    return{
      token: '',
      isBandPart: true,
      isAlbumPart: false,
      isReviewPart: false,
      band: {},
      album: {},
      review: {},
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
      if(this.review.review_title == ''){
        this.review.review_title = '!';
      }
      if(this.review.review_content == ''){
        this.review.review_content = '!';
      }
      console.log("çalişti")
      axios.get(this.$url + "/api/bands/" + this.band.name,
      {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: this.$route.params.username
        }
      }).then(res => {
        console.log(res)
        if(res.data == ""){
          this.pushBand();
        }else{
          this.band.band_id = res.data;
          this.checkAlbumExist();
        }
      })
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
      formData.append("band_file", this.selectedBandImage);
      formData.append("band_name", this.band.name);
      formData.append("username", this.$route.params.username);
      axios.post(this.$url + "/api/bands/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then((res) => {
        console.log("band uploaded successfully");
        this.band.band_id = res.data;
        this.checkAlbumExist();
      }).catch(err => {
        console.log(err);
      });
    },

    checkAlbumExist () {
      axios.get(this.$url + "/api/albums/isExist/" + this.album.name,
          {
            headers: {
              'Authorization': localStorage.getItem('user-token'),
            },
            params: {
              bandId: this.band.band_id,
              username: this.$route.params.username
            }
          }).then(res => {
        console.log(res)
        if(res.data == false){
          this.pushAlbum();
        }else{
          this.$emit('close');
          return;
        }
      })
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
      console.log("this.band.band_id" + this.band.band_id)

      formData.append("album_file", this.selectedAlbumImage);
      formData.append("album_title", this.album.name);
      formData.append("band_id", this.band.band_id);
      formData.append("year", this.album.release_date);
      formData.append("username", this.$route.params.username);
      axios.post(this.$url + "/api/albums/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
            }
          }
      ).then((res) => {
        console.log("album uploaded successfully");
        this.album.album_id = res.data;
        this.pushReview();
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
      formData.append("album_name", this.album.name);
      formData.append("band_name", this.band.name);
      formData.append("username", this.$route.params.username);
      formData.append("date", new Date());
      axios.post(this.$url + "/api/reviews",
          formData,
          {
            headers:{
              "Content-Type":"multipart/form-data",
              "Authorization": localStorage.getItem('user-token')
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