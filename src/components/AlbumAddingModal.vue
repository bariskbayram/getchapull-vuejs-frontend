<template>
  <div>
    <div class="modal-header">
      <slot name="header">
        <p>Adding a new album review !</p>
      </slot>
    </div>

    <div class="modal-body">
      <slot name="body">
        <div v-for="(album ,index) in allAlbums" v-bind:key="index">
          <input type="radio" v-bind:id="index" v-bind:value="index" v-model="picked">
          <a class="albums" v-bind:href="album.external_urls.spotify" target="_blank">{{ album.name }} - {{ album.release_date.substring(0,4)}}</a>
          <br>
        </div>
      </slot>
    </div>

    <div class="modal-footer">
      <slot name="footer">
        <button class="btn btn-danger" @click="$emit('closeModal')">
          Cancel
        </button>
        <button class="btn btn-success" v-if="picked != null" @click="pushSelectedAlbumToParent">
          Next
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
      allAlbums: []
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
          limit: 10
        },
        json: true
      }).then( (res) => {
        console.log(res)
        this.allAlbums = res.data.items;
      })
    },
    pushSelectedAlbumToParent () {
      this.$emit('toReviewPart', this.allAlbums[this.picked]);
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
</style>