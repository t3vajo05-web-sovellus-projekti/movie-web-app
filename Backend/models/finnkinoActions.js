import { XMLParser } from "fast-xml-parser";

const finnkino_base_url = "https://www.finnkino.fi/xml";

const fetchTheatresFromAPI = async () =>
{
    // Returns a JS array of all theatres.
    //
    // Example usage:
    // const theatres = await fetchTheatresFromAPI()
    //
    // Example return:
    // [
    //   { id: 1014, name: "Pääkaupunkiseutu" },
    //   { id: 1012, name: "Espoo" },
    //   { id: 1039, name: "Espoo: OMENA" },
    //   { id: 1038, name: "Espoo: SELLO" },
    //   { id: 1002, name: "Helsinki" },
    //   { id: 1045, name: "Helsinki: ITIS" },
    //   { id: 1031, name: "Helsinki: KINOPALATSI" },
    //   { id: 1032, name: "Helsinki: MAXIM" },
    //   { id: 1033, name: "Helsinki: TENNISPALATSI" }
    // ]

    const response = await fetch(finnkino_base_url + "/TheatreAreas");
    const text = await response.text();

    const parser = new XMLParser();
    const xmlObj = parser.parse(text);

    const theatres = xmlObj.TheatreAreas.TheatreArea
    .map(t => ({
        id: t.ID,
        name: t.Name
    }));

    return theatres;
}

const fetchScheduleByTheatreIdFromAPI = async (theatreId) =>
{
    // Returns a JS array of shows for the given theatre.
    // Each show object contains detailed information.
    //
    // Example usage:
    // const shows = await fetchScheduleByIdFromAPI(1034);
    //
    // Example return:
    // [
    //   {
    //     id: 2268662,
    //     eventID: 1234343,
    //     title: "Nobody 2",
    //     originalTitle: "Nobody 2",
    //     year: 2025,
    //     theatreId: 1034,
    //     theatre: "Kinopalatsi, Helsinki",
    //     auditorium: "sali 6",
    //     start: "2025-09-12T13:00:00",
    //     end: "2025-09-12T14:39:00",
    //     runTime: 89,
    //     genres: "Komedia, Toiminta, Jännitys",
    //     language: "englanti",
    //     url: "http://www.finnkino.fi/websales/show/2268662/",
    //     image: "http://media.finnkino.fi/1012/Event_14634/portrait_small/Nobody2_1080_v2.jpg"
    //   },
    //   {
    //     id: 2269287,
    //     eventID: 2526984,
    //     title: "Kirottu 4: Viimeiset riitit",
    //     originalTitle: "The Conjuring: Last Rites",
    //     year: 2025,
    //     theatreId: 1034,
    //     theatre: "Kinopalatsi, Helsinki",
    //     auditorium: "sali 7",
    //     start: "2025-09-12T13:00:00",
    //     end: "2025-09-12T15:26:00",
    //     runTime: 136,
    //     genres: "Kauhu",
    //     language: "englanti",
    //     url: "http://www.finnkino.fi/websales/show/2269287/",
    //     image: "http://media.finnkino.fi/1012/Event_14697/portrait_small/TheConjuringLastRites_1080_v2.jpg"
    //   }
    // ]

    const res = await fetch(finnkino_base_url + "/Schedule?area=" + theatreId);
    const text = await res.text();

    const parser = new XMLParser();
    const xmlObj = parser.parse(text);

    // handle empty schedules
    let showsArray = xmlObj.Schedule?.Shows?.Show || [];

    if (!Array.isArray(showsArray))
    {
        showsArray = [showsArray];
    }

    const shows = showsArray.map(show => ({
        id: show.ID,
        eventID: show.EventID,
        title: show.Title,
        originalTitle: show.OriginalTitle,
        year: show.ProductionYear,
        theatreId: show.TheatreID,
        theatre: show.Theatre,
        auditorium: show.TheatreAuditorium,
        start: show.dttmShowStart,
        end: show.dttmShowEnd,
        runTime: show.LengthInMinutes,
        genres: show.Genres,
        language: show.SpokenLanguage.Name,
        url: show.ShowURL,
        image: show.Images.EventSmallImagePortrait
    }));

    return shows;
}

const fetchEventByIdFromAPI = async (eventId) =>
{
    // Returns a single event object for the given event ID.
    //
    // Example usage:
    // const event = await fetchEventByIdFromAPI(2268662);
    //
    // Example return:
    // {
    //   id: 2268662,
    //   title: "Nobody 2",
    //   originalTitle: "Nobody 2",
    //   year: 2025,
    //   runTime: 89,
    //   genres: "Komedia, Toiminta, Jännitys",
    //   synopsis: "Action-packed comedy with thrilling moments...",
    //   url: "http://www.finnkino.fi/event/2268662/"
    // }

    const res = await fetch(finnkino_base_url + "/Events");
    const text = await res.text();

    const parser = new XMLParser();
    const xmlObj = parser.parse(text);

    let eventsArray = xmlObj.Events.Event;

    if (!Array.isArray(eventsArray))
    {
        eventsArray = [eventsArray];
    }

    const events = eventsArray.map(ev => ({
        id: ev.ID,
        title: ev.Title,
        originalTitle: ev.OriginalTitle,
        year: ev.ProductionYear,
        runTime: ev.LengthInMinutes,
        genres: ev.Genres,
        synopsis: ev.ShortSynopsis,
        url: ev.EventURL
    }));

    const myEvent = events.find(e => Number(e.id) === Number(eventId));

    return myEvent;
}
    

export { fetchTheatresFromAPI, fetchScheduleByTheatreIdFromAPI, fetchEventByIdFromAPI }