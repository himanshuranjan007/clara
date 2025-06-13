import axios from "axios";
import type { EmailMessage, SyncResponse, SyncUpdatedResponse } from "~/types";

export class Account {
    private token: string;
    constructor(token: string) {
        this.token = token;
    }

    private async startSync() {
        try {
            const response = await axios.post<SyncResponse>("https://api.aurinko.io/v1/email/sync", {}, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }, params: {
                    daysWithin: 2,
                    bodyType: "html"
                }
            })

            return response.data;

        } catch (error) {
            console.error("error performing initial sync", error)
        }
    }
    async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }) {

        let params: Record<string, string> = {};

        if (deltaToken) params.deltaToken = deltaToken;
        if (pageToken) params.pageToken = pageToken;




        const response = await axios.get<SyncUpdatedResponse>("https://api.aurinko.io/v1/email/sync/updated", {
            headers: {
                Authorization: `Bearer ${this.token}`
            },
            params
        })

        return response.data;

    }

    async performInitialSync() {
        try {
            let syncResponse = await this.startSync()

            while (!syncResponse?.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                syncResponse = await this.startSync();
            }
            let storedDeltaToken: string = syncResponse.syncUpdatedToken;
            let updatedResponse = await this.getUpdatedEmails({ deltaToken: storedDeltaToken });

            if (updatedResponse.nextDeltaToken) {
                // this means sync is completed 
                storedDeltaToken = updatedResponse.nextDeltaToken;

            }
            let allEmails: EmailMessage[] = updatedResponse.records;
            // we will fetch all pages if there are more 

            while (updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
                allEmails = allEmails.concat(updatedResponse.records);
                if (updatedResponse.nextDeltaToken) {
                    storedDeltaToken = updatedResponse.nextDeltaToken;
                }
            }
            console.log("initial sync completed no.of emails fetched", allEmails.length)

            // await this.getUpdatedEmails({ deltaToken: storedDeltaToken });

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("error performing initial sync", error.response?.data)
            } else {
                console.error("error performing initial sync", error)
            }
        }
    }
}