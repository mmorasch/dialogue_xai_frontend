<script lang="ts">
    import {goto} from '$app/navigation';
    import {base} from '$app/paths';
    import {Step, Stepper} from '@skeletonlabs/skeleton';
    import {generateSlug} from "random-word-slugs";
    import {onMount} from "svelte";
    import {assignStudyGroup, setupUserProfile} from "$lib/backend_pg";

    let gender: string = 'm';
    let gender_self_identify = '';
    let age: number;
    let degree: number;
    let education_field: number;
    let education_field_other = '';
    let fam_ml_val: number = 0;
    let fam_domain_val: number = 0;
    let max: number = 5;
    let matrikelnummer: number; //TODO: Include matrikelnummer in the form
    let consent_given: boolean = false;
    let pdfPath = `${base}/Consent.pdf`;

    let study_group;
    onMount(() => {
        console.log("Assigning Study Group");
        assignStudyGroup()
            .then(result => {
                study_group = result;
            })
            .catch(error => {
                console.error('Error:', error);
                study_group = 'static';
            });
    });

    async function onComplete() {
        // First check if all the fields are filled out
        const checks = [
            {condition: degree === "", message: "Please select your highest degree before proceeding."},
            {condition: education_field === "", message: "Please select your field of study before proceeding."},
            {
                condition: education_field === "other" && education_field_other === "",
                message: "Please enter your field of study before proceeding."
            },
            {condition: age === "", message: "Please enter your age before proceeding."},
            {condition: gender === "", message: "Please select your gender degree before proceeding."}
        ];

        for (let check of checks) {
            if (check.condition) {
                alert(check.message);
                return;
            }
        }

        const user_id = generateSlug()

        let profile_data = {
            'study_group': study_group,
            'gender': gender,
            'gender_self_identify': gender_self_identify,
            'age': age,
            'degree': degree,
            'education_field': education_field,
            'education_field_other': education_field_other,
            'fam_ml_val': fam_ml_val,
            'fam_domain_val': fam_domain_val,
        }
        setupUserProfile(user_id, profile_data);
        goto(`${base}/experiment?user_id=${user_id}&sg=${study_group}`);
    }

    let study_group_interactive_text = "and you can select different questions in the chatbot to understand why the model made the prediction.";

    let study_group_static_text = "and you will see a report of different explanations to understand why the model made the prediction.";

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
                <iframe title="Consent Form" src={pdfPath} width="100%" height="500px">
                    This browser does not support PDFs. Please download the PDF to view it.
                </iframe>

            </p>
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
                The model would give the prediction that this person is unlikely to have diabetes.
            </p>
        </Step>
        <Step>
            <h2 class="text-2xl">Study Introduction</h2>
            <h3 class="text-xl">How will the model predict the risk level of different patients?</h3>
            <p>
                The experiment is structured as follows: <br>
                1. You will be shown one patient at a time, and your task is to make an initial guess about
                how the ML model would decide for that person. <br>

                2. Then, you will see what the AI model predicts for the patient
                {#if study_group === 'interactive'}
                    {study_group_interactive_text}
                {:else}
                    {study_group_static_text}
                {/if}
                If you are done with looking at explanations, click on "Next".<br/>

                3. After you had time to understand the prediction, the next step requires you to say how the model
                will predict for a new patient. <br/>
                4. You will repeat this process for 5 patients. <br/>

                5. Finally, we will ask you a few questions about your understanding of the model. <br/>
                <br
                />

                Here, the goal isn't to be right about whether someone has diabetes or not. It's
                all about estimating what the model would predict based on the explanations you see.
                <br/><br/>
            </p>
        </Step>
        <Step>
            <p>
                Before we begin, we would like to gather some information about you to ensure a diverse set
                of participants and the representativeness of the study. <br
            /><br/>

                Personal information (questions 1-4) will not be used to evaluate the results. It will
                be anonymized and randomized, so that there is no way to link it back to you and your answers in the
                study.

                <br/> <br/>
                Please take a moment to answer the following questions:
            </p>
            <hr/>
            <div class="grid grid-cols-2 gap-8">
                <label for="age" class="label text-center">
                    <span>1) How old are you?</span><br/>
                    <input type="number" name="age" id="age" class="input w-32 py-1" bind:value={age}/>
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
                        <option value="" seelcted>- Select -</option>
                        <option value="maths">Maths</option>
                        <option value="cs">Computer Science</option>
                        <option value="bio">Biology</option>
                        <option value="economics">Economics</option>
                        <option value="social">Social Sciences</option>
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
                <label for="familiarityML" class="label text-center">
                    <span>5) How familiar are you with machine learning and artificial intelligence?</span>
                    <select bind:value={fam_domain_val} class="select py-1">
                        <option value="0">What is Artificial Intelligence?</option>
                        <option value="1">I am aware where AI is used.</option>
                        <option value="2">I actively use AI tools.</option>
                        <option value="3">I know how AI is developed.</option>
                        <option value="4">I am a AI researcher.</option>
                    </select>
                </label>
                <label for="familiarityDomain">
					<span>
						6) What is your level of familiarity with the topic of diabetes diagnose?
					</span>
                    <select bind:value={fam_ml_val} class="select py-1">
                        <option value="0">I do not know about the disease.</option>
                        <option value="0">I briefly know about the disease.</option>
                        <option value="1">I know the symptoms of the disease.</option>
                        <option value="2">I know how the disease is diagnosed.</option>
                    </select>
                </label>
            </div>
        </Step>
    </Stepper>
</div>
