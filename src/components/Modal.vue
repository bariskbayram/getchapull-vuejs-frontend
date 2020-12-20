<template>
  <div>
    <slot name="modal">

    </slot>
    <div class="modal-overlay" id="modal-overlay"></div>
  </div>
</template>

<script>
export default {
  name: "Modal",
}
</script>

<style scoped>

.modal-overlay {
  z-index: 1035;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  background-color: rgba(0, 0, 0, 0.755);
}

.noscroll{
  overflow-y: hidden;
}

</style>