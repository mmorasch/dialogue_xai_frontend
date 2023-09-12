<script lang="ts">
	import { goto } from '$app/navigation';
	import { RadioGroup, RadioItem, Step, Stepper, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import Datapoint from '$lib/components/Datapoint.svelte';

	export let value: number = 0;

	type TQuestion = {
		tableData: TableSource;
		value: any;
	};

	const question3TableSource = [
		{ attribute: 'Age Group', value: 'young' },
		{ attribute: 'Gender', value: 'male' },
		{ attribute: 'Job Level', value: 'unskilled and resident' },
		{ attribute: 'Housing Type', value: 'owns a house' },
		{ attribute: 'Savings Account', value: 'little' },
		{ attribute: 'Checking Account', value: 'little' },
		{ attribute: 'Credit Amount', value: '708' },
		{ attribute: 'Credit Duration', value: '12' },
		{ attribute: 'Credit Purpose', value: 'furniture/equipment' }
	];

	const question4TableSource = [
		{ attribute: 'Age Group', value: 'adult' },
		{ attribute: 'Gender', value: 'male' },
		{ attribute: 'Job Level', value: 'skilled' },
		{ attribute: 'Housing Type', value: 'lives in housing that is free' },
		{ attribute: 'Savings Account', value: 'little' },
		{ attribute: 'Checking Account', value: 'little' },
		{ attribute: 'Credit Amount', value: '1333' },
		{ attribute: 'Credit Duration', value: '24' },
		{ attribute: 'Credit Purpose', value: 'education' }
	];

	const question5TableSource = [
		{ attribute: 'Age Group', value: 'student' },
		{ attribute: 'Gender', value: 'female' },
		{ attribute: 'Job Level', value: 'highly skilled' },
		{ attribute: 'Housing Type', value: 'owns a house' },
		{ attribute: 'Savings Account', value: 'little' },
		{ attribute: 'Checking Account', value: 'moderate' },
		{ attribute: 'Credit Amount', value: '4795' },
		{ attribute: 'Credit Duration', value: '36' },
		{ attribute: 'Credit Purpose', value: 'radio/tv' }
	];

	const question6TableSource = [
		{ attribute: 'Age Group', person1: 'adult', person2: 'senior', person3: 'senior' },
		{ attribute: 'Gender', person1: 'male', person2: 'female', person3: 'female' },
		{ attribute: 'Job Level', person1: 'highly skilled', person2: 'skilled', person3: 'skilled' },
		{
			attribute: 'Housing Type',
			person1: 'owns a house',
			person2: 'owns a house',
			person3: 'lives in housing that is free'
		},
		{ attribute: 'Savings Account', person1: 'little', person2: 'little', person3: 'little' },
		{ attribute: 'Checking Account', person1: 'moderate', person2: 'N/A', person3: 'little' },
		{ attribute: 'Credit Amount', person1: '1209', person2: '1453', person3: '1333' },
		{ attribute: 'Credit Duration', person1: '6', person2: '18', person3: '24' },
		{ attribute: 'Credit Purpose', person1: 'business', person2: 'business', person3: 'car' }
	];

	let question3: TQuestion = {
		tableData: {
			head: ['Attribute', 'Value'],
			body: tableMapperValues(question3TableSource, ['attribute', 'value'])
		},
		value: 0
	};

	let question4: TQuestion = {
		tableData: {
			head: ['Attribute', 'Value'],
			body: tableMapperValues(question4TableSource, ['attribute', 'value'])
		},
		value: 0
	};

	let question5: TQuestion = {
		tableData: {
			head: ['Attribute', 'Value'],
			body: tableMapperValues(question5TableSource, ['attribute', 'value'])
		},
		value: 0
	};

	let question6: TQuestion = {
		tableData: {
			head: ['Attribute', 'Person 1', 'Person 2', 'Person 3'],
			body: tableMapperValues(question6TableSource, ['attribute', 'person1', 'person2', 'person3'])
		},
		value: 0
	};
</script>

<div>
	<!-- https://www.skeleton.dev/components/steppers -->
	<Stepper stepTerm="Question" on:complete={() => goto('/exit/feedback')}>
		<!-- Step 1 -->
		<Step>
			<span>
				Among the following features, which one is the _most_ important in influencing our machine
				learning model's prediction (that is, variations in the value of that feature will most
				likely change the model's prediction)?
			</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={value} name="justify" value={0}>Checking account</RadioItem>
					<RadioItem bind:group={value} name="justify" value={1}>Job Level</RadioItem>
					<RadioItem bind:group={value} name="justify" value={2}>Age Group</RadioItem>
				</RadioGroup>
			</div>
		</Step>
		<!-- Step 2 -->
		<Step>
			<span>
				Among the following features, which one is the _least_ important in influencing our machine
				learning model's prediction (that is, variations in the value of that feature will least
				likely change the model's prediction)?
			</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={value} name="justify" value={0}>Gender</RadioItem>
					<RadioItem bind:group={value} name="justify" value={1}>Credit amount</RadioItem>
					<RadioItem bind:group={value} name="justify" value={2}>Credit Duration</RadioItem>
				</RadioGroup>
			</div>
		</Step>
		<!-- Step 3 -->
		<Step>
			<span> Consider a person with the following profile: </span>
			<Datapoint header={question3.tableData.head} body={question3.tableData.body} />
			<br /><br />
			<span>
				Our machine learning model currently predicts this person will bad credit risk. When all
				other features are kept the same, which of the following changes on the attribute _Saving
				accounts_ is most likely to change our model's prediction (i.e., make the model predict the
				person will **good credit risk**)?
			</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={question3.value} name="justify" value={0}
						>Change Saving accounts to rich
					</RadioItem>
					<RadioItem bind:group={question3.value} name="justify" value={1}
						>Change Saving accounts to NA
					</RadioItem>
					<RadioItem bind:group={question3.value} name="justify" value={2}
						>Change Saving accounts to little
					</RadioItem>
				</RadioGroup>
			</div>
		</Step>
		<!-- Step 4 -->
		<Step>
			<span>Consider a person with the following profile:</span>
			<Datapoint header={question4.tableData.head} body={question4.tableData.body} />
			<br /><br />
			<span>
				Our machine learning model currently predicts this person is bad credit risk. If we change
				only one feature of this profile but leave all other features unchanged, which of the
				following changes is going to change our model's prediction (i.e., make the model predict
				the person is good credit risk)? Please check all that apply.
			</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={question4.value} name="justify" value={0}
						>Change Saving accounts to quite rich</RadioItem
					>
					<RadioItem bind:group={question4.value} name="justify" value={1}
						>Change Checking account to rich</RadioItem
					>
					<RadioItem bind:group={question4.value} name="justify" value={2}
						>Change Credit amount to ADD_VALUE_HERE</RadioItem
					>
					<RadioItem bind:group={question4.value} name="justify" value={3}
						>Change Gender to female</RadioItem
					>
					<RadioItem bind:group={question4.value} name="justify" value={4}
						>Change Credit Duration to 12</RadioItem
					>
				</RadioGroup>
			</div>
		</Step>
		<!-- Step 5 -->
		<Step>
			<span>Consider a person with the following profile:</span>
			<Datapoint header={question5.tableData.head} body={question5.tableData.body} />
			<br /><br />
			<span>What do you think our machine learning model will predict for this person?</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={question5.value} name="justify" value={0}
						>The model will predict this person will bad credit risk.</RadioItem
					>
					<RadioItem bind:group={question5.value} name="justify" value={1}
						>The model will predict this person will good credit risk.</RadioItem
					>
				</RadioGroup>
			</div>
		</Step>
		<!-- Step 6 -->
		<Step>
			<span>Consider three people with the following profiles:</span>
			<Datapoint header={question6.tableData.head} body={question6.tableData.body} />
			<br /><br />
			<span>
				For one of these three people, our machine learning model predicts that the person is bad
				credit risk. Which one do you think is this defendant?
			</span>
			<div class="w-fit mx-auto">
				<RadioGroup rounded="rounded-container-token" display="flex-col">
					<RadioItem bind:group={question6.value} name="justify" value={0}>Person 1</RadioItem>
					<RadioItem bind:group={question6.value} name="justify" value={1}>Person 2</RadioItem>
					<RadioItem bind:group={question6.value} name="justify" value={2}>Person 3</RadioItem>
				</RadioGroup>
			</div>
		</Step>
	</Stepper>
</div>
