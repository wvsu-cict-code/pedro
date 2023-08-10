import { FaPaperPlane, FaExclamationCircle } from "react-icons/fa";
import data from '../data/questions.json'
import Card from "./Card";
import { ReactElement, useState } from 'react'
import ChatBubble from "./ChatBubble";
import Fuse from 'fuse.js'
import { v4 as uuidv4 } from 'uuid';

const fuseOptions = {
    includeScore: true,
    keys: [
		"tags",
		"body"
	]
}

const fuse = new Fuse(data, fuseOptions);

const initial_questions = data.slice(0, 5)

enum Position {
    Left = 0,
    Right = 1
}
interface IConversation {
    position: Position
    message: ReactElement
}

interface IConverstions extends Array<IConversation>{}

export default function Chat() {
    const [chatbox_text, setChatBoxText] = useState("")
    const [questions_visible, toggleQuestions] = useState(true)
    const [conversations, setConverstations] = useState<IConverstions>([])

    function sendMessage(query:string){
        console.log({query})
        toggleQuestions(false)
        setChatBoxText(query)
        replyMessage(query)
    }

    function replyMessage(query:string){
        
        const result = fuse.search(query)
        const not_found_message: ReactElement = <span><FaExclamationCircle className="text-yellow-500 mb-2" /><span> I found no matches with your query. You can check our </span><a className="underline" href="/">FAQ list</a>.</span>

        // query
        setConverstations(conversations => [...conversations, {position:Position.Right, message: <span>{query}</span>}])
        
        if (result.length > 0) {
            // A score of 0 is perfect match
            const score = result[0].score?result[0].score:1
            console.log({score})
            
            if(score>0.000001){
                setConverstations(conversations => [...conversations, {position:Position.Left, message: <span>{result[0].item.response}</span>}])
            }else{
                setConverstations(conversations => [...conversations, {position:Position.Left, message: not_found_message}])
            }            
        }else{
            setConverstations(conversations => [...conversations, {position:Position.Left, message: not_found_message}])
        }
    }

    return (
        <div>
            {questions_visible && <ul role="list" className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {initial_questions.map((question: any) => <Card key={uuidv4()}
                    onClick={() => {
                        sendMessage(question.body)
                    }}
                    tags={question.tags[0]}
                    body={question.body}
                />)}
            </ul>}
            <div className="mt-4 grid grid-cols-1 gap-4">
                {conversations.map(i => (
                    <ChatBubble 
                    key={uuidv4()}
                    position={i.position}
                    message={i.message.props.children}
                    />
                ))}
            </div>
            <div className="mt-6">
                <div className="grid md:grid-cols-6 sm:grid-cols-1 gap-4">
                    <div className="md:col-span-5">
                        <textarea  value={chatbox_text} onChange={({ target }) => {
                            setChatBoxText(target.value)
                        }} className="my-2 p-4 rounded w-full text-gray-600" placeholder="Can't find what you are looking for? Type your question here." /></div>
                    <button onClick={()=>sendMessage(chatbox_text)} className="md:inline-block sm:hidden mb-2 mt-3 mx-8 text-center inline-flex items-center text-3xl text-green-500 bg-transparent"><FaPaperPlane className="mx-auto" /></button>
                </div>
            </div>
        </div>

    )
}