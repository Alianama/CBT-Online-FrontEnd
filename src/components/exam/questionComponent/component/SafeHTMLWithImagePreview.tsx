

import React, { useState, useMemo } from "react";
import parse, { HTMLReactParserOptions } from "html-react-parser";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
    loader: { load: ["[tex]/ams"] },
    tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"]],
        packages: ["base", "ams"],
    },
};

interface HTMLWithImagePreviewProps {
    html: string;
}

const HTMLWithImagePreview: React.FC<HTMLWithImagePreviewProps> = ({ html }) => {
    const [preview, setPreview] = useState<string | null>(null);

    // Cek ada tag <table> atau latex array untuk pakai scroll
    const hasTable = useMemo(() => {
        // bisa disesuaikan cek lain jika perlu
        return /<table[\s\S]*?>|\\begin\{array\}/.test(html);
    }, [html]);

    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            if (domNode.name === "img" && domNode.attribs?.src) {
                const { src } = domNode.attribs;
                return (
                    <img
                        src={src}
                        alt=""
                        style={{
                            width: "50%",
                            maxWidth: "500px",
                            height: "auto",
                            cursor: "pointer",
                        }}
                        onClick={() => setPreview(src)}
                    />
                );
            }
        },
    };

    return (
        <>
            <MathJaxContext version={3} config={config}>
                <div
                    className="mathjax-container"
                    style={{
                        maxWidth: "100%",
                        fontSize: "14px",
                        overflowX: hasTable ? "auto" : "visible",
                    }}
                >
                    <MathJax>
                        <div>{parse(html, options)}</div>
                    </MathJax>
                </div>
            </MathJaxContext>

            {/* Modal Preview */}
            {preview && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
                    onClick={() => setPreview(null)}
                >
                    <img
                        src={preview}
                        alt="preview"
                        className="max-w-full max-h-full object-contain border-4 border-white rounded shadow"
                    />
                </div>
            )}
        </>
    );
};

export default HTMLWithImagePreview;
