import { getAllEvents } from "../../helpers/api-util";
import { useRouter } from "next/router";
import Head from "next/head";

import EventList from '../../components/events/EventList';
import EventsSearch from "../../components/events/EventsSearch";

export default function AllEventsPage(props) {
    const router = useRouter();
    const { events } = props;

    function findEventsHandler(year, month) {
        const fullPath = `/events/${year}/${month}`;
        router.push(fullPath);
    }

    return (
        <>
            <Head>
                <title>All Events</title>
                <meta
                    name="description"
                    content="Find a lot of great events that allow you to evolve..."
                />
            </Head>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={events} />
        </>
    )
}

export async function getStaticProps() {
    const events = await getAllEvents();

    return {
        props: {
            events: events
        },
        revalidate: 60
    }
}
