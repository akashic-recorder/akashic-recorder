import React from 'react'
import { Text, Link } from '@chakra-ui/react'
import { useState } from 'react'
import classNames from 'classnames'

import styles from './Card.module.css'

const Card = ({ eventId, start, end, order, address, cid, title, imageUrl, action }) => {
  const [isSending, setSending] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // eslint-disable-next-line no-console
  console.log(eventId, address)

  const doAction = async () => {
    const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
    setSending(true)
    try {
      await action()
      await sleep(1000);
      setClaimed(true)
    } finally {
      setSending(false)
    }
  }
  
  const timeMilliSec = new Date(end).getTime() - new Date(start).getTime()
  const timeSec = Math.floor(Math.abs(timeMilliSec)/1000)

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
                  onClick={doAction}
                  className={classNames([styles.counter, 'group-hover:text-white'])}
                >
                  <Text fontSize='md'>
                    <div style={{fontWeight: 600}}>Claim NFT</div>
                  </Text>
                </button>
              ) : (
                <Text fontSize='md'>
                  <div style={{fontWeight: 600}}>Sending...</div>
                </Text>
              )}
            </div>
          </div>
        ) : null}        
      </div>
      <div className={styles.textWrapper}>
        <div style={{fontWeight: 600}}>{`${title}`}</div>
        
        <p>{`Rank: #${order}`}</p>
        <p>{`Time: ${timeSec} sec`}</p>
        <Link href={`https://ipfs.io/ipfs/${cid}`} target="_blank">IPFS Link 🔗</Link>
      </div>
    </div>
  );
};

export default Card
