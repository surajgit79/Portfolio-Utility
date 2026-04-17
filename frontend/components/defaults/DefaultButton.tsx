import { Button } from "@/components/ui/button"

type Props = {
    text: string
}

export const DefaultButton = ({text}: Props) => {
    return (
        <Button 
            variant="outline"
            className="cursor-pointer font-semibold bg-[#2D84C4] text-white p-4 text-lg"
        >{text}</Button>
    )
}