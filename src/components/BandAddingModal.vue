<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <p>Adding a new album review !</p>
      </slot>
    </div>

    <div class="modal-body">
      <slot name="body">
        <input type="text" class="input-lg"  v-model="input_band_name" placeholder="Band name">
        <br/><br/>
        <button type="button" class="center-block btn-primary" @click="searchBandName">Search</button>
        <br/>
        <div v-for="(artist ,index) in allBands" v-bind:key="index">
          <input type="radio" v-bind:id="index" v-bind:value="index" v-model="picked">
          <a class="bands" v-bind:href="artist.external_urls.spotify" target="_blank">{{ artist.name }}</a>
          <br>
        </div>
      </slot>
    </div>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" @click="$emit('closeModal')">
          Cancel
        </button>
        <button class="btn btn-success" v-if="picked != null" @click="pushSelectedBandToParent">
          Next
        </button>
      </slot>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "BandAddingModal",
  data () {
    return {
      picked: null,
      input_band_name: '',
      allBands: []
    }
  },
  methods: {
    searchBandName () {
      var query = this.input_band_name;

      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': 'Bearer ' + this.$attrs.token,
        },
        params: {
          q: query,
          type: "artist",
          limit: 5
        },
        json: true
      }).then( (res) => {
        this.allBands = res.data.artists.items;
      })
    },
    pushSelectedBandToParent () {
      this.$emit('toAlbumPart', this.allBands[this.picked]);
    },
  }
}
</script>

<style scoped>

.bands{
  margin-left: 20px;
  font-size: large;
}

</style>