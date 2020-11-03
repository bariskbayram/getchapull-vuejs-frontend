<template>
  <div>
    <div class="modal-header">
        <slot name="header">
          <h2>Adding a new album review !</h2>
        </slot>
    </div>

    <md-app>
      <md-app-content>
        <div class="modal-body">
          <slot name="body">
            <input type="text" class="input-lg button-mine"  v-model="input_band_name" placeholder="Band name">
            <br/><br/>
            <button type="button" class="btn-primary button-other" @click="searchBandName">Search</button>
            <br/>
          </slot>
        </div>

        <div class="col-md-4 every-card" v-for="(artist ,index) in allBands" v-bind:key="index">
          <md-checkbox v-model="picked" :value="artist">
            <md-card>
              <md-card-header>
                <div class="md-title">{{artist.name}}</div>
              </md-card-header>
              <md-card-media md-medium>
                <img src="https://i.scdn.co/image/9e7b87a0d576a0d4f8402964fcbd1852aa4c5da6"/>
              </md-card-media>
            </md-card>
          </md-checkbox>
        </div>
      </md-app-content>
    </md-app>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" @click="$emit('closeModal')">
          Cancel
        </button>
        <button class="btn btn-success" :disabled="isProgressActive" v-if="picked != null" @click="pushSelectedBandToParent">
          <span v-if="!isProgressActive">
                    Next
          </span>
          <span v-else>
            <md-progress-spinner id="spinner" :md-diameter="20" :md-stroke="3"
                                 md-mode="indeterminate"/>
          </span>
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
      allBands: [],
      showDialog : true,
      isProgressActive: false,
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
          limit: 10
        },
        json: true
      }).then( (res) => {
        this.allBands = res.data.artists.items;
      })
    },
    pushSelectedBandToParent () {
      this.$emit('toAlbumPart', this.picked);
    },
  }
}
</script>

<style scoped>

.bands{
  margin-left: 20px;
  font-size: large;
}

.button-mine {
  margin-left: 55px;
}

.button-other {
  margin-left:165px;
}

.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.md-app {
  max-height: 450px;
  border: 1px solid;
}

.every-card {
  margin-bottom: 40px;
}

.md-checkbox {
  margin-bottom: 400px;
}

</style>