
const Event= require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
     events: async() =>{
        try{
            const events= await Event.find();
            return events.map( event =>{
                return transformEvent(event);
            });
        }catch(err) {  throw err; }
     },

     createEvent: async args =>{
        const event= new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '601b5487a83ccea1566d8518'
        });
        let createdEvent;
        try{
                const result= await event.save();
                createdEvent= transformEvent(result);
                const creator=User.findById('601b5487a83ccea1566d8518');
                if(!creator){
                    throw new Error('User not found.');
                }
                creator.createdEvents.push(event);
                (await creator).save();
                return this.createEvent;
        }catch(err){ }
     },
       
};