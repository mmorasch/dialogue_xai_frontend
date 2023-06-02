<script lang="ts">
	import { RadioGroup, RadioItem, RangeSlider, Step, Stepper } from '@skeletonlabs/skeleton';

	export let gender: string = 'm';
	export let fam_ml_val: number = 5;
	export let fam_cr_val: number = 5;
	export let max: number = 10;
</script>

<h1 class="text text-4xl">Dear Participant, welcome to the study!</h1>
<Stepper buttonCompleteLabel="Start experiment" on:complete={()=>{}}>
	<Step>
		<p>
			We are excited to welcome you to our study on understanding decisions of machine learning
			models. <br />
			This research aims to gain a better understanding of the questions and answers that lead to a good
			understanding of the behaviour of a machine learning model. <br />
			We appreciate your willingness to take part in our research. <br />
		</p>

		<p class="m my-12">
			Your responses will be kept confidential, and we will only use them to help us analyze the
			results of our study. <br /> <br />

			Thank you for your participation. We appreciate your time and effort in contributing to our
			research. <br /><br />
			Sincerely, <br /><br />

			Dimitry Mindlin, PhD Candidate, University of Bielefeld
		</p>
	</Step>
	<Step>
		<p>
			Before we begin, we would like to gather some information about you that will help us better
			understand the results of our study. <br /> <br>
			Please take a moment to answer the following questions:
		</p>
		<hr class="bd-4">
		<div class="grid grid-cols-2 gap-8">
			<label for="age" class="label text-center">
				What is your age?
				<input type="number" name="age" id="age" class="input" />
			</label>
			<label for="gender" class="label text-center">
				What is your gender?
				<div>
					<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
						<RadioItem bind:group={gender} name="justify" value={'m'}>m</RadioItem>
						<RadioItem bind:group={gender} name="justify" value={'w'}>w</RadioItem>
						<RadioItem bind:group={gender} name="justify" value={'d'}>d</RadioItem>
					</RadioGroup>
				</div>
			</label>
			<label for="educationalBackground" class="label text-center col-span-2">
				<span> What is your educational background, e.g. what do you study? </span>
				<select class="select mb-8">
					<option value="1">Option 1</option>
					<option value="2">Option 2</option>
					<option value="3">Option 3</option>
					<option value="4">Option 4</option>
					<option value="5">Option 5</option>
				</select>
			</label>
			<label for="familiarityML" class="label text-center">
				<span>
					What is your level of familiarity with machine learning models and artificial
					intelligence?
				</span>
				<RangeSlider name="range-slider" bind:value={fam_ml_val} {max} step={1}>
					<div class="flex justify-between items-center">
						<div class="text-xs">{fam_ml_val} / {max}</div>
					</div>
				</RangeSlider>
			</label>
			<label for="familiarityCreditRisk">
				<span> What is your level of familiarity with the topic of credit risk assessment? </span>
				<RangeSlider name="range-slider" bind:value={fam_cr_val} {max} step={1}>
					<div class="flex justify-between items-center">
						<div class="text-xs">{fam_cr_val} / {max}</div>
					</div>
				</RangeSlider>
			</label>
		</div>
	</Step>
	<Step>
		<h2 class="text-2xl">
			This study aims to understand how people understand machine learning models and their
			predictions with the help of explainable AI
		</h2>
		<p>
			Our Machine Learning Model is trained on a collection of loan application data. <br />
			It can predict whether a loan application will be approved or not. <br /><br />

			For example, given an applicant with the following attributes
		</p>
		<ul class="list">
			<li><span class="flex-auto">- Age: 30 </span></li>
			<li><span class="flex-auto">- Gender: Male</span></li>
			<li><span class="flex-auto">- Job-Level: Skilled</li>
			<li><span class="flex-auto">- Housing: Free</li>
			<li><span class="flex-auto">- Saving Account: Moderate</li>
			<li><span class="flex-auto">- Checking Account: Moderate</li>
			<li><span class="flex-auto">- Credit Amount: 2862€</li>
			<li><span class="flex-auto">- Duration: 36 months</li>
			<li><span class="flex-auto">- Purpose: Car</li>
		</ul>
		<p>
			The model would give the prediction that this is a high risk customer and the loan should not
			be approved. Such a model can also provide its confidence in the prediction. In this case, the
			model is 99% confident in its prediction.
		</p>
	</Step>
</Stepper>
