"use client"
import {CardBody, CardContainer, CardItem} from "@/components/ui/3d-card"
import {Link} from "react-router-dom"
import {SubjectCardProps} from "@/types/types.ts";

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
        <Link to={`/lesson/${title.toLowerCase().replace(/\s+/g, "-")}/${id_kelas}/${id_mapel}`}>
            <CardContainer>
                <CardBody
                    className="w-full max-md:h-1/2 lg:h-full  bg-gradient-to-t from-zinc-50 to-slate-50 relative dark:hover:shadow-2xl shadow-xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-4 border flex flex-col">
                    <div
                        className="max-md:flex max-md:flex-row max-md:justify-center max-md:items-center max-md:gap-4 max-md:self-start ">
                        <CardItem translateZ={50}>
                            <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-2"
                                style={{
                                    backgroundImage: `url(${formattedBgImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}>
                            </div>
                        </CardItem>
                        <CardItem translateZ={50} className="text-xm font-bold text-neutral-900 ">
                            {title}
                        </CardItem>
                        <CardItem as="p" translateZ="60"
                                  className="text-neutral-500 text-sm max-w-sm mt-2 max-md:m-0 dark:text-neutral-300">
                            <span className="text-xs text-sidebar-primary/40">{mapel_code}</span>
                        </CardItem>
                    </div>
                    <div className="max-md:flex max-md:items-center max-md:justify-center max-md:w-full">

                        <CardItem translateZ="100" className="w-full mt-4">
                        <span
                            className={`text-sm ${total_materi === 0 ? "text-red-600" : total_materi > 0 && total_materi <= 5 ? "text-orange-500" : "text-green-600"}`}>{total_materi} materi pembelajaran</span>
                        </CardItem>
                        <div className="flex pt-7 justify-between items-center mt-auto">
                            <CardItem
                                translateZ={20}
                                className="px-4 py-2 rounded-xl text-xs font-normal text-neutral-900"
                            >
                                buka →
                            </CardItem>
                            <CardItem
                                translateZ={100}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-primary dark:bg-neutral-200 text-secondary text-xs font-bold"
                            >
                                Lihat Materi
                            </CardItem>
                        </div>
                    </div>
                </CardBody>
            </CardContainer>
        </Link>
    )
}

