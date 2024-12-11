<template>
  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>Search for band</h1>
    </div>
    <div class="modal-close" @click="$emit('closeModal')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="search-block modal-search-block">
        <input class="search-bar search-modal" type="text" placeholder="| Search"
               v-model="inputBandName" autofocus="" @keyup.enter="searchBandName">
        <i class="fas fa-search"></i>
      </div>
      <div class="search-button-section">
        <button
            class="search-button"
            @click="searchBandName"
            :disabled="isProgressActive">
          <div v-if="!isProgressActive">Search</div>
          <div v-else class="spinner-loader">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
            <div class="rect6"></div>
            <div class="rect7"></div>
            <div class="rect8"></div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "SearchSection",
  data() {
    return {
      inputBandName: '',
      allBands: [],
      isProgressActive: false
    }
  },
  methods: {
    searchBandName() {
      if (this.inputBandName === '') return;

      this.isProgressActive = true;

      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': 'Bearer ' + this.$attrs.token,
        },
        params: {
          q: this.inputBandName,
          type: "artist",
          limit: 30
        },
        json: true
      }).then((res) => {
        this.allBands = res.data.artists.items;
        this.isProgressActive = false;
        this.$emit('toBandPart', this.allBands);
      })
    }
  }
}
</script>

<style scoped>

.modal .modal-guts .search-button-section .search-button:disabled {
  background: rgb(52, 87, 213);
  border-color: white;
  color: white;
}

.spinner-loader > div {
  height: 80%;
}

.modal {
  height: 35%;
}

.modal .modal-header {
  height: 25%;
}

.modal .modal-guts {
  height: 75%;
}

.modal .modal-guts .modal-search-block {
  width: 80%;
  margin: 20px auto;
}

</style>