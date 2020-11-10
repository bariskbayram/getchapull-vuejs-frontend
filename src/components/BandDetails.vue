<template>
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="$emit('close')" @md-clicked-outside="$emit('close')">
      <md-app>
        <md-app-content>
          <div class="modal-header">
            <h2>{{ theBand.name }}</h2>
          </div>

          <div class="modal-body">
            <div class="col-md-6">
              <slot name="header">
                <img class="img-mine" style="width:60%" v-bind:src="theBand.src"/>
              </slot>
            </div>
            <slot name="body">

            </slot>
          </div>
        </md-app-content>
      </md-app>


      <div class="modal-footer">
        <slot name="footer">
          <button v-if="isMyProfile" class="btn btn-warning" v-on:click="$emit('close')">
            Edit
          </button>
          <button v-if="isMyProfile" class="btn btn-danger" v-on:click="deleteBand">
            Delete
          </button>
          <button class="btn btn-primary" v-on:click="$emit('close')">
            Close
          </button>
        </slot>
      </div>
    </md-dialog>
  </div>
</template>

<script>

const axios = require('axios');

export default {
  name: "BandDetails",
  props: {
    theBand: {}
  },
  data () {
    return {
      isMyProfile: false,
      showDialog: true
    }
  },
  methods: {
    deleteBand () {
      console.log(this.theBand);
      axios.delete(this.$url + "/api/bands/" + this.theBand.bandId, {
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