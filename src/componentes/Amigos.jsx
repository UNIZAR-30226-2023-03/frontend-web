import "../styles/Amigos.css";
import home from "../imagenes/iconos/home.svg"

function Amigos(){
    return( 
      <div>
        <div className="back4">
          <div class="breadcrumb">
            <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
            <div class="breadcrumb-item">&gt;</div>
            <div class="breadcrumb-item">Amigos</div>
          </div>
        </div>              
      </div>
    );
}

export default Amigos;