import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';
import './styles/App.css';
import LoginForm from './componentes/Login.Form';
import Registrarse from './componentes/Registrarse';
import Principal from './componentes/Principal';
function App() {
  return(
    <BrowserRouter>
    <Routes>
        <Route  path='/' Component={LoginForm}/>
        <Route path='/registrarse' Component={Registrarse}/>
        <Route path='/principal' Component={Principal}/>
    </Routes>
    </BrowserRouter>
    
  )
    
}

export default App;
