export default async function popupOauth(
    authorizationUri: string,
    clientId: string,
    redirectUri: string,
    scope: string = '',
    responseType: 'token' | 'code',
    pollingTime: number = 250,
): Promise<string> {

    let authURL = `${authorizationUri}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}`
    if (scope) authURL += `&scope=${encodeURIComponent(scope)}`
    const popup = window.open(authURL)

    console.log('starting polling')

    const callbackPromise = new Promise<string>(function (resolve, reject) {
        (function waitForCallback() {
            try {
                if (popup.location.href === 'about:blank') {
                    console.log('about:blank, re-polling')
                    setTimeout(waitForCallback, pollingTime)
                } else {
                    console.log('success')
                    if (responseType === 'token') resolve(popup.location.href)
                    else if (responseType === 'code') resolve(popup.location.search)
                }
            } catch (e) {
                if (e.name === 'SecurityError') {
                    console.log('got cross-origin error, polling again in pollingTimems')
                    setTimeout(waitForCallback, pollingTime)
                } else {
                    reject(e)
                }
            }
        })()
    })
    const rawHash = await callbackPromise
    popup.close()


    function decodeUri(str) {
        try {
            return decodeURIComponent(str);
        } catch {
            return str;
        }
    }

    let data: string;
    if (responseType === 'token') {
        data = /#(.*)/.exec(rawHash)[1];
    } else if (responseType === 'code') {
        data = /\?(.*)/.exec(rawHash)[1];
    }

    const authResponse = data.split('&').reduce((decoded, keyValuePair) => {
        const [keyEncoded, valueEncoded] = keyValuePair.split('=');
        const key = decodeUri(keyEncoded);
        const value = decodeUri(valueEncoded);
        decoded[key] = value;
        return decoded;
    }, {} as { [key: string]: string | undefined });

    const RESPONSE_KEY_MAP = {
        'token': 'access_token',
        'code': 'code'
    }

    return authResponse[RESPONSE_KEY_MAP[responseType]]
}