import {goto} from '$app/navigation';
import {base} from '$app/paths';

export const userId = {
    get: getUserIdOnPage,
    set: setUserIdOnPage
};

export const studyGroup = {
    get: getStudyGroupFromUrl,
    set: setStudyGroupInUrl
};

function getUserIdOnPage(): string | null {
    const user_id = window.localStorage.getItem('user_id');
    if (user_id == null) {
        goto(base + '/');
    }
    return user_id
}

function setUserIdOnPage(id: string): void {
    window.localStorage.setItem('user_id', id);
}

function getStudyGroupFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const sg = urlParams.get('sg');
    if (sg == null) {
        // Optionally redirect if sg is not present; adjust as needed
        goto(base + '/');
    }
    return sg;
}

function setStudyGroupInUrl(sg: string): void {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('sg', sg);
    // Update the URL without reloading the page
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
}


