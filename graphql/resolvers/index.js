const bcrypt= require('bcryptjs');
const Event= require('../../models/event');
const User =require('../../models/user'); 

const user_func = userId => {
    return User.findById(userId)
        .then( user => { return {
            ...user._doc,
             _id: user.id ,
             createdEvents: event_func.bind(this,user._doc.createdEvents) }})
        .catch( err => {throw err;} );
}

const event_func = eventIds => {
    return Event.find({ _id: {$in: eventIds}})
    .then( events => {
        return events.map(event => {
             return { 
                  ...event._doc, 
                  _id: event.id, 
                  date: new Date(event._doc.date).toISOString(),
                  creator: user_func.bind(this,event.creator) }
        });
    })
    .catch(err => {throw err; });
}

module.exports = {
    events: () => {
        return Event.find()
             .then(events => {
                 return events.map(event => {
                     return { 
                         ...event._doc,
                         _id: event.id,
                         date: new Date(event._doc.date).toISOString(),
                         creator: user_func.bind(this,event._doc.creator)
                     };
                 });
             })
             .catch(err => { throw err; });                 
     },
     createEvent: (args) => {
             const event= new Event({
                 title: args.eventInput.title,
                 description: args.eventInput.description,
                 price: +args.eventInput.price,
                 date: new Date(args.eventInput.date),
                 creator: '601b5487a83ccea1566d8518'
             });
             let createdEvent;
             return event
             .save().then(
                result => {
                    createdEvent= { 
                        ...result._doc,
                        _id:result._doc._id, 
                        date: new Date(event._doc.date).toISOString(),
                        creator: user_func.bind(this,result._doc.creator)}
                    return User.findById('601b5487a83ccea1566d8518')
                    //console.log(result);
                    //return {...result._doc};
                }
            ).then(user => {
             if(!user){
                 throw new Error('User not found.')
             }
             user.createdEvents.push(event);
             user.save();
            })
            .then(
                result =>{
                 return createdEvent;
                }
            )
            .catch(err =>{
                    console.log(err); 
                    throw err;
            });                  
     },
     createUser: args =>{
        return  User.findOne({email: args.userInput.email})
         .then(
             user =>{
                 if(user){
                     throw new Error('User exists alreardy.')
                 }
                 return bcrypt.hash(args.userInput.password, 12)
             }
         )               
         .then( hashedPassword =>{
             const user = new User({
                 email: args.userInput.email,
                 password: hashedPassword
             });
             return user.save()
             .then(
                 result => {
                    return { ...result._doc , password: null}
                 }
             )                
         })
         .catch(err => { throw err });                
     }
 
}