class RequestService {
    baseUrl = '';

    constructor() {
        this.baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1'
            : 'https://wolke.glencoden.de';
    }

    get(url) {
        return Promise.resolve()
            .then(() => fetch(url))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }

    post(url, data) {
        return Promise.resolve()
            .then(() => JSON.stringify(data))
            .then(body => fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body
            }))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }
}

export const requestService = new RequestService();