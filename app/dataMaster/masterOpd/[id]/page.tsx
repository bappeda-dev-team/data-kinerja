import { FiHome } from "react-icons/fi";
import { FormEditMasterOpd } from "@/app/components/dataMaster/masterOpd/FormMasterOpd";

const EditOpd = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan</p>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master OPD</p>
                <p className="mr-1">/ Edit</p>
            </div>
            <FormEditMasterOpd />
        </>
    )
}

export default EditOpd;