"use client"
import { Link } from "react-router-dom"
import { SubjectCardProps } from "@/types/types.ts";

const ASSET_DOMAIN = import.meta.env.VITE_ASSET_DOMAIN;
export default function CardMapel({
  title,
  bgImage,
  id_kelas,
  id_mapel,
  mapel_code,
  total_materi = 0,
}: SubjectCardProps) {
  const formattedBgImage = bgImage?.replace(/\{\{DOMAIN}}/g, ASSET_DOMAIN);

  return (
    <Link
      to={`/lesson/${title.toLowerCase().replace(/\s+/g, "-")}/${id_kelas}/${id_mapel}`}
      className="block w-full"
    >
      <div className="w-full min-h-64 bg-gradient-to-t from-zinc-50 to-slate-50
        rounded-xl border shadow p-4 flex flex-col justify-between">
        
        <div>
          <div
            className="w-14 h-14 rounded-lg mb-3 bg-cover bg-center"
            style={{ backgroundImage: `url(${formattedBgImage})` }}
          />
          <h3 className="font-bold text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-500">{mapel_code}</p>
        </div>

        <div>
          <span
            className={`text-sm ${
              total_materi === 0
                ? "text-red-600"
                : total_materi <= 5
                ? "text-orange-500"
                : "text-green-600"
            }`}
          >
            Total materi : {total_materi}
          </span>

          <button
            className="w-full mt-3 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Lihat Materi
          </button>
        </div>
      </div>
    </Link>
  );
}


