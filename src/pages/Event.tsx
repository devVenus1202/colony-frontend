import React, { useEffect, useState } from 'react'
import EventItem from '../components/EventItem';
import { getEvents } from '../services/colony'
import { EventType } from '../types/event.types';
import styles from  './event.module.css';

export default function Event() {
    const [events, setEvents] = useState<EventType[] | undefined>(undefined)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getEvents().then((results: EventType[]) => {
            setEvents(results)
            setLoading(false);
        });
    }, [])
    return (
        <div className={styles.wrapper}>
            {events && events.map((e:EventType) => {
                return <EventItem key={e.blockNumber} event={e}></EventItem>
            })}
            {loading && <div className={styles.loader}> <h2>Loading...</h2></div>}
        </div>
    )
}
