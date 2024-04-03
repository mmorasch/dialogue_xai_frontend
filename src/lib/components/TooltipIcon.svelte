<script lang="ts">
  export let message = '';
</script>

<span class="tooltip-icon-container">
  <span class="tooltip-icon">?</span>
  <span class="tooltip-text">{message}</span>
</span>

<style>
  .tooltip-icon-container {
    position: relative;
    display: inline-block;
  }
.tooltip-icon {
  background-color: grey; /* Change color to grey */
  color: #fff;
  text-align: center;
  border-radius: 50%;
  width: 15px; /* Make it smaller */
  height: 15px; /* Make it smaller */
  display: inline-block;
  line-height: 16px; /* Make it smaller */
  cursor: help;
}
  .tooltip-text {
    visibility: hidden;
    min-width: 200px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 15px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .tooltip-icon-container:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
</style>
