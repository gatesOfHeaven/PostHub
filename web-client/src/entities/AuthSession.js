const authSession = {
    payloadTitles: ['id', 'username', 'fullname', 'token'],

    hasPayload() {
        let hasAll = true;
        this.payloadTitles.forEach(title => hasAll &&= localStorage.getItem(title))

        if (hasAll)
            return true;

        this.signOut();
        return false;
    },

    setPayload({ id, username, fullname, token }) {
        localStorage.setItem('id', id);
        localStorage.setItem('username', username);
        localStorage.setItem('fullname', fullname);
        localStorage.setItem('token', token);
    },

    refreshToken(token) {
        localStorage.setItem('token', token.replace('Bearer ', ''));
    },

    signOut() {
        this.payloadTitles.forEach(title => {
            if (localStorage.getItem(title))
                localStorage.removeItem(title);
        })
    },

    get() {
        return {
            id: parseInt(localStorage.getItem('id')),
            username: localStorage.getItem('username'),
            fullname: localStorage.getItem('fullname'),
            token: localStorage.getItem('token')
        };
    }
}

export default authSession;