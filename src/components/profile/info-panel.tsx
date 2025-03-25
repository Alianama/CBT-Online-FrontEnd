import React from "react";

export default function InfoPanel({
                                      title,
                                      items,
                                  }: {
    title: string;
    items: { icon: React.ReactNode; label: string; value: string }[];
}) {
    return (
        <div className="bg-slate-50 w-full  rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
                {title}
            </h3>
            <div className=" mx-auto p-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-100 transition-colors duration-200"
                    >
                        <div className="bg-indigo-50 p-2 rounded-md">{item.icon}</div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                {item.label}
                            </p>
                            <p className="font-medium text-black">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
