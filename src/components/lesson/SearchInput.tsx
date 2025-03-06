import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {FormEvent, useState} from "react";
import type {SearchInputProps} from "@/types/types.ts"

export default function SearchInput({onSearch}: SearchInputProps) {
    const [inputValue, setInputValue] = useState<string>("");
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(inputValue);
    };
    return (
        <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                placeholder="Enter Lesson Book"
            />
            <Button type="submit">
                <Search/>
            </Button>
        </form>
    );
}
