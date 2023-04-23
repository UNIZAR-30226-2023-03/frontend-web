import "../styles/Rankings.css";
import home from "../imagenes/iconos/home.svg"
function Rankings(){
    return(
      <div>
        <div className="back5">
          <div class="breadcrumb">
            <div class="breadcrumb-item"><a href="principal"><img className="casa" src={home} alt="" /></a></div>
            <div class="breadcrumb-item">&gt;</div>
            <div class="breadcrumb-item">Rankings</div>
          </div>
        </div>             
      </div>
    );
}

export default Rankings;