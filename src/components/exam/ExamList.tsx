import {getBankList} from "@/app/api/api-cbt.ts";
import {useQuery} from "@tanstack/react-query";

interface BankData {
    id_bank: number;
    kode_bank: string;
    nama_bank: string;
    angkatan: string;
}

interface BankResponse {
    total: number;
    data: BankData[];
}

export default function ExamList() {
    const {data, isLoading} = useQuery<BankResponse>({
        queryKey: ["BankList"],
        queryFn: getBankList,
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    return (
        <div>
            {data?.data.map((item) => (
                <div key={item.id_bank}>
                    <h1>{item.kode_bank}</h1>
                    <p>{item.nama_bank}</p>
                    <p>Angkatan: {item.angkatan}</p>
                </div>
            ))}
        </div>
    );
}
