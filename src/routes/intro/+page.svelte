<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import backend, {saveUserProfile} from '$lib/backend';
	import { RangeSlider, Step, Stepper } from '@skeletonlabs/skeleton';
	import { generateSlug } from "random-word-slugs";

	let gender: string = 'm';
	let gender_self_identify = '';
	let age: number;
	let degree: number;
	let education_field: number;
	let education_field_other = '';
	let fam_ml_val: number = 5;
	let fam_domain_val: number = 5;
	let max: number = 10;

	async function onComplete() {
		// TODO: Define mandatory fields and check if they are filled
		  if (degree === "") {
			  alert("Please select your highest degree before proceeding.");
		  return;
		  }

		const user_id = generateSlug()
		let profile_data = {
			'gender': gender,
			'gender_self_identify': gender_self_identify,
			'age': age,
			'degree': degree,
			'education_field': education_field,
			'education_field_other': education_field_other,
			'fam_ml_val': fam_ml_val,
			'fam_domain_val': fam_domain_val,
		}
		saveUserProfile(user_id, profile_data);
		goto(`${base}/experiment?user_id=${user_id}`);
	}

	function onStepHandler(e: {
		detail: { state: { current: number; total: number }; step: number };
	}): void {
		// TODO validate var's
		console.log('event:step', e);
	}
</script>

<div class="col-start-2 col-end-2 space-y-4 p-2 sm:p-2 md:space-y-6">
	<h1 class="text text-4xl">Dear Participant, welcome to the study!</h1>
	<!-- https://www.skeleton.dev/components/steppers -->
	<Stepper buttonCompleteLabel="Start experiment" on:complete={onComplete} on:step={onStepHandler}>
		<Step>
			<p>
				Welcome to our study on understanding decisions and the behavior of machine learning models
				which takes around 15 minutes. It is designed as part of a large research project
				toward creating understanding between Artificial Intelligence Systems (i.e. Machine learning
				models) and humans.<br />
			</p>

			<p class="m my-12">
				Your responses will be kept confidential, and we will only use them to help us analyze the
				results of our study. You have the right to withdraw from the study at any time.<br />
				<br />

				Upon successful completion, you will get 10€. <br /><br />

				Thank you for your participation! <br /><br />

				Sincerely, <br /><br />

				Dimitry Mindlin, PhD Candidate, University of Bielefeld
			</p>
		</Step>
		<Step>
			<p>
				Before we begin, we would like to gather information about you that will help us better
				understand the representativeness of our study and have a diverse set of participants. <br
				/><br />

				The personal information (questions 1-4) will not be used to evaluate the results. It will
				be anonymized and randomized after the study is done, so that there is no way to link it
				back to you and your answers in the study.

				<br /> <br />
				Please take a moment to answer the following questions:
			</p>
			<hr />
			<div class="grid grid-cols-2 gap-8">
				<label for="age" class="label text-center">
					<span>1) How old are you?</span><br />
					<input type="number" name="age" id="age" class="input w-16 py-1" bind:value={age} />
				</label>
				<label for="gender" class="label text-center">
					<div>
						<label class="label" for="gender-select">
							<span>2) Gender: How do you identify? </span>
							<select class="select py-1" name="gender" id="gender-select" bind:value={gender}>
								<option value="">- Select -</option>
								<option value="man">Man</option>
								<option value="nb">Non-Binary</option>
								<option value="woman">Woman</option>
								<option value="self-describe">Prefer to self-describe, below</option>
							</select>
						</label>
					</div>
					<div>
						<input
							type="text"
							name="gender_text"
							id="gender_text"
							class="input py-1"
							bind:value={gender_self_identify}
						/>
					</div>
				</label>
				<label for="educationalBackground" class="label text-center col-span-1">
					<span> 3) What is your highest degree? </span>
					<select class="select mb-8 py-1" id="educationalBackground" bind:value={degree}>
						<option value="" selected>- Select -</option>
						<option value="high school">High School</option>
						<option value="bachelor">Bachelor</option>
						<option value="master">Master</option>
						<option value="doctor">Doctor</option>
					</select>
				</label>
				<label for="educationalBackgroundField" class="label text-center col-span-1">
					<span> 4) What is your general field of studies? </span>
					<select
						class="select mb-8 py-1"
						id="educationalBackgroundField"
						bind:value={education_field}
					>
						<option value="0">- Select -</option>
						<option value="1">Maths</option>
						<option value="2">Computer Science</option>
						<option value="3">Biology</option>
						<option value="4">Economy</option>
						<option value="5">Social Sciences</option>
						<option value="6">Other (describe below)</option>
					</select>
					<div>
						<input
							type="text"
							name="study_field_text"
							id="study_field_text"
							class="input py-1"
							bind:value={education_field_other}
						/>
					</div>
				</label>
				<label for="familiarityML" class="label text-center">
					<span>5) How familiar are you with machine learning and artificial intelligence?</span>
					<RangeSlider name="range-slider" bind:value={fam_ml_val} {max} step={1}>
						<div class="flex justify-between items-center">
							<div class="text-xs">Low</div>
							<div class="text-xs">{fam_ml_val} / {max}</div>
							<div class="text-xs">High</div>
						</div>
					</RangeSlider>
				</label>
				<label for="familiarityDomain">
					<span>
						6) What is your level of familiarity with the topic of diabetes diagnose?
					</span>
					<RangeSlider name="range-slider" bind:value={fam_domain_val} {max} step={1}>
						<div class="flex justify-between items-center">
							<div class="text-xs">Low</div>
							<div class="text-xs">{fam_domain_val} / {max}</div>
							<div class="text-xs">High</div>
						</div>
					</RangeSlider>
				</label>
			</div>
		</Step>
		<Step>
			<h2 class="text-2xl">
				Welcome to the world of Artificial Intelligence (AI) that impacts the daily life of people -
				in diabetes diagnosis!
			</h2>
			<p>
				Have you ever considered the impact of AI and machine learning in the healthcare sector,
				particularly in diagnosing chronic diseases like diabetes? This is where the innovative world of
				machine learning shows its true potential. <br /><br />

				In this exploration, you will discover how machine learning models are employed to analyze extensive
				health data to predict the likelihood of diabetes in individuals. These models act as high-tech
				analysts, scrutinizing a person's medical history and lifestyle factors to make accurate diagnoses. <br /><br />

				By examining variables such as age, weight and blood sugar levels, these AI systems identify patterns
				and can now more accurately predict the risk of diabetes in patients, aiding in early detection and
				management of the condition.<br />

				<br />
			</p>
		</Step>
		<Step>
			<p>For example, given a person with the following information (attributes):</p>
			<ul class="list">
                <li><span class="flex-auto">- Age: 34 </span></li>
                <li><span class="flex-auto">- BMI: 24.6</span></li>
                <li><span class="flex-auto">- Blood Pressure: 80 mmHg</span></li>
                <li><span class="flex-auto">- Diabetes Pedigree Function: 0.856</span></li>
                <li><span class="flex-auto">- Glucose Level: 107 mg/dL</span></li>
                <li><span class="flex-auto">- Insulin Level: 0 µU/mL</span></li>
                <li><span class="flex-auto">- Number of Pregnancies: 8</span></li>
                <li><span class="flex-auto">- Skin Thickness: 0 mm</span></li>
            </ul>
			<p>
				The model would give the prediction that this person is unlikely to have diabetes.
			</p>
		</Step>
		<Step>
			<h2 class="text-2xl">Study Introduction</h2>
			<h3 class="text-xl">How will the model predict the risk level of new applicants?</h3>
			<p>
				You will be shown one person at a time, and your task is to make an initial guess about
				how the ML model would decide for that person. Then, you will see the models prediction
				and you can ask questions about the prediction and how the model works to understand it
				better. As you learn more, you can update your initial guess if you want. If you are sure
				about your guess, click on "Next" to see the next applicant and repeat the process.<br /><br
				/>

				Here, the goal isn't to be right about whether someone has diabetes or not. It's
				all about estimating what the model would predict based on the questions you can ask and the
				explanations you get.
				<br /><br />

				You will do this for 5 people. After you're done, we'll ask you a few questions about
				your understanding of the model. Afterward, we're curious to hear what you think about the questions,
				answers, and how well you could predict the model's behavior. Let's get started!
			</p>
		</Step>
	</Stepper>
</div>
