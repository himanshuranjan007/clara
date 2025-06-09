"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getAurinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {

    const { userId } = await auth();

    if (!userId) throw new Error("UnAuthorised Login");

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID!,
        serviceType,
        scope: 'Mail.Read Mail.Send Mail.ReadWrite Mail.Drafts Mail.All',
        responseType: 'code',

        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,

    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`




};

export const exchangeCodeForAccessToken = async (code: string) => {
    try {
        // const response = await fetch(`https://api.aurinko.io/v1/auth/token/${code}`,{
        //     method:"POST",
        //     auth:{username:process.env.AURINKO_CLIENT_ID as string,password:process.env.AURINKO_CLIENT_SECRET as string},

        // })
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {}, {
            auth: { username: process.env.AURINKO_CLIENT_ID as string, password: process.env.AURINKO_CLIENT_SECRET as string },
        })
        return response.data as {
            "accountId": number,
            "accessToken": string,
            "userId": string,
            "userSession": string
        }
    } catch (error) {
        console.error("Error fetching Aurinko token", error);
        throw error;
    }
}


export const getAccountDetails = async (accessToken: string) => {
    try {
        const response = await axios.get(`https://api.aurinko.io/v1/account`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }

        })
        return response.data as {

            email: string,
            name: string,
            // "id": number,
            // "parentId": number,
            // "serviceType": string,
            // "serviceProvider": string,
            // "active": boolean,
            // "tokenStatus": string,
            // "tokenError": string,
            // "type": string,
            // "daemon": boolean,
            // "loginString": string,
            // "email": string,
            // "email2": string,
            // "mailboxAddress": string,
            // "name": string,
            // "name2": string,
            // "serverUrl": string,
            // "serverUrl2": string,
            // "clientOrgId": string,
            // "authUserId": string,
            // "authOrgId": string,
            // "timezone": string,
            // "tokenIssuedAt": string,
            // "authScopes": string[],
            // "authNativeScopes": string[],
            // "authObtainedAt": string,
            // "authExpiresAt": string,
            // "userId": string,
            // "copyToSent": boolean

        };
    } catch (error) {
        console.error("Error fetching Aurinko account details", error);
        throw error;
    }
};

export const mailSync = async (accessToken: string) => {
    try {
        const response = await axios.post(`https://api.aurinko.io/v1/email/sync`,{}, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                
            },
            params:{
                "daysWithin":1,
        }})
        console.log("mailSync response is ", response.data);

    } catch (error) {
        console.error("Error syncing mail", error);
        throw error;
    }
}