<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-3" v-for="band in bands" v-bind:key="band.bandId">
        <a href="#" class="band-thumb">
          <div class="thumbnail">
            <img class="crop-img crop-band" v-bind:src="setBandPhoto(band)" alt=""/>
            <div class="variable">
              <h3> {{band.bandName}} </h3>
            </div>
          </div>
        </a>
      </div> <!-- / col -->
    </div> <!-- / row -->
  </div>
</template>

<script>
  const axios = require('axios');
  const apiURL = "http://localhost:8080/api/bands";
  
  export default {
    name: "BandContent",
    data(){
      return {
        bands: []
      }
    },
    methods:{
      setBandPhoto(band){
        axios.get(apiURL + "/" + band.bandId + "/image/download?username=" + this.$route.params.username, 
        {
          headers: {
            'Authorization': localStorage.getItem('user-token'),
          }
        }).then( res => {
          console.log(res)
        })
      }
    },
    mounted() {
      axios.get(apiURL + "?username=" + this.$route.params.username, 
      {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      }).then( res => {
        console.log(res)
        this.bands = res.data;
      })
    }
  }
</script>

<style scoped>

</style>