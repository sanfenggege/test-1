import { sub } from "date-fns";

export const initialStateData = ()=>{
    return [
        { 
          id: "1", 
          title: "First Post!", 
          content: "Hello!" , 
          user: "1", 
          date: sub(new Date(), { minutes: 10 }).toISOString(), 
          reactions: 
            { 
              thumbsUp: 10,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes:0,
            }
        },
        { 
          id: "2", 
          title: "Second Post", 
          content: "More text", 
          user: "2", 
          date: sub(new Date(), { minutes: 5 }).toISOString(), 
          reactions:
            { 
              thumbsUp: 1,
              hooray: 1,
              heart: 1,
              rocket: 1,
              eyes:1,
            }
        },
      ];
}