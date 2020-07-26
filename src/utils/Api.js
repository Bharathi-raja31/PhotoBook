// Api Urls
import { MAIN_URL, URLS } from '../constants/Urls';

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export const getUserList = (page) => {
    return fetch(`${MAIN_URL}${URLS.users}`, headers).then(response => response.json())
}