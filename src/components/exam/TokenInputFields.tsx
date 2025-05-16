import React, { useRef, useEffect } from "react"

interface OTPInputFieldsProps {
    value: string
    onChange: (value: string) => void
    length?: number
}

const OTPInputFields: React.FC<OTPInputFieldsProps> = ({ value, onChange, length = 5 }) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([])

    // Inisialisasi array input ref
    useEffect(() => {
        if (inputsRef.current.length !== length) {
            inputsRef.current = Array(length).fill(null)
        }
    }, [length])

    useEffect(() => {
        if (value.length < length) {
            inputsRef.current[value.length]?.focus()
        }
    }, [value, length])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value

        if (!/^[a-zA-Z0-9]{0,1}$/.test(val)) return

        const chars = value.split("")
        chars[index] = val
        const newValue = chars.join("").slice(0, length)

        onChange(newValue)

        if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (value[index]) {
                const chars = value.split("")
                chars[index] = ""
                onChange(chars.join(""))
            } else if (index > 0) {
                const chars = value.split("")
                chars[index - 1] = ""
                onChange(chars.join(""))
                inputsRef.current[index - 1]?.focus()
            }
        }
    }

    return (
        <div className="flex gap-2">
            {[...Array(length)].map((_, i) => (
                <input
                    key={i}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    ref={(el) => {
                        inputsRef.current[i] = el
                    }}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            ))}
        </div>
    )
}

export default OTPInputFields
