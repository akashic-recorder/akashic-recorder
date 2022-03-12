import React from 'react'
import { Text, Link, Spinner } from '@chakra-ui/react'
import { useState } from 'react'
import classNames from 'classnames'

import styles from './Card.module.css'

const Card = ({ eventId, startTime, endTime, eventName, rankNum, walletAddress, cid, imageUrl, action }) => {
  const [isSending, setSending] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // eslint-disable-next-line no-console
  console.log(eventId, walletAddress)

  const doAction = async (argsObj) => {
    const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
    setSending(true)
    try {
      await action(argsObj)
      await sleep(1000);
      setClaimed(true)
    } finally {
      setSending(false)
    }
  }
  
  const timeMilliSec = new Date(endTime).getTime() - new Date(startTime).getTime()
  const timeSec = Math.floor(Math.abs(timeMilliSec)/1000)
  const dateStr = new Date(endTime).toLocaleString()

  return (
    <div className={classNames([styles.wrapper, styles.wrapperAnime])}>
      <div className={styles.header}>
        <div className={styles.imageWrapper}>
          <img src={imageUrl} className={styles.image} alt='' />
        </div>
        {!claimed ? (
          <div className={styles.badgeWrapper}>
            <div
              className={classNames([
                styles.claimBadge,
                styles.badgeAnime,
                'group',
              ])}
            >
              {!isSending? (
                <button
                  type="button"
                  onClick={
                    () => doAction({ eventId, eventName, walletAddress, timeSec, rankNum, dateStr, cid })
                  }
                  className={classNames([styles.counter, 'group-hover:text-white'])}
                >
                  <Text fontSize='md'>
                    <div style={{fontWeight: 600}}>Claim NFT</div>
                  </Text>
                </button>
              ) : (
                <Spinner size='sm' />
              )}
            </div>
          </div>
        ) : null}        
      </div>
      <div className={styles.textWrapper}>
        <div style={{fontWeight: 600}}>{`${eventName}`}</div>
        
        <p>{`🏆 Rank: #${rankNum}`}</p>
        <p>{`⏱ Time: ${timeSec} sec`}</p>
        <p>{`${dateStr}`}</p>
        <Link href={`https://gateway.lighthouse.storage/ipfs/${cid}`} target="_blank">🔗 IPFS Link</Link>
      </div>
    </div>
  );
};

export default Card
