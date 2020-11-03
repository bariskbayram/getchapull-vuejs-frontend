<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <p>Adding a new album review !</p>
      </slot>
    </div>

    <md-app>
      <md-app-content>
        <div class="col-md-4 every-card" v-for="(album ,index) in allAlbums" v-bind:key="index">
          <md-checkbox v-model="picked" :value="album">
            <md-card>
              <md-card-header>
                <div class="md-title">{{album.name}} - {{album.release_date.substring(0,4)}}</div>
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
        <button class="btn btn-success" :disabled="isProgressActive" v-if="picked != null" @click="pushSelectedAlbumToParent">
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
  name: "AlbumAddingModal",
  data () {
    return {
      picked: null,
      allAlbums: [],
      isProgressActive: false,
    }
  },
  methods: {
    getAllAlbums () {
      axios.get("https://api.spotify.com/v1/artists/" + this.$attrs.bandId + "/albums", {
        headers: {
          'Authorization': 'Bearer ' + this.$attrs.token,
          "Accept" : "application/json",
          "Content-Type": "application/json"
        },
        params: {
          limit: 30
        },
        json: true
      }).then( (res) => {
        console.log(res)
        this.allAlbums = res.data.items;
      })
    },
    pushSelectedAlbumToParent () {
      this.$emit('toReviewPart', this.picked);
    },
  },
  created() {
    this.getAllAlbums();
  }
}
</script>

<style scoped>
.albums{
  margin-left: 20px;
  font-size: large;
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