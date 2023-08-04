<script lang="ts">
	import { goto } from '$app/navigation';
	import { RadioGroup, RadioItem, RangeSlider, Step, Stepper } from '@skeletonlabs/skeleton';

	export let gender: string = 'm';
	export let fam_ml_val: number = 5;
	export let fam_cr_val: number = 5;
	export let max: number = 10;
</script>

<h1 class="text text-4xl">Welcome to the study!</h1>
<Stepper buttonCompleteLabel="Start experiment" on:complete={() => goto('/experiment')}>
	<Step>
		<p>
			Welcome to our study on understanding decisions and the behavior of machine learning models
			which should take around 40 minutes. It is designed as part of a large research project toward
			creating understanding between Artificial Intelligence Systems (i.e. Machine learning models)
			and humans.<br />
		</p>

		<p class="m my-12">
			Your responses will be kept confidential, and we will only use them to help us analyze the
			results of our study. You have the right to withdraw from the study at any time.<br /> <br />

			Upon successful completion, you will get 10€. <br /><br />

			Thank you for your participation! <br /><br />

			Sincerely, <br /><br />

			Dimitry Mindlin, PhD Candidate, University of Bielefeld
		</p>
	</Step>
	<Step>
		<p>
			Before we begin, we would like to gather information about you that will help us better
			understand the representativeness of our study and have a diverse set of participants. <br /><br />

			The
			personal information (questions 1-4) will not be used to evaluate the results. It will be
			anonymized and randomized after the study is done, so that there is no way to link it back to
			you and your answers in the study.

			<br /> <br />
			Please take a moment to answer the following questions:
		</p>
		<hr class="bd-4" />
		<div class="grid grid-cols-2 gap-8">
			<label for="age" class="label text-center">
				1 ) How old are you?
				<input type="number" name="age" id="age" class="input" />
			</label>
			<label for="gender" class="label text-center">
				<div>
					<label for="gender">2) Gender: How do you identify?</label>
					<select class="select" name="gender" id="gender-select" bind:value={gender}>
						<option value="">- Select -</option>
						<option value="man">Man</option>
						<option value="nb">Non-Binary</option>
						<option value="woman">Woman</option>
						<option value="self-describe">Prefer to self-describe, below</option>
					</select>
				</div>
				<div>
					<input type="text" name="gender_text" id="gender_text" class="input" />
				</div>
			</label>
			<label for="educationalBackground" class="label text-center col-span-1">
				<span> 3) What is your highest degree? </span>
				<select class="select mb-8">
					<option value="1">- Select -</option>
					<option value="1">High School</option>
					<option value="2">Bachelor</option>
					<option value="3">Master</option>
					<option value="4">Doctor</option>
				</select>
			</label>
			<label for="educationalBackground" class="label text-center col-span-1">
				<span> 4) What is your general field of studies? </span>
				<select class="select mb-8">
					<option value="0">- Select -</option>
					<option value="1">Maths</option>
					<option value="2">Computer Science</option>
					<option value="3">Biology</option>
					<option value="4">Economy</option>
					<option value="5">Social Sciences</option>
					<option value="6">Other (describe below)</option>
				</select>
				<div>
					<input type="text" name="study_field_text" id="study_field_text" class="input" />
				</div>
			</label>
			<label for="familiarityML" class="label text-center">
				<span>5) How familiar are you with machine learning and artificial intelligence?</span>
				<RangeSlider name="range-slider" bind:value={fam_ml_val} {max} step={1}>
					<div class="flex justify-between items-center">
						<div class="text-xs">{fam_ml_val} / {max}</div>
					</div>
				</RangeSlider>
			</label>
			<label for="familiarityCreditRisk">
				<span>
					6) What is your level of familiarity with the topic of credit risk assessment?
				</span>
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
			Welcome to the world of Artificial Intelligence (AI) that impacts the daily life of people -
			in credit risk assessments!
		</h2>
		<p>
		Have you ever wondered how banks and financial institutions determine who they can trust to borrow money?
		Well, that's where the power of AI and machine learning comes into play! <br><br>

		In this experiment, you gain access to explore how machine learning algorithms help analyze vast amounts of
		historical data to predict whether an individual is likely to repay a loan or poses a higher credit risk.
		It's like a virtual detective that carefully examines an applicant's financial background and behaviors to
		make informed decisions. <br><br>

		By analyzing characteristics like age, gender, and job level, the AI identified patterns and can now assess
		the likelihood of someone being a high-risk customer for new loan applications. <br />
		</p>
		<p>For example, given an applicant with the following attributes:</p>
		<ul class="list">
			<li><span class="flex-auto">- Age Group: 30 </span></li>
			<li><span class="flex-auto">- Gender: Male</span></li>
			<li><span class="flex-auto">- Job Level: Skilled</span></li>
			<li><span class="flex-auto">- Housing Type: Free</span></li>
			<li><span class="flex-auto">- Saving accounts: Moderate</span></li>
			<li><span class="flex-auto">- Checking account: Moderate</span></li>
			<li><span class="flex-auto">- Credit Amount: 2862 DM</span></li>
			<li><span class="flex-auto">- Credit Duration: 36 months</span></li>
			<li><span class="flex-auto">- Credit Purpose: Car</span></li>
		</ul>
		<p>The model would give the prediction that this is a <b>high risk</b> customer,
		meaning that it is likely that the applicant will not repay the loan in time.</p>
	</Step>
	<Step>
		<h2 class="text-2xl">Study Introduction</h2>
		<h3 class="text-xl">How will the model predict the risk level of new applicants?</h3>
		<p>
			You will be shown one applicant at a time, and your task is to make an initial guess about how the ML
			model would decide for that applicant. Then, you will see the models prediction and you can ask questions
			about the prediction and how the model works to understand it better. As you learn more, you can update
			your initial guess if you want. If you are sure about your guess, click on "Next" to see the next applicant
			and repeat the process.<br /><br />

			Here, the goal isn't to be right about whether someone is a high or low risk customer. It's
			all about estimating what the model would predict based on the questions you can ask.
			<br /><br />

			You'll do this for eight applicants. After you're done, we'll ask you a few questions about
			your understanding of the model and it's decision where you will get extra money for correct
			answers. Afterward, we're curious to hear what you think about the questions, answers, and how
			well you could predict the model's behavior. Let's get started!
		</p>
	</Step>
</Stepper>
