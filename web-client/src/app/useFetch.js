import authSession from '../entities/AuthSession';


export default function useFetch() {
    return ({
        endpoint, method,
        auth, setAuth,
        requestData,
        thenFunc, errorFunc, finallyFunc
    }) => {
        fetch(`http://localhost:8000/${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: method === 'GET' || method === 'HEAD' ? null : JSON.stringify(requestData)
        })
            .then(response => {
                if (response.status === 401) {
                    authSession.signOut();
                    setAuth(undefined);
                }
                if (!response.ok) {
                    console.log(response.statusText);
                    return;
                }

                const token = response.headers.get('Authorization');
                setAuth(prevAuth => ({
                    ...prevAuth,
                    token
                }));
                authSession.refreshToken(token);

                return response.json();
            })
            .then(thenFunc ? thenFunc : console.log)
            .catch(errorFunc ? errorFunc : console.error)
            .finally(finallyFunc);
    }
}