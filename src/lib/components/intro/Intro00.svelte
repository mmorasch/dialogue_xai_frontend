<script lang="ts">
	import { goto } from '$app/navigation';
	import { RadioGroup, RadioItem, RangeSlider, Step, Stepper } from '@skeletonlabs/skeleton';

	export let gender: string = 'm';
	export let fam_ml_val: number = 5;
	export let fam_cr_val: number = 5;
	export let max: number = 10;

</script>

<h1 class="text text-4xl">Dear Participant, welcome to the study!</h1>
<Stepper buttonCompleteLabel="Start experiment" on:complete={() => goto("/experiment")}>
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

			The study takes approximately 25 min and you will get 10€ upon completion. +1€ per correct answer. <br /> <br />

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

			This information will not be used to evaluate the results but will help us
            to ensure a diverse set of participants.  It will be anonymised and deleted after the study is done.
            <br /> <br />

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
			<label for="educationalBackground" class="label text-center col-span-1">
				<span> What is your highest degree? </span>
				<select class="select mb-8">
				    <option value="1">- Select -</option>
					<option value="1">High School</option>
					<option value="2">Bachelor</option>
					<option value="3">Master</option>
					<option value="4">Doctor</option>
				</select>
			</label>
			<label for="educationalBackground" class="label text-center col-span-1">
				<span> What is your general field of studies? </span>
				<select class="select mb-8">
				    <option value="1">- Select -</option>
					<option value="1">Maths</option>
					<option value="2">Computer Science</option>
					<option value="3">Biology</option>
					<option value="4">Economy</option>
					<option value="5">Social Sciences</option>
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
			This study aims to assess what helps humans to understand machine learning models and their predictions
			with the help of explainable AI
		</h2>
		<p>
			The ML model used in this study is like a smart computer program that has been trained using a bunch of
			loan application data. Its job is to predict if someone applying for a loan is likely to be a high risk
			customer or a low risk customer. <br /><br />
		</p>
		<p>
			To train the model, we gathered a bunch of information about loan applicants, like their age, gender, job
			level, and more. We also labeled each applicant as either high risk or low risk based on their history.
			The model then analyzed all of this information and tried to find patterns and connections between the
			different characteristics and the risk levels.
		</p>
		<p>
            It learned which combinations of information were more likely to indicate a high risk or low risk applicant.
            This "learning" happened by looking at many examples and adjusting its settings to make better predictions
            based on the patterns it discovered.
        </p>
        <p>
            Once the model was trained, it could use what it learned to make predictions about new loan applications
            that it hadn't seen before. It could tell us the chances of someone being a high risk customer based on the
            patterns it learned from the training data.
        </p>
	</Step>
	<Step>
	    <h2 class="text-2xl">
			Example
		</h2>
		<p>
		    For example, given an applicant with the following attributes:
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
			The model would give the prediction that this is a high risk customer.
		</p>
	</Step>
	<Step>
	    <h2 class="text-2xl">
			Study Introduction
		</h2>
	    <h3 class="text-xl">
			Chatbot Interaction
		</h3>
	    <p>
	        In the following, you will see an applicant at a time and you will need to give an initial prediction for
	        how you think the ML model would decide for this applicant. After that, you will then be able to ask
	        questions about the prediction and the model behaviour to understand the model better. To end the
	        interaction with the applicant, you will need to give a final prediction for how you think the model would
	        decide for this applicant.
	    </p>
        <h3 class="text-xl">
			Phase 1 - Understanding the Model.
		</h3>
		<p>
		    In the first phase you will be shown 10 applicants with their attributes and the model's prediction.
		    For each applicant, you will have the possibility to ask predefined questions about the prediction that will
		    be answered by techniques from explainable AI. Feel free to provide your own questions if you can't find it
		    in the provided collection.
		</p>
        <h3 class="text-xl">
			Phase 2: Classifying Applicants
		</h3>
		<p>
		    In the second phase you will see new applicants, and you will be asked to guess whether the model would
		    predict it a high risk or low risk customer.
		</p>
        <h3 class="text-xl">
            Phase 3: Final Questionaire
        </h3>
        <p>
            In the final questionaire, we will ask you some questions about your experience with the study.
            We are interested in your opinion about the questions and answers and how you understood the models'
            behaviour.
        </p>
	</Step>
</Stepper>
