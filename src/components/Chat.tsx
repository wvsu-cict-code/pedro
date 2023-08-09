import { FaPaperPlane } from "react-icons/fa";

export default function Chat() {

    return (
        <div className="mt-6">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-5 ...">
                    <textarea style={{ border: "none" }} className="m-2 p-4 text-black rounded w-full" placeholder="Can't find what you are looking for? Type your question here." /></div>
                <button className="mb-2 mt-3 mx-8 text-center"><FaPaperPlane className="text-green-500 text-3xl" /></button>
            </div>

        </div>
    )
}