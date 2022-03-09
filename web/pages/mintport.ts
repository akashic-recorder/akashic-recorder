import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://api.nftport.xyz/v0/',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.NEXT_PUBLIC_NFT_PORT_API_KEY,
    },
});

class MintPort {
    async getNFTs() {
        const res = await apiClient.get('/nfts', {
            params: {
                chain: 'polygon',
            },
        })
        console.log(res)
    }

    async mint(toAddress: string) {
        const res = await apiClient.post('/mints/easy/urls', {
            chain: 'rinkeby',
            name: 'Game Clear Proof',
            description: 'This NFT is proof that you have defeated the boss character of the game.',
            file_url: 'https://gateway.pinata.cloud/ipfs/QmV1o53q2aYyvesLyUbSrMnvRjsQuRRAx5WqCHXb4qG23i',
            mint_to_address: toAddress,
        })
        console.log(res)
    }
}

export const mintPort = new MintPort()
