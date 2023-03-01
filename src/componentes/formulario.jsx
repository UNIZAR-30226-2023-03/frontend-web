import { useForm } from "react-hook-form";
//import { edadValidator } from "./validators";

const Formulario = () => {

    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    return <div>
        <h2>Inicial Sesion</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pregunta">
                <div className="tex-form">Correo electronico</div>
                <input type="text" placeholder="correo electronico"{...register('nombre', {
                    required: true,
                    // maxLength:x
                    // pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i email comprobation
                })} />
                {/* {errors.nombre?.type === 'maxLength' && <p>El campo nombre debe tener menos de 10 caracteres</p>} */}
                {errors.nombre?.type === 'required' && <p>El nombre de usuario es obligatorio</p>}
            </div>
            <div className="pregunta">
                <div className="tex-form">Contraseña</div>
                <input type="password" placeholder="contraseña"{...register('contrasegna', {
                    required: true
                })} />
                {errors.contrasegna?.type === 'required' && <p>La contraseña es obligatoria</p>}
            </div>
            
            
            <input type="submit" value="Iniciar sesion" />
        </form>
    </div>
}

export default Formulario;