import { Select as SelectComponent, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useState } from "react"

export const Select = ({ placeholder, label, selectItems, value, onValueChange }: { placeholder: string, label: string, selectItems: { value: string, label: string }[], value: string | undefined, onValueChange: (value: string | undefined) => void }) => {
    const [key, setKey] = useState(+new Date())

    return <div className=" flex items-center gap-1">
        <SelectComponent key={key} value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {selectItems.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                            {category.label}
                        </SelectItem>
                    ))}
                    <Button onClick={() => { setKey(+new Date()); onValueChange(undefined) }} variant={"ghost"} className=" w-full" size={"sm"}>Clear</Button>
                </SelectGroup>
            </SelectContent>
        </SelectComponent>
    </div>
}