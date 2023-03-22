

function Principal(){
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [configuracion, setConfig] = useState('');
    const [jugador, setJugador] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setNombre('nombre usuario');
        setPassword('contraseña');
        setConfig('configuracion');
        setJugador(0);
        const response = await axios.get("https://lamesa-backend.azurewebsites.net/partida/conectar", {nombre, password,jugador,configuracion});
        console.log(response.data);
        if (response.data){
        navigate(process.env.PUBLIC_URL+'/carga');
        }

    };
    return(
        
        <form onSubmit={handleSubmit}>
            <h1>Bienvenido</h1>
            <button type="submit">Jugar partida pública</button>
        </form>

    );

}

export default Principal;