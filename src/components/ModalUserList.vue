<template>

  <div class="modal" id="modal">
    <div class="modal-header">
      <h1>{{info}}</h1>
    </div>
    <div class="modal-close" @click="$emit('closeModal')">
      <div class="close-rotation">
        <div class="line1"></div>
        <div class="line2"></div>
      </div>
    </div>
    <div class="modal-guts">
      <div class="select-section" >
        <div class="card" v-for="(user ,index) in userList" v-bind:key="index">
          <div class="user-content" tabindex="0">
            <div class="text-part">
              <a v-bind:href="'/' + user.username"> <h3>{{  user.username }}</h3> </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalUserList",
  props: {
    userList: {
      required : true
    },
    isFollowers: {
      required: true
    }
  },
  data() {
    return{
      info: ''
    }
  },
  created() {
    if (this.isFollowers) {
      this.info = "Followers"
    } else {
      this.info = "Followings"
    }
  }
}
</script>

<style scoped>

</style>