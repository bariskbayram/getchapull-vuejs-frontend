<template>
  <div class="row">
    <div class="col-xs-12 col-md-3" v-for="(album, index) in filteredAlbums" v-bind:key="index">
      <button class="album-thumb button-img" v-on:click="getAlbum(album)">
        <div class="thumbnail">
          <img id="album-id" class="crop-img" v-bind:src="album.src" alt=""/>
          <div class="variable">
            <h3> {{album.name}} </h3>
          </div>
        </div>
      </button>
    </div> <!-- / col -->
    <AlbumDetails v-if="showModal" @close="showModal = false" :the-album="selectedAlbum">

    </AlbumDetails>
  </div> <!-- / row -->

</template>

<script>
  import AlbumDetails from "@/components/AlbumDetails";
  const axios = require('axios');

  export default {
    name: "AlbumContent",
    components: {AlbumDetails},
    props: {
      filter: {}
    },
    data(){
      return {
        albums: [],
        selectedAlbum: {},
        showModal: false
      }
    },
    methods:{
      setAlbumCover(album){
        axios.get(this.$url + "/api/albums/" + album.id + "/image/download",
        {
          headers: {
            'Authorization': localStorage.getItem('user-token'),
            responseType: 'arrayBuffer'
          },
          params: {
            username: this.$route.params.username
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
      }
    },
    mounted() {
      axios.get(this.$url + "/api/albums",
      {
        headers: {
          "Authorization": localStorage.getItem('user-token'),
        },
        params: {
          username: this.$route.params.username
        }
      }).then( res => {
        this.albums = res.data;
        this.albums.forEach(this.setAlbumCover);
      })
    },
    computed: {
      filteredAlbums () {
        return this.albums.filter(album => {
          return album.name.toLocaleLowerCase().includes(this.filter.toLowerCase())
        })
      }
    }
  }
</script>

<style scoped>

</style>