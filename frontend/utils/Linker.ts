import { redirect } from "next/navigation"
import { RedirectType } from "next/navigation"

type Props = {
    link: string
}
export const Linker = ({link}: Props) => {
    redirect(link, RedirectType.replace)
}