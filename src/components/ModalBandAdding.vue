<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>Select the band</h1>
      <div class="modal-confirm">
        <button class="btn-green" v-if="picked != null"
                @click="pushSelectedBandToParent"
                :disabled="isProgressActive">Next
<!--          <div v-if="isProgressActive">Next</div>
          <div v-else class="spinner-loader">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
            <div class="rect6"></div>
            <div class="rect7"></div>
            <div class="rect8"></div>
          </div>-->
        </button>
      </div>
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
        <button class="search-button" @click="searchBandName">Search</button>
      </div>
      <div class="select-section">
        <div class="card" v-for="(artist ,index) in bandList" v-bind:key="index">
          <div class="card-content" :tabindex="index" @click="picked = artist">
            <div class="text-part">
              <h3>{{ artist.name }}</h3>
            </div>
            <div class="image-part image-band">
              <img :src="artist.images[0].url"  v-if="artist.images.length > 0" />
              <img src="https://i.pinimg.com/originals/9e/df/af/9edfaf9d82b6d107b25cbe6824926572.png" v-else />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "BandAddingModal",
  props: {
    bandList: {
      required : true,
    }
  },
  data() {
    return {
      picked: null,
      inputBandName: '',
      allBands: [],
      showDialog : true,
      isProgressActive: false,
    }
  },
  methods: {
    searchBandName() {
      let query = this.inputBandName;

      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          'Authorization': 'Bearer ' + this.$attrs.token,
        },
        params: {
          q: query,
          type: "artist",
          limit: 30
        },
        json: true
      }).then((res) => {
        this.bandList = res.data.artists.items;
      })
    },
    pushSelectedBandToParent() {
      this.$emit('toAlbumPart', this.picked);
    }
  }
}
</script>

<style scoped>

.btn-green {
  width: 140px;
  cursor: pointer;
}

.modal {
  width: 80%;
  height: 85%;
}

.card .card-content:focus {
  outline: 8px solid #048315;
}

.modal .modal-guts {
  padding: 20px 20px 20px 20px;
}

.modal .modal-guts .modal-search-block {
  width: 30%;
  margin: 20px auto;
}

@media screen and (max-width: 768px){

  .btn-green {
    font-size: 1rem;
  }

  .modal .modal-header {
    justify-content: space-between;
  }

  .modal .modal-guts .modal-search-block {
    width: 80%;
  }

  .card .card-content .image-band {
    width: 100%;
    height: 100%;
  }

  @keyframes animateleft {
    from {left: -300px; opacity: 0}
    to {left: 35%; opacity: 1}
  }
}

@media screen and (max-width: 500px){

  .modal .modal-header .modal-confirm {
    right: 10px;
  }

  .btn-green {
    font-size: 0.8rem;
    width: 100px;
  }

}

</style>