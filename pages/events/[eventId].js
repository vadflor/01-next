import { getEventById, getAllEvents } from "../../helpers/api-util";
import EventSummary from "../../components/event-detail/EventSummary";
import EventLogistics from "../../components/event-detail/EventLogistics";
import EventContent from "../../components/event-detail/EventContent";
import Head from "next/head";

export default function EventDetailPage(props) {

    const event = props.selectedEvent;

    if (!event) {
        return (
            <div className="center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{event.title}</title>
                <meta
                    name="description"
                    content={event.description}
                />
            </Head>
            <EventSummary title={event.title} />
            <EventLogistics
                date={event.date}
                address={event.location}
                image={event.image}
                imageAlt={event.title}
            />
            <EventContent>
                <p>{event.description}</p>
            </EventContent>
        </>
    );
}

export async function getStaticProps(context) {

    const eventId = context.params.eventId;
    const event = await getEventById(eventId);

    return {
        props: {
            selectedEvent: event
        },
        revalidate: 30

    }
}

export async function getStaticPaths() {

    const events = await getAllEvents();
    const paths = events.map(event => ({ params: { eventId: event.id } }));

    return {
        paths: paths,
        fallback: true
    }
}

