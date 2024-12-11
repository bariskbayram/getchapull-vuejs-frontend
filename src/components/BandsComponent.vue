<template>

  <div class="profile-content">
    <div class="item" v-for="band in filteredBands" v-bind:key="band.id">
      <div class="card">
        <div class="card-content" @click="getBand(band)">
          <div class="image-part">
            <img :src="band.src" />
          </div>
          <div class="text-part">
            <h3>{{ band.name }}</h3>
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
    data() {
      return {
        bands: [],
        selectedBand: {},
        showModal: false,
      }
    },
    methods: {
      setBandPhoto(band) {
        this.$apiClient.get("/api/v1/bands/download_band_image", {
          headers: {
            'Authorization': localStorage.getItem('userToken'),
            responseType: 'arrayBuffer'
          },
          params: {
            band_id : band.id
          }
        }).then( res => {
          band.src = "data:image/jpeg;base64," + Buffer.from(res.data, 'binary');
          this.getBand(band);
          this.showModal = false;
        });
      },

      getBand(band) {
        this.selectedBand = band;
        this.showModal = true;
      }
    },
    mounted() {
      this.$apiClient.get("/api/v1/bands/find_bands_reviewed_by_user", {
        headers: {
          'Authorization': localStorage.getItem('userToken'),
        },
        params: {
          username: this.$route.params.username
        }
      }).then( res => {
        this.bands = res.data;
        this.bands.forEach(this.setBandPhoto);
      });
    },
    computed: {
      filteredBands() {
        return this.bands.filter(band => {
          return band.name.toLocaleLowerCase().includes(this.filter.toLowerCase())
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