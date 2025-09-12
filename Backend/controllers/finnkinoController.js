import { fetchTheatresFromAPI, fetchScheduleByTheatreIdFromAPI, fetchEventByIdFromAPI } from "../models/finnkinoActions.js";

const finnkino_base_url = "https://www.finnkino.fi/xml";

const fetchTheatres = async (req, res, next) =>
{
    try
    {
        const theatres = await fetchTheatresFromAPI()
        return res.json(theatres);
    }
    catch (err)
    {
        next(err);
    }
}



const getShowsByTheatre = async (req, res, next) =>
{
    try
    {
        const theatreId = req.params.theatreId;   // <-- get id from URL
        const shows = await fetchScheduleByTheatreIdFromAPI(theatreId);
        return res.json(shows);
    }
    catch (err)
    {
        next(err);
    }
}


const getEventById = async (req, res, next) =>
{
    try
    {
        const eventId = req.params.eventId;   // <-- get id from URL
        const events = await fetchEventByIdFromAPI(eventId);
        return res.json(events);
    }
    catch (err)
    {
        next(err);
    }
}
    


export { fetchTheatres, getShowsByTheatre, getEventById }