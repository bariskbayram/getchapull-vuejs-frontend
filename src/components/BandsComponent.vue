<template>

  <div class="profile-content">
    <div class="item" v-for="band in filteredBands" v-bind:key="band.bandId">
      <div class="card">
        <div class="card-content" @click="getBand(band)">
          <div class="image-part">
            <img :src="band.src" />
          </div>
          <div class="text-part">
            <h3>{{ band.bandName }}</h3>
          </div>
        </div>
      </div>
    </div>

    <Modal v-if="showModal">
      <template v-slot:modal>
        <BandDetails @close="showModal = false" :the-band="selectedBand"/>
      </template>
    </Modal>

  </div>
</template>

<script>
  import BandDetails from "@/components/BandDetails";
  import Modal from "@/components/Modal";
  const axios = require('axios');

  export default {
    name: "BandContent",
    components: {BandDetails, Modal},
    props: {
      filter: {},
    },
    data(){
      return {
        bands: [],
        selectedBand: {},
        showModal: false,
      }
    },
    methods:{

      setBandPhoto (band){
        axios.get(this.$url + "/api/v1/bands/download_band_image", {
          headers: {
            'Authorization': localStorage.getItem('userToken'),
            responseType: 'arrayBuffer'
          },
          params: {
            band_id : band.bandId
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
      axios.get(this.$url + "/api/v1/bands/get_bands_by_username", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
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

@media screen and (max-width: 500px){
  .item {
    margin: 0 auto;
  }
}

</style>