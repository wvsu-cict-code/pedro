import type { MouseEventHandler } from "react"

interface Props {
    tags: Array<String>
    body: String
    onClick: MouseEventHandler<HTMLLIElement>

}
export default function Card({ tags, body, onClick }: Props) {
    return (
        <li className="list-none flex p-1 rounded" onClick={onClick}>
            <div className="rounded bg-none w-full leading-8 p-6 text-gray-900 bg-green-100 hover:bg-green-200 text-left opacity-95 border border-gray-100 shadow-md cursor-pointer">
                <h2 className="m-0 text-sm capitalize opacity-80">
                    {tags}
                </h2>
                <p className="mt-2 mb-0 ">
                    {body}
                </p>
            </div>
        </li>
    )
}
