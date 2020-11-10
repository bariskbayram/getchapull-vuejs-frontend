<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-3" v-for="band in filteredBands" v-bind:key="band.band_id">

        <md-card md-with-hover style="background: #cce4c1">
          <div @click="getBand(band)">
            <md-ripple >

              <md-card-media-cover >
                <md-card-media md-ratio="1:1">
                  <img :src="band.src" alt=""/>
                </md-card-media>
              </md-card-media-cover>

            </md-ripple>
            <div class="variable">
              <h3 style="margin-left: 7px"> {{band.bandName}} </h3>
              <p style="margin-left: 7px"> Count: {{band.counter}}</p>
            </div>
          </div>
        </md-card>
      </div> <!-- / col -->
      <BandDetails v-if="showModal" @close="showModal = false" :the-band="selectedBand">

      </BandDetails>
    </div> <!-- / row -->
  </div>
</template>

<script>
  import BandDetails from "@/components/BandDetails";
  const axios = require('axios');

  export default {
    name: "BandContent",
    components: {BandDetails},
    props: {
      filter: {},
    },
    data(){
      return {
        bands: [],
        selectedBand: {},
        showModal: false
      }
    },
    methods:{
      setBandPhoto (band){
        axios.get(this.$url + "/api/bands/" + band.bandId + "/image/download",
        {
          headers: {
            'Authorization': localStorage.getItem('user-token'),
            responseType: 'arrayBuffer'
          },
          params: {
            username: this.$route.params.username
          }
        }).then( res => {
          band.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
          this.getBand(band);
          this.showModal = false;
        });
      },
      getBand (band) {
        this.selectedBand = band;
        this.showModal = true;
      }
    },
    mounted () {
      axios.get(this.$url + "/api/bands",
      {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        },
        params: {
          username: this.$route.params.username
        }
      }).then( res => {
        this.bands = res.data.reverse();
        this.bands.forEach(this.setBandPhoto);
      });
    },
    computed: {
      filteredBands () {
        return this.bands.filter(band => {
          return band.bandName.toLocaleLowerCase().includes(this.filter.toLowerCase())
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