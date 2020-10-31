<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <img style="width:100%" v-bind:src="theBand.src"/>
              <h2>{{ theBand.bandName }}</h2>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">

            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button v-if="isMyProfile" class="btn btn-warning" v-on:click="$emit('close')">
                Edit
              </button>
              <button v-if="isMyProfile" class="btn btn-danger" v-on:click="deleteBand(theBand)">
                Delete
              </button>
              <button class="btn btn-primary" v-on:click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

const axios = require('axios');
const apiURL = "https://metal-review-spring.herokuapp.com/api/bands";

export default {
  name: "BandDetails",
  props: {
    theBand: {}
  },
  data () {
    return {
      isMyProfile: false
    }
  },
  methods: {
    deleteBand (band) {
      axios.delete(apiURL + "/" + band.bandId, {
        headers: {
          'Authorization': localStorage.getItem('user-token'),
        }
      })
      this.$emit('close');
    },
    checkMyProfile () {
      if(this.$route.path == "/" + localStorage.getItem('username')){
        this.isMyProfile = true;
      }else{
        this.isMyProfile = false;
      }
    }
  },
  mounted() {
    this.checkMyProfile();
  }
}
</script>

<style scoped>

</style>