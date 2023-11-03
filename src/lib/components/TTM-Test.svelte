<script lang="ts">
  export let prediction: string;
  export let top_attribute: number;
  export let explanation: string;
</script>

<form>
   <label for="top_attribute" class="label">
    <span>Among the following features, which one is the most important in influencing our machine learning model’s
    prediction (that is, variations in the value of that feature will most likely change the model’s prediction)?</span>
    <input
      type="text"
      name="important-attribute"
      id="important_attribute"
      class="input"
      min="0"
      max="200"
      bind:value={top_attribute}
    />
  </label>
  <label for="prediction" class="label">
    <span>Among the following features, which one is the least important in influencing our machine learning model’s
    prediction (that is, variations in the value of that feature will most unlikely change the model’s prediction)?</span>
    <input
      type="text"
      name="prediction"
      id="prediction"
      class="input"
      bind:value={prediction}
    />
  </label>
  <label for="explanation" class="label">
    <span>Which changes to this patient would result in a different model prediction?</span>
    <textarea
      name="explanation"
      id="explanation"
      class="input textarea"
      bind:value={explanation}
    ></textarea>
  <input type="submit" value="Next" style="width: 100%;" />
</form>