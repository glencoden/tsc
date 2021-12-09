import { TOKEN_EXPIRY_SAFETY_MARGIN } from '../constants';

export const PrintActionTypes = {
    CERTIFICATES: 'certificates',
    PROTOCOL: 'protocol'
};

function encodeURI(data) {
    const formBody = [];
    for (const key in data) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);
        formBody.push(`${encodedKey}=${encodedValue}`);
    }
    return formBody.join('&');
}


class RequestService {
    baseUrl = '';
    oAuth2_access_token = '';
    tokenExpiryDate = null;

    constructor() {
        this.baseUrl = process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1'
            : 'https://wolke.glencoden.de';
    }

    get(url) {
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        if (this.oAuth2_access_token) {
            headers.Authorization = `Bearer ${this.oAuth2_access_token}`;
        }
        return Promise.resolve()
            .then(() => fetch(url, { method: 'GET', headers }))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }

    post(url, data) {
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        if (this.oAuth2_access_token) {
            headers.Authorization = `Bearer ${this.oAuth2_access_token}`;
        }
        return Promise.resolve()
            .then(() => JSON.stringify(data))
            .then(body => fetch(url, {
                method: 'POST',
                headers,
                body
            }))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }

    put(url, data) {
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        if (this.oAuth2_access_token) {
            headers.Authorization = `Bearer ${this.oAuth2_access_token}`;
        }
        return Promise.resolve()
            .then(() => JSON.stringify(data))
            .then(body => fetch(url, {
                method: 'PUT',
                headers,
                body
            }))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }

    delete(url) {
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        if (this.oAuth2_access_token) {
            headers.Authorization = `Bearer ${this.oAuth2_access_token}`;
        }
        return Promise.resolve()
            .then(() => fetch(url, { method: 'DELETE', headers }))
            .then(resp => resp.json())
            .catch(err => console.error('Request Service: ', err));
    }

    _postEncodeURI(url, data) {
        return Promise.resolve()
            .then(() => encodeURI(data))
            .then(body => fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body
            }))
            .then(resp => {
                if (resp.ok) {
                    return resp.json();
                }
                return Promise.reject(resp);
            });
    }

    login(username, password) {
        return this._postEncodeURI(`${this.baseUrl}/auth/login`, { username, password, grant_type: 'password', client_id: null, client_secret: null })
            .then(resp => {
                this.oAuth2_access_token = resp.access_token;
                const expiryDate = new Date();
                expiryDate.setSeconds(expiryDate.getSeconds() + resp.expires_in - TOKEN_EXPIRY_SAFETY_MARGIN);
                this.tokenExpiryDate = expiryDate;
                return {
                    success: true
                };
            });
    }

    isAuthTokenValid() {
        return new Date() < this.tokenExpiryDate;
    }

    fetchPrint(type, competitorsForPrint) {
        const data = {};
        let url;
        switch (type) {
            case PrintActionTypes.CERTIFICATES:
                data.competitors = competitorsForPrint;
                url = `${this.baseUrl}/tsc/print_certificates`;
                break;
            case PrintActionTypes.PROTOCOL:
                data.competitors = competitorsForPrint;
                url = `${this.baseUrl}/tsc/print_protocol`;
                break;
            default:
        }
        const headers = {'Content-Type': 'application/json; charset=utf-8'};
        if (this.oAuth2_access_token) {
            headers.Authorization = `Bearer ${this.oAuth2_access_token}`;
        }
        Promise.resolve()
            .then(() => JSON.stringify(data))
            .then(body => fetch(url, {
                method: 'POST',
                headers,
                body
            }))
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(new Blob([ blob ], { type: 'application/pdf' }));
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 100);
            })
            .catch(err => console.error(err));
    }
}

export const requestService = new RequestService();