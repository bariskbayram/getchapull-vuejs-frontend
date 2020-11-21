<template>
  <div class="row">
    <div class="col-xs-12 col-md-3" v-for="(album, index) in filteredAlbums"
         v-bind:key="index">

      <md-card md-with-hover style="background: #cce4c1">
        <div @click="getAlbum(album)">
          <md-ripple >

            <md-card-media-cover >
              <md-card-media md-ratio="1:1">
                <img :src="album.src" alt=""/>
              </md-card-media>
            </md-card-media-cover>

          </md-ripple>
          <div class="variable">
            <h3 style="margin-left: 7px"> {{album.name}} </h3>
          </div>
        </div>
      </md-card>
    </div> <!-- / col -->

    <AlbumDetails v-if="showModal" @close="showModal = false" :the-album="selectedAlbum" :props-review="fakeReview">

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
          'title': '',
          'content': '',
          'point': ''
        }
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
      },
      getAllAlbums(){
        console.log("çalişti")
        axios.get(this.$url + "/api/albums",
            {
              headers: {
                "Authorization": localStorage.getItem('user-token'),
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
          return album.name.toLocaleLowerCase().includes(this.filter.toLowerCase())
        })
      }
    }
  }
</script>

<style scoped>

  .col-xs-12 {
    margin-bottom: 20px;
  }

</style>