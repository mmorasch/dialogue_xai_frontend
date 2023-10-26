import { goto } from '$app/navigation';
import { base } from '$app/paths';

export const userId = {
  get: getUserIdOnPage,
  set: setUserIdOnPage
}

function getUserIdOnPage(): string | null {
  const user_id = window.localStorage.getItem('userId');
  if (user_id == null) {
    goto(base + '/');
  }
  return user_id
}

function setUserIdOnPage(id: string): void {
  window.localStorage.setItem('userId', id);
}

