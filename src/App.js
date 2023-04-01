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
        <Route path='/datosPersonales' Component={DatosPersonales}/>
        <Route path='/amigos' Component={Amigos}/>
        <Route path='/torneos' Component={Torneos}/>
        <Route path='/rankings' Component={Rankings}/>
    </Routes>
    </BrowserRouter>
    
  )
    
}
export default App;
