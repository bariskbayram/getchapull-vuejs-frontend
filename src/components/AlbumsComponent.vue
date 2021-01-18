<template>

  <div class="profile-content">
    <div class="item" v-for="(album, index) in filteredAlbums" v-bind:key="index">
      <div class="card">
        <div class="card-content" @click="getAlbum(album)">
          <div class="image-part">
            <img :src="album.src" />
          </div>
          <div class="text-part">
            <h3>{{ album.albumName }}</h3>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showModal">
      <template v-slot:modal>
        <AlbumDetails @close="showModal = false"
                      :the-album="selectedAlbum" :props-post="fakeReview" />
      </template>
    </Modal>

  </div>
</template>

<script>
  import AlbumDetails from "@/components/AlbumDetails";
  import Modal from "@/components/Modal";
  const axios = require('axios');

  export default {
    name: "AlbumContent",
    components: {AlbumDetails, Modal},
    props: {
      filter: {}
    },
    watch: {
      '$route': 'getAllAlbums'
    },
    data(){
      return {
        albums: [],
        selectedAlbum: {},
        showModal: false,
        fakeReview: {
          'bandName': '',
          'albumName': '',
          'reviewTitle': '',
          'reviewContent': '',
          'reviewPoint': ''
        }
      }
    },
    methods:{
      setAlbumCover(album){
        axios.get(this.$url + "/api/v1/albums/download_album_image", {
          headers: {
            'Authorization': localStorage.getItem('userToken'),
            responseType: 'arrayBuffer'
          },
          params: {
            album_id : album.albumId
          }
        }).then( res => {
          album.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
          this.showModal = true;
          this.showModal = false;
        });
      },

      getAlbum(album){
        this.selectedAlbum = album;
        this.showModal = true;
      },

      getAllAlbums(){
        axios.get(this.$url + "/api/v1/albums/get_albums_by_username", {
              headers: {
                "Authorization": localStorage.getItem('userToken'),
              },
              params: {
                username: this.$route.params.username
              }
            }).then( res => {
          this.albums = res.data.reverse();
          this.albums.forEach(this.setAlbumCover);
        })
      }
    },
    mounted() {
      this.getAllAlbums();
    },
    computed: {
      filteredAlbums () {
        return this.albums.filter(album => {
          return album.albumName.toLocaleLowerCase().includes(this.filter.toLowerCase())
        })
      }
    }
  }
</script>

<style scoped>

@media screen and (max-width: 500px){
  .item {
    margin: 0 auto;
  }
}

</style>