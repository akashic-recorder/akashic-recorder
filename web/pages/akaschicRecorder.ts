import axios from 'axios'

export const apiClient = axios.create({
    baseURL: 'https://akaschic-recorder-api.herokuapp.com/api',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
});

class AkaschicRecorder {
    async getEvents(address: string) {
        const eventId = 1
        const chainId = 80001 // Mumbai
        const url = `/${eventId}/${chainId}/${address}`
        let res: any = await apiClient.get(url, {})
        
        // TODO: Remove
        if (!res.data || res.data.length === 0) {
            res = {
                data: [
                    {
                        event_id: 1,
                        start: "2022-03-09 18:13:00",
                        end: "2022-03-09 18:15:00",
                        order: 1,
                        address: "0xe996FE17B655CC6830c3319002B71AF1Fb3ceCd6",
                        cid: "dummyeiefxy4xbf34rivlekencrtucworpv5jgnyrmkcpniclgjwk5m4jla"
                    },
                    {
                        event_id: 2,
                        start: "2022-03-09 18:16:00",
                        end: "2022-03-09 18:17:00",
                        order: 2,
                        address: "0xe996FE17B655CC6830c3319002B71AF1Fb3ceCd6",
                        cid: "dummyeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
                    }
                ]
            }
        }
        return res.data
    }
}

export const akaschicRecorder = new AkaschicRecorder()
