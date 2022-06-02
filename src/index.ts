import "./components/chat"
import "./components/home"
import "./router"
import { state } from "./state"
import { Router } from "@vaadin/router";

(function () {
    state.init();
    const cs = state.getState()
    if(cs.rtdbRoomId && cs.userId){
      Router.go("/chatroom")
      state.accessToRoom();
    }
    
    // esto sucede en el submit del form de la primera pantall
    
    
    // Propuesta:
    // al comenzar (para evitar la primera pantalla)
    // state.init()
    // recupera el state del localStorage
    
  })();