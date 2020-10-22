<template>
  <div class="row">
    <div class="col-xs-12 col-md-3" v-for="album in albums" v-bind:key="album.id">
      <a href="#" class="album-thumb">
        <div class="thumbnail">
          <img class="crop-img" v-bind:src="setAlbumCover(album)" alt=""/>
          <div class="variable">
            <h3> {{album.name}} </h3>
          </div>
        </div>
      </a>
    </div> <!-- / col -->
  </div> <!-- / row -->

</template>

<script>
  const axios = require('axios');
  // const apiURL = "http://localhost:8080/api/albums";
  const apiHeroku = "https://metal-review-spring.herokuapp.com/api/albums";
  
  export default {
    name: "AlbumContent",
    data(){
      return {
        albums: [],
        isShowing : true
      }
    },
    methods:{
      setAlbumCover(album){
        console.log("album photo istendi.")
        axios.get(apiHeroku + "/" + album.id + "/image/download?username=" + this.$route.params.username,
        {
          headers: {
            'Authorization': localStorage.getItem('user-token'),
          }
        })
      }
    },
    mounted() {
      axios.get(apiHeroku + "?username=" + this.$route.params.username,
      {
        headers: {
          "Authorization": localStorage.getItem('user-token'),
        }
      }).then( res => {
        console.log(res)
        this.albums = res.data;
      })
    }
  }
</script>