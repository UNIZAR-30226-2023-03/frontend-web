import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';
import './App.css';
import LoginForm from './componentes/Login.Form';

function App() {
  return(
    <BrowserRouter>
    <Routes>
        <Route  path='/' component={LoginForm}>
        </Route>
    </Routes>
    </BrowserRouter>
    
  )
    
}

export default App;
