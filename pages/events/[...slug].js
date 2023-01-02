import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import EventList from "../../components/events/EventList";
import ResultsTitle from "../../components/events/ResultsTitle";
import Button from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Head from "next/head";

export default function FilteredEventsPage() {
    const [loadedEvents, setLoadedEvents] = useState();
    const router = useRouter();
    const filterData = router.query.slug;

    const { data, error } = useSWR(
        "https://nextjs-424d5-default-rtdb.firebaseio.com/events.json",
        (url) => fetch(url).then((res) => res.json())
    );

    useEffect(() => {
        if (data) {
            const events = [];

            for (const key in data) {
                events.push({
                    id: key,
                    ...data[key],
                });
            }
            setLoadedEvents(events);
        }
    }, [data]);

    

    if (!loadedEvents) {
        return <p className="center">Loading...</p>;
    }

    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    const pageHeadData = (
        <Head>
            <title>Filtered Events</title>
            <meta
                name="description"
                content={`All events for ${numMonth}/${numYear}.`}
            />
        </Head>
    );

    if (
        isNaN(numYear) ||
        isNaN(numMonth) ||
        numYear > 2030 ||
        numYear < 2021 ||
        numMonth < 1 ||
        numMonth > 12 ||
        error
    ) {
        return (
            <>
                <ErrorAlert>
                    <p>Invalid filter. Please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const filteredEvents = loadedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return (
            eventDate.getFullYear() === numYear &&
            eventDate.getMonth() === numMonth - 1
        );
    });

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <>
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <>
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </>
    );
}
