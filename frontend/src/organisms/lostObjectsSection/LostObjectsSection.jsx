import "./LostObjectsSection.scss";
import BasicLayout from "../../templates/layout/BasicLayout";
import CardButton from "../../molecules/cardButton/CardButton";
import { useNavigate } from "react-router-dom";


const LostObjectsSection = () => {
  const navigate = useNavigate();

  return (
    <BasicLayout>
      <div className="objects-section">
        <h1 className="objects-section__title">
          Objetos Perdidos
        </h1>
        <h3 className="objects-section__subtitle">
          Elige una categoría
        </h3>
        <div className="objects-section__cards">
          <CardButton 
            title="Reportar un Objeto" 
            text="¿Perdiste algo o encontraste un objeto?" 
            button="Crear Reportes"
            onClick={() => navigate('/report')} 
          />
          <CardButton 
            title="Buscar Objetos" 
            text="Encuentra objetos perdidos o reportados" 
            button="Buscar Objetos"
            onClick={() => navigate('/searchReports')} 
          />
        </div>
        
      </div>
    </BasicLayout>
  );
}

export default LostObjectsSection;