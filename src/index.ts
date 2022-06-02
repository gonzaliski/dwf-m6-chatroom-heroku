import "./components/chat"
import "./components/home"
import "./router"
import { state } from "./state"


(function () {
    state.init();
    // esto sucede en el submit del form de la primera pantall
    
    
    // Propuesta:
    // al comenzar (para evitar la primera pantalla)
    // state.init()
    // recupera el state del localStorage
    
  })();