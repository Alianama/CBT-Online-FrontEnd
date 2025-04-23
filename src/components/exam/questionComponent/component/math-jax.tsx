import React from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const config = {
    loader: { load: ["[tex]/ams"] },
    tex: {
        inlineMath: [["\\(", "\\)"]],
        displayMath: [["\\[", "\\]"]],
        packages: ["base", "ams"]
    }
};

const MathJaxWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <MathJaxContext version={3} config={config}>
            <MathJax dynamic inline>{children}</MathJax>
        </MathJaxContext>
    );
};

export default MathJaxWrapper;
