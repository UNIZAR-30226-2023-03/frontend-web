import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';
import './styles/App.css';
import LoginForm from './componentes/Login.Form';
import Registrarse from './componentes/Registrarse';
import Principal from './componentes/Principal';
import Carga from './componentes/Carga';
import Partida from './componentes/Partida';
import PartidaPrivada from './componentes/PartidaPrivada';
import Amigos from './componentes/Amigos';
import DatosPersonales from './componentes/DatosPersonales';
import Torneos from './componentes/Torneos';
import Rankings from './componentes/Rankings';
import PartidaPublica from './componentes/PartidaPublica';
import EsperarTorneo from './componentes/EsperarTorneo';
import EsperarFinal from './componentes/EsperarFinal';
import Tienda from './componentes/Tienda';
import EnviarCorreo from './componentes/EnviarCorreo';
import RecuperarContrasegna from './componentes/RecuperarContrasegna';


function App() {
  return(
    <BrowserRouter>
    <Routes>
        <Route  path='/' Component={LoginForm}/>
        <Route path='/registrarse' Component={Registrarse}/>
        <Route path='/principal' Component={Principal}/>
        <Route path='/carga' Component={Carga}/>
        <Route path='/partida' Component={Partida}/>
        <Route path='/partidaPrivada' Component={PartidaPrivada}/>
        <Route path='/partidaPublica' Component={PartidaPublica}/>
        <Route path='/datosPersonales' Component={DatosPersonales}/>
        <Route path='/amigos' Component={Amigos}/>
        <Route path='/torneos' Component={Torneos}/>
        <Route path='/rankings' Component={Rankings}/>
        <Route path='/esperartorneo' Component={EsperarTorneo}/>
        <Route path='/esperarfinal' Component={EsperarFinal}/>
        <Route path='/tienda' Component={Tienda}/>
        <Route path='/enviaremail' Component={EnviarCorreo}/>
        <Route path='/recuperar-contrasena' Component={RecuperarContrasegna}/>
        
        
    </Routes>
    </BrowserRouter>
    
  )
    
}
export default App;
