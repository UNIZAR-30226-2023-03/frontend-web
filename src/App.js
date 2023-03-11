import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';
import './App.css';
import LoginForm from './componentes/Login.Form';
import Registrarse from './componentes/Registrarse';

function App() {
  return(
    <BrowserRouter>
    <Routes>
        <Route  path='/' Component={LoginForm}/>
        <Route path='/registrarse' Component={Registrarse}/>
    </Routes>
    </BrowserRouter>
    
  )
    
}

export default App;
