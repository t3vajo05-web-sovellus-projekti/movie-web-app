const FINNKINO_BASE_URL = "https://www.finnkino.fi/xml";

// Fetch all theatres
export const fetchTheatres = async () =>
{
    const res = await fetch(`${FINNKINO_BASE_URL}/TheatreAreas`);
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const theatreNodes = xmlDoc.getElementsByTagName("TheatreArea");
    let theatres = Array.from(theatreNodes).map(node => ({
        id: node.getElementsByTagName("ID")[0].textContent,
        name: node.getElementsByTagName("Name")[0].textContent
    }));

    theatres = theatres.filter(t => t.name !== "Valitse alue/teatteri"); // Remove placeholder

    return theatres;
};

// Fetch shows by theatre ID
export const fetchShows = async (theatreId, date) =>
{
    const res = await fetch(`${FINNKINO_BASE_URL}/Schedule?area=${theatreId}&dt=${date}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    let showNodes = xmlDoc.getElementsByTagName("Show");
    if (!showNodes.length) return [];

    const shows = Array.from(showNodes).map(node => ({
        id: node.getElementsByTagName("ID")[0]?.textContent,
        eventID: node.getElementsByTagName("EventID")[0]?.textContent,
        title: node.getElementsByTagName("Title")[0]?.textContent,
        originalTitle: node.getElementsByTagName("OriginalTitle")[0]?.textContent,
        year: node.getElementsByTagName("ProductionYear")[0]?.textContent,
        theatreId: node.getElementsByTagName("TheatreID")[0]?.textContent,
        theatre: node.getElementsByTagName("Theatre")[0]?.textContent,
        auditorium: node.getElementsByTagName("TheatreAuditorium")[0]?.textContent,
        start: node.getElementsByTagName("dttmShowStartUTC")[0]?.textContent,
        end: node.getElementsByTagName("dttmShowEndUTC")[0]?.textContent,
        runTime: node.getElementsByTagName("LengthInMinutes")[0]?.textContent,
        genres: node.getElementsByTagName("Genres")[0]?.textContent,
        language: node.getElementsByTagName("SpokenLanguage")[0]?.textContent,
        url: node.getElementsByTagName("ShowURL")[0]?.textContent,
        image: node.getElementsByTagName("EventSmallImagePortrait")[0]?.textContent
    }));

    return shows

};

// Format date/time nicely
export const formatDateTime = (isoString) =>
{
    const date = new Date(isoString);
    const dd = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}.${MM}.${yyyy} ${HH}:${mm}:${ss}`;
};
