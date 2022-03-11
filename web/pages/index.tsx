import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers } from 'ethers'
import Web3Modal from '@0xsequence/web3modal'
import { sequence } from '0xsequence'
import { configureLogger } from '@0xsequence/utils'
import Head from 'next/head'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { ellipseAddress, getChainData } from '../lib/utilities'
import nftPort from '../lib/nftport'
import akaschicRecorder from '../lib/akaschicRecorder'
import Card from "../components/Card"

configureLogger({ logLevel: 'DEBUG' })

const INFURA_ID = '6ae5bd1d600f40048725736711ef4acb'

const providerOptions = {
  sequence: {
    options: {
      appName: 'Sequence',
      defaultNetwork: 'polygon',
      chainId: 137,
    },
    package: sequence,
    connector: async () => {
      const wallet = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(wallet)
      if (wallet.sequence) {
        (provider as any).sequence = wallet.sequence
      }
      return provider
    },
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
}

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}

type StateType = {
  provider?: any
  web3Provider?: any
  address?: string
  chainId?: number
}

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      provider?: StateType['provider']
      web3Provider?: StateType['web3Provider']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, address, chainId } = state
  const [events, setEvents] = useState([])
  const [isLoading, setLoading] = useState(false)

  const connect = useCallback(async function () {
    const provider = await web3Modal.connect()
    const web3Provider = new ethers.providers.Web3Provider(provider)
    if (provider.sequence) {
      (provider as any).sequence = provider.sequence
    }
    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    const network = await web3Provider.getNetwork()
    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    })
  }, [])

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        if (provider && (provider as any).sequence) {
          const wallet = (provider as any).sequence as sequence.Wallet
          wallet.disconnect()
        } else {
          await provider.disconnect()
        }    
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  )

  const checkEvents = async function () {
    if (!address) {
      alert('Please connect wallet')
      return
    }
    setLoading(true)
    try {
      const events = await akaschicRecorder.getEvents(address)
      setEvents(events)
    } finally {
      setLoading(false)
    }
  }

  const mint = async function () {
    // await nftPort.getNFTs()
    if (!address) {
      alert('Please connect wallet')
      return
    }
    await nftPort.mint(address)
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect])

  const chainData = getChainData(chainId)

  return (
    <>
      <div className="container bg-gray-100 font-body">
        <Head>
          <title>Certificates | Akashic Records</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          {address && (
            <div className="grid">
              <div>
                <div>
                  <p className="mb-1">👤 {ellipseAddress(address)}</p>
                </div>
                <div>
                  <p className="mb-1">🔌 {chainData?.name}</p>
                </div>
              </div>
              <div>
                <Button colorScheme='red' variant='solid' size='md' onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </header>

        <main className='section'>
          <div className="p-8 title">Event Participation Certificates</div>

          {web3Provider && events.length === 0 ? (
            <Button isLoading={isLoading} colorScheme='red' variant='solid' onClick={checkEvents} size="lg">
              Check Certificates
            </Button>
          ) : !web3Provider ? (
            <Button colorScheme='red' variant='solid' onClick={connect} size="lg">
              Connect Wallet
            </Button>
          ) : null}

          <section className="container">
            {web3Provider && events ? (
              <div className="layout">
                {events.map((element, index) => (
                  <Card
                    key={index}
                    eventId={element.event_id}
                    start={element.start}
                    end={element.end}
                    order={element.order}
                    address={element.address}
                    cid={element.cid}
                    title="2021 Mar 1st Event"
                    imageUrl="https://lh3.googleusercontent.com/ZMdzHfjinqrmesQuaQZz119y6IymfiKjRpdVyi2BHJC9mkiMZAyAP4M3uU8wZF-3diC3MCLfdlyj1yAbqkSsp6dZUzu0L2zbzvW8yNs=w600"
                    action={mint}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </main>

        <style jsx>{`
          main {
            text-align: center;
          }

          p {
            margin-top: 0;
          }

          .container {
            padding: 2rem;
            margin: 0 auto;
          }

          .grid {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: space-between;
          }

          .mb-0 {
            margin-bottom: 0;
          }
          .mb-1 {
            margin-bottom: 0.25rem;
          }
        `}</style>
      </div>
      <footer></footer>
    </>
  )
}

export default Home
