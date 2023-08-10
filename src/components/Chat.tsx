import { FaPaperPlane } from "react-icons/fa";
import data from '../data/questions.json'
import Card from "./Card";
import { useState } from 'react'
import ChatBubble from "./ChatBubble";
const initial_questions = data.slice(0, 5)
enum Position {
    Left = 0,
    Right = 1
}
export default function Chat() {
    const [chatbox_text, setChatBoxText] = useState("")
    const [questions_visible, toggleQuestions] = useState(true)
    return (
        <div>
            {questions_visible && <ul role="list" className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {initial_questions.map((question: any) => <Card
                    onClick={() => {
                        setChatBoxText(question.body)
                        toggleQuestions(false)
                    }}
                    tags={question.tags[0]}
                    body={question.body}
                />)}
            </ul>}
            <div className="mt-4 grid grid-cols-1 gap-4">
                <ChatBubble position={Position.Right}/>
                <ChatBubble position={Position.Left} />
            </div>
            <div className="mt-6">
                <div className="grid md:grid-cols-6 sm:grid-cols-1 gap-4">
                    <div className="md:col-span-5">
                        <textarea  value={chatbox_text} onChange={({ target }) => {
                            setChatBoxText(target.value)
                        }} className="my-2 p-4 rounded w-full text-gray-600" placeholder="Can't find what you are looking for? Type your question here." /></div>
                    <button className="md:inline-block sm:hidden mb-2 mt-3 mx-8 text-center inline-flex items-center text-3xl text-green-500 bg-transparent"><FaPaperPlane className="mx-auto" /></button>
                </div>
            </div>
        </div>

    )
}