import {Profil} from "@/types/types.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {useNavigate} from "react-router-dom";

function ProfileAlert({biodata}: { biodata: Profil | null }) {
    const navigate = useNavigate();
    const fieldsToCheck: { key: keyof Profil; label: string }[] = [
        {key: "tempat_lahir", label: "Tempat Lahir"},
        {key: "tanggal_lahir", label: "Tanggal Lahir"},
        {key: "jenis_kelamin", label: "Jenis Kelamin"},
        {key: "provinsi", label: "Provinsi"},
        {key: "kota", label: "Kota"},
        {key: "kecamatan", label: "Kecamatan"},
        {key: "kelurahan", label: "Kelurahan"},
        {key: "alamat", label: "Alamat"},
        {key: "no_hp", label: "Nomor HP"},
        {key: "hobi", label: "Hobi"},
        {key: "cita", label: "Cita-cita"},
        {key: "motto", label: "Motto"},
    ];
    const emptyFields = fieldsToCheck
        .filter(field => !biodata?.[field.key])
        .map(field => field.label);
    if (emptyFields.length === 0) return null;
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>⚠️ Warning!!</AlertTitle>
            <AlertDescription>
                Kamu belum melengkapi data
                <strong> {emptyFields.join(", ")}</strong>
                <br/>
                <button
                    onClick={() => navigate("/update-profile")}
                    className="text-blue-500 underline"
                >
                    Klik di sini untuk melengkapi profil
                </button>
            </AlertDescription>
        </Alert>
    );
}

export default ProfileAlert;
