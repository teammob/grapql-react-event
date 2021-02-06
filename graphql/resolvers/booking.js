const Booking = require('../../models/booking');
const {  transformEvent ,transformBooking } = require('./merge');
const Event= require('../../models/event');

module.exports = {
     bookings: async () => {
        try{
            const bookings= await Booking.find();
            return bookings.map(booking => 
                { return transformBooking(booking); })
        }
        catch(err){ throw err; }
     }, 
     
     bookEvent: async args =>{ 
         const fetchedEvent = await Event.findOne({_id: args.eventId});
         const booking=  new Booking({
                user: '601b5487a83ccea1566d8518',
                event: fetchedEvent
         });
         const result = await booking.save();
         return transformBooking(result);
     },
        cancelBooking: async args => {
            try{
                const booking = await Booking.findById(args.bookingId).populate('event');
                const event = transformEvent(booking.event); 
              await Booking.deleteOne({ _id: args.bookingId });
            return event;
            }
            catch(err ){ throw err;}
        } 

 
};