import {rtdb} from "./rtdb"
import {map} from "lodash"

const API_BASE_URL ="https://dwf-m6-chatroom.herokuapp.com/"

const state = {
  data: {
    email:"",
    userId:"",
    roomId:"",
    fullName: "",
    messages: [],
  },
  listeners: [], // los callbacks
  getState() {
    return this.data;
  },
  askNewRoom(callback?) {
    const cs = this.getState();

    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("line 33 ",data.id);
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("no hay user id");
    }
  },
  setEmailAndFullname(email:String,fullName:String){
    const cs = this.getState();
    console.log(fullName);

    cs.fullName = fullName;
    cs.email = email;
    this.setState(cs);
  },
  setRoomId(roomId:string){
    const cs = this.getState();
    cs.roomId = roomId
    this.setState(cs);
  },
  createUser() {
    const cs = this.getState();
    if (cs.email) {
      fetch(`${API_BASE_URL}/signup`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cs.name, email: cs.email }),
      })
        .then(data => {
          return data.json();
        })
        .then(res => {
          cs.userId = res.id;
          this.setState(cs);  
        })
      }else {
      alert("Debes colocar un mail.");
        }

  },
  signIn(callback) {
    const cs = this.getState();
    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay email en el state");
      callback(true);
    }
  },
  init() {
   const lastStorageState = localStorage.getItem("state");
  },
  listenRoom() {
    console.log("listenRoom");
    const cs = this.getState();
    const chatroomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    chatroomsRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      console.log(messagesFromServer, "msj");
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      console.log(messagesList);
      
      this.setState(cs);
    });
  },
  setMessage(message:String){
    const data = this.getState();
    data.messages.push({message,fullName:data.fullName})
  },
  pushMessage(message:String){
    const data = this.getState();
    fetch(API_BASE_URL + "/messages", {
      method:"post",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
    },
      body:JSON.stringify({
        message:message,
        fullName:data.fullName,
        roomId:data.roomId
      })})
  },
  accessToRoom(callback?){
    console.log("accessToRoom");
    const cs = this.getState();
    const roomId = cs.roomId;
    const userId = cs.userId;
    console.log(userId);
    console.log(roomId);
    
    fetch(API_BASE_URL + "/rooms/" + roomId + "/?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) {
          callback();
        }
      });
  },
  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
 
};

export { state };
