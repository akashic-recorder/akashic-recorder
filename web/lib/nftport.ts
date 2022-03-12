import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://api.nftport.xyz/v0/',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_NFT_PORT_API_KEY,
    },
});

class NFTPort {
    async getNFTs() {
        await apiClient.get('/nfts', {
            params: {
                chain: 'polygon',
            },
        })
    }

    async mint({ toAddress, eventId, address, timeSec, order, dateStr, cid }) {
        let description = 'This NFT is proof that you have defeated the boss character of the game.\n\n'
        description += `- Event Id: ${eventId}\n`
        description += `- Address: ${address}\n`
        description += `- Time: ${timeSec} sec\n`
        description += `- Rank: #${order}\n`
        description += `- Date: ${dateStr}\n`
        description += `- CID: ${cid}\n`
        const res = await apiClient.post('/mints/easy/urls', {
            chain: 'rinkeby',
            name: 'Game Clear Proof',
            description,
            file_url: 'https://gateway.pinata.cloud/ipfs/QmV1o53q2aYyvesLyUbSrMnvRjsQuRRAx5WqCHXb4qG23i',
            mint_to_address: toAddress,
        })
        // eslint-disable-next-line no-console
        console.log(res)
        return res.data.transaction_external_url
    }
}

export default new NFTPort()
