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
        const url = `/${eventId}/${chainId}/${address.toLowerCase()}`
        let res: any = await apiClient.get(url, {})
        
        // TODO: Remove
        if (!res.data || res.data.length === 0) {
            res = {
                data: [
                    {
                        event_id: 1,
                        start_time: "2022-03-09T18:13:00Z",
                        end_time: "2022-03-09T18:15:00Z",
                        event_name: "Sample Event 1",
                        rank_num: 1,
                        wallet_address: "0xe996FE17B655CC6830c3319002B71AF1Fb3ceCd6",
                        cid: "dummyeiefxy4xbf34rivlekencrtucworpv5jgnyrmkcpniclgjwk5m4jla"
                    },
                    {
                        event_id: 2,
                        start_time: "2022-03-09T18:16:00Z",
                        end_time: "2022-03-09T18:17:00Z",
                        event_name: "Sample Event 2",
                        rank_num: 2,
                        wallet_address: "0xe996FE17B655CC6830c3319002B71AF1Fb3ceCd6",
                        cid: "dummyeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
                    },
                    {
                        event_id: 3,
                        start_time: "2022-03-09T18:18:00Z",
                        end_time: "2022-03-09T18:19:00Z",
                        event_name: "Sample Event 3",
                        rank_num: 3,
                        wallet_address: "0xe996FE17B655CC6830c3319002B71AF1Fb3ceCd6",
                        cid: "dummyeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"
                    }
                ]
            }
        }
        return res.data
    }
}

export default new AkaschicRecorder()
