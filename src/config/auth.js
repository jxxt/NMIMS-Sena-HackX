// src/config/auth.js
import {
    auth,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
} from "./firebase";

export const sendLink = (email) => {
    const actionCodeSettings = {
        url: `${window.location.origin}/events/invite`,
        handleCodeInApp: true,
    };

    return sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            window.localStorage.setItem('emailForSignIn', email);
            alert("Check your email for the sign-in link!");
        })
        .catch((error) => {
            console.error("Error sending email link: ", error);
        });
};

export const completeSignIn = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }

        return signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                window.localStorage.setItem('attendeeauthid', result.user.uid);
                window.localStorage.removeItem('emailForSignIn');
                return result.user;
            })
            .catch((error) => {
                console.error("Error completing sign-in: ", error);
            });
    }
};
