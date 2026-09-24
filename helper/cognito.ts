/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, USER_POOL_ID } from '@/env';
import { AdminGetUserCommand, AdminUpdateUserAttributesCommand, AuthFlowType, CognitoIdentityProviderClient, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';



export const generateSecretHash = async (username: string) => {
    const hmac = crypto.createHmac('sha256', COGNITO_CLIENT_SECRET);
    hmac.update(username + COGNITO_CLIENT_ID);
    return hmac.digest('base64');
};

export const cognito = new CognitoIdentityProviderClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});


export async function cognitoAdminGetUser({ email }: { email: string }) {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: email,
    };
    const commandLogin = new AdminGetUserCommand(params);
    return cognito.send(commandLogin);
}


export async function cognitoSignUp({ email, userAttribute, password }: { email: string, userAttribute: any, password: string }) {
    const createUserParams = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: userAttribute,
         SecretHash: await generateSecretHash(email),
    };

    const createUserCommand = new SignUpCommand(createUserParams);
    return cognito.send(createUserCommand);
}


export async function cognitoUpdateUserAttribute({ userAttribute, email }: { userAttribute: any, email: string }) {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: userAttribute,
    };
    const command = new AdminUpdateUserAttributesCommand(params);
    return cognito.send(command);
}


export async function cognitoConfirmSignUp({ email, code }: { email: string, code: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ConfirmSignUpCommand(params);
    return cognito.send(command);
}

export async function authSingIn({ email, password }: { email: string, password: string }) {
    if (!email || !password) {
        throw new Error('Email and password are required.');
    }

    try {
        const response = await cognitoInitiateAuth({ email, password });
        return {
            message: 'Login successful.',
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
            expiresIn: response.AuthenticationResult?.ExpiresIn,
            tokenType: response.AuthenticationResult?.TokenType,
        };
    } catch (error) {
        throw error;
    }
}


export async function cognitoInitiateAuth({ email, password }: { email: string, password: string }) {
    const paramsLogin = {
        AuthFlow: 'USER_PASSWORD_AUTH' as AuthFlowType,
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SECRET_HASH: await generateSecretHash(email),
        },
    };
    const commandLogin = new InitiateAuthCommand(paramsLogin);
    return cognito.send(commandLogin);
}

export async function refreshCognitoSession({
    refreshToken,
    username,
}: {
    refreshToken: string;
    username: string;
}) {
    const command = new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN_AUTH' as AuthFlowType,
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: await generateSecretHash(username),
        },
    });

    const response = await cognito.send(command);
    return {
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
        tokenType: response.AuthenticationResult?.TokenType,
    };
}

export async function cognitoForgotPassword({ email }: { email: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ForgotPasswordCommand(params);
    return cognito.send(command);
}

export async function cognitoConfirmForgotPassword({ email, code, newPassword }: { email: string, code: string, newPassword: string }) {
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword,
        SecretHash: await generateSecretHash(email),
    };

    const command = new ConfirmForgotPasswordCommand(params);
    return cognito.send(command);
}

