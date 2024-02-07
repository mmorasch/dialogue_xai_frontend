<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {Step, Stepper} from '@skeletonlabs/skeleton';
    import {generateSlug} from 'random-word-slugs';
    import {onMount} from 'svelte';
    import {PUBLIC_TEACH_TEST_CYCLES} from "$env/static/public";

    let gender: string = 'm';
    let gender_self_identify = '';
    let age: string;
    let degree: string;
    let education_field: string;
    let education_field_other = 0;
    let fam_ml_val = 0;
    let fam_domain_val = '';
    let max: number = 5;
    let matrikelnummer: number; //TODO: Include matrikelnummer in the form
    let consent_given: boolean = false;
    let pdfPath = `${base}/Consent.pdf`;

    let study_group: any;
    onMount(() => {
        fetch(`${base}/api/get_study_group`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (response.ok) {
                response.text().then((text) => {
                    study_group = text;
                });
            } else {
                console.error('Server responded with non-OK status');
                study_group = 'interactive';
            }
        }).catch((error) => {
            console.error('Error:', error);
            study_group.set('interactive');
        });
    });

    async function onComplete() {
        // First check if all the fields are filled out
        const checks = [
            {condition: degree === '', message: 'Please select your highest degree before proceeding.'},
            {
                condition: education_field === '',
                message: 'Please select your field of study before proceeding.'
            },
            {
                condition: education_field === 'other' && education_field_other === '',
                message: 'Please enter your field of study before proceeding.'
            },
            {condition: age === '', message: 'Please enter your age before proceeding.'},
            {condition: gender === '', message: 'Please select your gender degree before proceeding.'}
        ];

        for (let check of checks) {
            if (check.condition) {
                alert(check.message);
                return;
            }
        }

        const user_id = generateSlug();

        let profile_data = {
            gender: gender,
            gender_self_identify: gender_self_identify,
            age: age,
            degree: degree,
            education_field: education_field,
            education_field_other: education_field_other,
            fam_ml_val: fam_ml_val,
            fam_domain_val: fam_domain_val
        };
        fetch(`${base}/api/setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                profile_data: profile_data,
                study_group: study_group
            })
        });
        goto(`${base}/experiment?user_id=${user_id}&sg=${study_group}`);
    }

    let study_group_interactive_text =
        'Get familiar with the ML\'s prediction in an <b>interactive chatbot</b>.';

    let study_group_static_text =
        'Get familiar with the ML\'s prediction in an <b>explanation report</b>.';
</script>

<div class="col-start-2 col-end-2 space-y-4 p-2 sm:p-2 md:space-y-6">
    <h1 class="text text-4xl">Dear Participant, welcome to the study!</h1>
    <!-- https://www.skeleton.dev/components/steppers -->
    <Stepper buttonCompleteLabel="Start Experiment" on:complete={onComplete}>
        <Step>
            <p>
                Welcome to our study on understanding the decision process of Artificial Intelligence (AI) models
                which takes about 20 minutes. It is designed as part of a large research project
                that seeks to improve understanding between AI Systems (i.e. Machine learning models) and humans.<br/>
            </p>

            <p class="m my-12">
                Upon successful completion, you will get 3 extra Points in the final Exam. <br/><br/>

                Thank you for your participation! <br/><br/>

                Sincerely, <br/><br/>

                Dimitry Mindlin, PhD Candidate, University of Bielefeld
            </p>
        </Step>
        <Step locked={!consent_given}>
            <p>
                Please read the consent form and agree to participate in the study.
            </p>
            <iframe title="Consent Form" src={pdfPath} width="100%" height="500vh">
                    This browser does not support PDFs. Please download the PDF to view it.
            </iframe>
            <div style="display: flex; align-items: center;">
                <label for="consent" style="margin-right: 10px;">I read and understood the consent form and agree to
                    participate in the study.</label>
                <input type="checkbox" id="consent" bind:checked={consent_given}/>
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
                machine learning shows its true potential. <br/><br/>

                In this exploration, you will discover how machine learning models are employed to analyze extensive
                health data to predict the likelihood of diabetes in individuals. These models act as high-tech
                analysts, scrutinizing a person's medical history and lifestyle factors to make accurate diagnoses.
                <br/><br/>

                By examining variables such as age, weight and blood sugar levels, these AI systems identify patterns
                and can now more accurately predict the risk of diabetes in patients, aiding in early detection and
                management of the condition.<br/>

                <br/>
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
                The model would give a prediction whether this person is <b>likely</b> or <b>unlikely</b> to have
                diabetes.
            </p>
        </Step>
        <Step>
            <h2 class="text-2xl">Experiment Introduction</h2>
            <h3 class="text-xl">How will the model predict the risk level of different patients?</h3>
            <div class="container">
                <h1>The experiment is structured as follows:</h1>
                <ol>
                    <li>Review one patient's information at a time and guess the ML model's decision.</li>
                    {#if study_group === 'interactive'}
                        <li>{@html study_group_interactive_text}</li>
                    {:else}
                        <li>{@html study_group_static_text}</li>
                    {/if}
                    <li>When ready, proceed by clicking <span class="highlight">"Next"</span>.</li>
                    <li>Predict the outcome for a new patient based on your understanding. This time, without seeing
                        explanations.
                    </li>
                    <li>Complete this process for a total of <span class="highlight">{PUBLIC_TEACH_TEST_CYCLES}
                        patient pairs </span> where you first learn and then guess the model prediction for a new
                        patient.
                    </li>
                    <li>Answer a few questions about your model understanding at the end.</li>
                </ol>
                <p class="note">Here, the goal isn't to be right about whether someone has diabetes or not. It's all
                    about estimating what the model would predict based on the explanations you see.</p>
            </div>
        </Step>
        <Step>
            <p>
                Before we begin, we would like to gather some information about you to ensure a diverse set
                of participants and the representativeness of the study. <br
            /><br/>
                Please take a moment to answer the following questions:
            </p>
            <hr/>
            <div class="grid grid-cols-2 gap-8">
                <label for="age" class="label text-center">
                    <span>1) How old are you?</span><br/>
                    <select id="age" class="select w-32 py-1" bind:value={age}>
                        <option value="">- Select -</option>
                        <option value="18-24">18-24 years old</option>
                        <option value="25-34">25-34 years old</option>
                        <option value="35-44">35-44 years old</option>
                        <option value="45-54">45-54 years old</option>
                        <option value="55-64">55-64 years old</option>
                        <option value="65+">65+ years old</option>
                        <option value="anonymous">Prefer not to say</option>
                    </select>
                </label>
                <label for="gender" class="label text-center">
                    <div>
                        <label class="label" for="gender-select">
                            <span>2) Gender: How do you identify? </span>
                            <select class="select py-1" name="gender" id="gender-select" bind:value={gender}>
                                <option value="">- Select -</option>
                                <option value="man">Man</option>
                                <option value="non-binary">Non-Binary</option>
                                <option value="woman">Woman</option>
                                <option value="anonymous">Prefer not to say</option>
                                <option value="self-describe">Prefer to self-describe, below</option>
                            </select>
                        </label>
                    </div>
                    {#if gender === 'self-describe'}
                        <div>
                            <input
                                    type="text"
                                    name="gender_text"
                                    id="gender_text"
                                    class="input py-1"
                                    bind:value={gender_self_identify}
                            />
                        </div>
                    {/if}
                </label>
                <label for="educationalBackground" class="label text-center col-span-1">
                    <span> 3) Which of the following best describes your educational background? </span>
                    <select class="select mb-8 py-1" id="educationalBackground" bind:value={degree}>
                        <option value="" selected>- Select -</option>
                        <option value="no degree">Did not complete high school</option>
                        <option value="high school">High school graduate</option>
                        <option value="college">Attended college but no degree</option>
                        <option value="bachelor">Bachelor's degree</option>
                        <option value="master">Master's degree</option>
                        <option value="doctor">Doctoral degree</option>
                        <option value="anonymous">Prefer not to say</option>
                    </select>
                </label>
                {#if degree === 'college' || degree === 'bachelor' || degree === 'master' || degree === 'doctor'}

                    <label for="educationalBackgroundField" class="label text-center col-span-1">
                        <span> What is your general field of studies? </span>
                        <select
                                class="select mb-8 py-1"
                                id="educationalBackgroundField"
                                bind:value={education_field}
                        >
                            <option value="" selected>- Select -</option>
                            <option value="maths">Mathematics</option>
                            <option value="cs">Computer Science</option>
                            <option value="bio">Biological Sciences</option>
                            <option value="economics">Economics</option>
                            <option value="social">Social Sciences</option>
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="arts">Arts and Humanities</option>
                            <option value="engineering">Engineering and Technology</option>
                            <option value="health">Health Sciences</option>
                            <option value="environmental">Environmental Sciences</option>
                            <option value="law">Law and Legal Studies</option>
                            <option value="humanities">Humanities (including History, Philosophy, Literature)</option>
                            <option value="business">Business and Management</option>
                            <option value="education">Education</option>
                            <option value="anonymous">Prefer not to say</option>
                            <option value="other">Other (describe below)</option>
                        </select>
                        {#if education_field === 'other'}
                            <div>
                                <input
                                        type="text"
                                        name="study_field_text"
                                        id="study_field_text"
                                        class="input py-1"
                                        bind:value={education_field_other}
                                />
                            </div>
                        {/if}
                    </label>
                {/if}
                <label for="familiarityML" class="label text-center">
                    <span>4) Rate your level of familiarity with artificial intelligence (AI):</span>
                    <select bind:value={fam_domain_val} class="select py-1">
                        <option value="0">Very low: I have little to no understanding of AI.</option>
                        <option value="1">Low: I have basic knowledge but limited understanding of AI concepts.</option>
                        <option value="2">Moderate: I have a fair understanding of AI concepts and its applications.
                        </option>
                        <option value="3">High: I am knowledgeable about AI and its various applications.</option>
                        <option value="4">Very high: I am highly proficient in AI, with extensive knowledge and
                            experience in its theory and applications.
                        </option>
                        <option value="anonymous">Prefer not to say</option>
                    </select>
                </label>
                <label for="familiarityDomain">
					<span>
						5) What is your level of familiarity with the topic of diabetes diagnose?
					</span>
                    <select bind:value={fam_ml_val} class="select py-1">
                        <option value="0">I do not know about the disease.</option>
                        <option value="1">I briefly know about the disease.</option>
                        <option value="2">I know the symptoms of the disease.</option>
                        <option value="3">I know how the disease is diagnosed.</option>
                    </select>
                </label>
            </div>
        </Step>
    </Stepper>
</div>


<style>
    h1 {
        color: #444;
    }

    ol {
        margin: 20px 0;
        list-style-type: decimal;
    }

    li {
        margin: 10px 0;
    }

    .note {
        font-style: italic;
        font-weight: bold;
    }

</style>