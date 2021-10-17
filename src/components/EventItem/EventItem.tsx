import React, { useState, useEffect } from 'react'
import { getUserAddress, decodeAmount, parseFundingPotId, getEventTime, getSymbolByAddress, getIcon  } from '../../services/colony';
import { EventType } from '../../types/event.types';
import { formatDate } from '../../utils/dateUtil';
import styles from './event-item.module.css';
interface PropsType  {
    event: EventType,
}
  
export default function EventItem(props:PropsType) {
    const {event} = props;
    const [recipient, setRecipient] = useState<string>('');
    const [eventTime, setEventTime] = useState<number | undefined>(undefined);
    useEffect(() => {
        getUserAddress(event).then((address:string) => {
            setRecipient(address);
        });
        getEventTime(event).then((time:number) => {
            setEventTime(time);
        })
    }, [event])
    return (
        <div className={styles.wrapper}>
            <img className={styles.avatar} src={getIcon(recipient)} alt="Avatar"/>
            <div className={styles.info}>
                <div className={styles.description}>User <b>{recipient}</b> claimed <b>{decodeAmount(event.values.amount)}{getSymbolByAddress(event.values.token)}</b> from pot <b>{parseFundingPotId(event.values.fundingPotId)}</b></div>
                <div className={styles.date}>
                    {eventTime && formatDate(new Date(eventTime), 'DD MMM')}
                </div>
            </div>
        </div>
    )
}
