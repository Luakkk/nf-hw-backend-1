
import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';


const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};


// this event service instance shows how to create a event, get a event by id, and get all events with in-memory data
class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

  async getEvents(
    city: string = "",
    page: number = 1,
    size: number = 10,
    sortBy: string = "rating",
    sortDirection: string = "asc"
  ): Promise<IEvent[]> {
    const { limit, offset } = getPagination(Number(page), Number(size));
    const ascendance = sortDirection === "asc" ? 1 : -1;
    
    return await EventModel.find({ city: city })
      .skip(offset)
      .limit(limit)
      .sort({ [sortBy]: ascendance })
      .exec();
  }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, rating, date, city, location, duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        rating: Number(rating),
        date: new Date(date),
        city,
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  