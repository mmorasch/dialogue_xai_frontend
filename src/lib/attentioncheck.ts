import {base} from "$app/paths";

export async function logAttentionCheck(user_id: string,
                                        attention_check_id: string,
                                        user_answers: string,
                                        correct_answer: string) {
    const logging_information = {
        correct: correct_answer,
        selected: user_answers
    };
    await fetch(`${base}/api/log_attention_check`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id,
            check_id: attention_check_id,
            information: logging_information
        })
    });
}

export async function get_attention_checks_failed(user_id: string) {
    const response = await fetch(`${base}/api/get_attention_checks_failed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id
        })
    });
    // Return boolean value of whether the user has failed two or more attention checks
    const passed = response.ok;
    return !passed;
}

export async function get_comprehension_check_failed(user_id: string) {
    const response = await fetch(`${base}/api/get_comprehension_check_failed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: user_id
        })
    });
    // Return boolean value of whether the user has failed the comprehension check
    const passed = response.ok;
    return !passed;
}