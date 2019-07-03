import * as AWS from 'aws-sdk'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

AWS.config.region = 'us-east-2';

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}

const setUser = user =>
  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

const userPool = new CognitoUserPool({
    UserPoolId: 'us-east-2_5kM3lS3ig',
    ClientId: '506cp9dpfefbakaqq4vi56gc2q'
})

var cognitoUser = userPool.getCurrentUser();

export const handleLogin = ({ username, password }, callbacks) => {
    var authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
    });
    cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    })
    setUser({
        username: username,
    });
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            window.localStorage.setItem("accessToken", result.getAccessToken().getJwtToken());
            cognitoUser.getUserAttributes(function(err, result) {
                if (err) {
                    console.error(err.message || JSON.stringify(err));
                    callbacks.onFailure();
                    return;
                }
                for (var i = 0; i < result.length; i++) {
                    console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                    if (result[i].getName() == 'email') {
                        setUser({
                            username: username,
                            email: result[i].getValue(),
                        });
                    }
                }    
            });
            console.log('Successfully logged in!');
            if (!!callbacks.onSuccess) {
                callbacks.onSuccess();
            }
        },

        onFailure: function (err) {
            console.error(err.message || JSON.stringify(err));
            if (!!callbacks.onFailure) {
                callbacks.onFailure();
            }
        },

        newPasswordRequired: function (userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            window.localStorage.setItem("userAttributes", JSON.stringify(userAttributes));
            if (!!callbacks.newPasswordRequired) {
                callbacks.newPasswordRequired();
            }
        },
    });
}

export const isLoggedIn = () => {
    const user = getUser();
    return !!user.email;  // email, not username to indicate logged in status
}

export const logout = callback => {
  setUser({})
  cognitoUser.signOut();
  callback()
}

export const handleNewPassword = (password, callbacks) => {
    console.log('New password called with ' + password);
    var user = getUser();
    var userAttributes = JSON.parse(window.localStorage.getItem("userAttributes"));
    cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
        onSuccess: function (session) {
            console.log('Password changed successfully');
            setUser({
                username: user.username,
                email: userAttributes.email,
            })
            if (!!callbacks.onSuccess) {
                callbacks.onSuccess();
            }
        },

        onFailure: function (err) {
            console.error(err.message || JSON.stringify(err));
            if (!!callbacks.onFailure) {
                callbacks.onFailure();
            }
        },
    });
}