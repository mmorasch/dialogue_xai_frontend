<script lang="ts">
  export let prediction: string;
  export let confidence: number;
  export let explanation: string;
</script>

<form>
  <label for="prediction" class="label">
    <span>What do you think the model will predict?</span>
    <input
      type="text"
      name="prediction"
      id="prediction"
      class="input"
      bind:value={prediction}
    />
  </label>
  <label for="confidence" class="label">
    <span>How confident are you in your prediction?</span>
    <input
      type="range"
      name="confidence"
      id="confidence"
      class="input range"
      min="0"
      max="100"
      bind:value={confidence}
    />
  </label>
  <label for="explanation" class="label">
    <span>Why do you think the model will predict this?</span>
    <textarea
      name="explanation"
      id="explanation"
      class="input textarea"
      bind:value={explanation}
    ></textarea>
  <input type="submit" value="Next" style="width: 100%;" />
</form>