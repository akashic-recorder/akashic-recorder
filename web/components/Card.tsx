import React from 'react'
import classNames from 'classnames'

import styles from './Card.module.css'

const Card = ({ title, image, action }) => {
  return (
    <div className={classNames([styles.wrapper, styles.wrapperAnime])}>
      <div className={styles.header}>
        <div className={styles.imageWrapper}>
          <img src={image} className={styles.image} alt='' />
        </div>
        <div className={styles.badgeWrapper}>
          <div
            className={classNames([
              styles.claimBadge,
              styles.badgeAnime,
              'group',
            ])}
          >
            <button
              type="button"
              onClick={action}
              className={classNames([styles.counter, 'group-hover:text-white'])}
            >
              Claim NFT
            </button>
          </div>
        </div>
      </div>
      <div className={styles.textWrapper}>
        <h1 className={styles.text}>{`${title}`}</h1>
      </div>
    </div>
  );
};

export default Card
