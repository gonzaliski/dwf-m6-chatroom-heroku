import { rtdb,firestore } from "./db";
import { nanoid } from "nanoid";
import * as cors from "cors";
//import {v4  as uuidv4} from "uuid"
var express = require("express");
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static("dist"))
app.use(express.json());
app.use(cors());

const userCollection = firestore.collection("users")
const roomCollection = firestore.collection("rooms")


app.post("/rooms",(req,res)=>{
  const {userId} = req.body;
  userCollection.doc(userId).get().then(doc=>{
    if(doc.exists){
      const roomRef = rtdb.ref("rooms/"+nanoid());
      roomRef.set({
        messages:[],
        owner:userId
      }).then(()=>{
        const roomLongId = roomRef.key;
        const roomId = 1000 +Math.floor(Math.random() * 999);
        roomCollection.doc(roomId.toString()).set({
          rtdbRoomId:roomLongId,
        }).then(()=>{
          res.json({
            id:roomId.toString(),
          })
        })
      })
    }else{
      res.status(401).json({
        messages:"You don't exist"
      })
    }
  })
})

app.get("/rooms/:roomId",(req,res)=>{
  const {userId} = req.query;
  const {roomId} = req.params;

  userCollection.doc(userId).get().then(doc=>{
    if(doc.exists){
     roomCollection.doc(roomId).get()
     .then(snap=>{
       const data = snap.data();
      res.json(data)
     })
    }else{
      res.status(401).json({
        messages:"You don't exist"
      })
    }
  })
})



app.post("/signup", (req,res)=>{
const {email} = req.body;
const {name} = req.body;
userCollection
.where("email","==",email)
.get()
.then((searchResponse)=>{
  if(searchResponse.empty){
    userCollection.add({
      email,
      name
    }).then((newUserRef=>{
      res.json({
        id:newUserRef.id,
        new:true
      })
    }))
  }else{
    res.status(404).json({
      message:"User already exists"
    })
  }
}) 
})

app.post("/auth",(req,res)=>{
  const {email} = req.body;

  userCollection
.where("email","==",email)
.get()
.then((searchResponse)=>{
  if(searchResponse.empty){
      res.status(404).json({
        message:"Not found"
      })
  }else{
    res.json({
      id:searchResponse.docs[0].id
    })
  }
  })
}) 

app.post("/messages", function (req, res) {
  const {roomId} = req.body;
  const {message} = req.body;
  const {fullName} = req.body;
  
  roomCollection.doc(roomId).get()
  .then(snap=>{
    const rtdbId = snap.data();
    console.log(rtdbId.rtdbRoomId);
    
     const chatroomRef = rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/messages");
     console.log(req.body);
     
     chatroomRef.push({
       message,
       fullName
     },
      () => res.json("todo ok"));
  })
});

app.get("*", function(req,res){
  res.sendFile(__dirname + "/dist/index.html");
})

//app.user(express.static('dist'))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
