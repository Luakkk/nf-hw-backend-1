
import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';
import UserModel from '../auth/models/User';


class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
          const { page, size, sortBy, sortDirection } = req.query;

          const user = await UserModel.findById((req.user as any).id).exec();

          const events = await this.eventService.getEvents(user?.city, Number(page), Number(size), String(sortBy), String(sortDirection));
          res.status(200).json(events);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }

    


    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;