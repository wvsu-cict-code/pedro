import Fuse from 'fuse.js';
import { Key, ReactElement, useEffect, useState } from 'react';
import { FaExclamationCircle, FaPaperPlane } from "react-icons/fa";
import { animateScroll as scroll } from 'react-scroll';
import { TypeAnimation } from "react-type-animation"
import { v4 as uuidv4 } from 'uuid';
import shuffle from 'fisher-yates';
import en_data from '../data/en/questions.json';
import intro_en_data from '../data/en/intro.json'
import extro_en_data from '../data/en/extro.json'
import BouncingLoader from "./BouncingLoader";
import Card from "./Card";
import ChatBubble from "./ChatBubble";


const fuseOptions = {
    includeScore: true,
    keys: [
        "tags",
        "body"
    ]
}

const wait_time = 1500

const fuse = new Fuse(en_data, fuseOptions);

enum Position {
    Left = 0,
    Right = 1
}
interface IConversation {
    position: Position
    message: ReactElement
    id:Key
}

interface IConverstions extends Array<IConversation> { }

export default function Chat() {

    const [chatbox_text, setChatBoxText] = useState("")
    const [questions_visible, toggleQuestions] = useState(true)
    const [conversations, setConverstations] = useState<IConverstions>([
        { id:uuidv4(), position: Position.Left, message: <span>{shuffle(intro_en_data)[0].body}</span> }
    ])
    const [is_loading, setLoading] = useState(false)
    const [result_count, setResultCount] = useState(6)

    useEffect(() => {
        let timer: any = null;
        if (is_loading) {
            timer = setInterval(() => {
                setLoading(false)
                replyMessage(chatbox_text)
            }, wait_time);
        }
        return () => {
            clearInterval(timer);
        };
    });

    function sendMessage(query: string) {
        scroll.scrollToBottom()
        setLoading(true)
        toggleQuestions(false)
        setChatBoxText(query)
        // query
        setConverstations(conversations => [...conversations, { position: Position.Right, message: <span>{query}</span>, id:uuidv4() }])
    }

    function replyMessage(query: string) {

        const result = fuse.search(query)
        const not_found_message: ReactElement = <span><FaExclamationCircle className="text-yellow-500 mb-2" /><span> I found no matches with your query. You can check our </span><a className="underline" href="#" onClick={e => {
            e.preventDefault()
            setResultCount(en_data.length)
            toggleQuestions(true)
        }}>FAQ list</a>.</span>

        if (result.length > 0) {
            // A score of 0 is perfect match
            const score = result[0].score ? result[0].score : 1
            console.log({ result })
            console.log({ score })

            setConverstations(conversations => [...conversations, { id: result[0].item.id,position: Position.Left, message: <span><TypeAnimation style={{whiteSpace: 'pre-line'}} speed={80} cursor={false} sequence={[result[0].item.response +'\n\n'+ shuffle(extro_en_data)[0].body]} /></span> }])
        } else {
            setConverstations(conversations => [...conversations, { id: uuidv4(), position: Position.Left, message: not_found_message }])
        }
    }

    return (
        <div>
            {questions_visible && <ul role="list" className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {en_data.slice(0, result_count).map((question: any) => <Card key={uuidv4()}
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
                        key={i.id}
                        id={uuidv4()}
                        position={i.position}
                        message={i.message.props.children}
                    />
                ))}
                {is_loading && <ChatBubble id={uuidv4()} key={uuidv4()} position={Position.Left} message={<BouncingLoader />} />}
            </div>
            <div className="mt-6">
                <div className="grid md:grid-cols-6 sm:grid-cols-1 gap-4">
                    <div className="md:col-span-5">
                        <textarea value={chatbox_text} onChange={({ target }) => {
                            setChatBoxText(target.value)
                        }} className="my-2 p-4 rounded w-full text-gray-600 border border-gray-400" placeholder="Can't find what you are looking for? Type your question here." /></div>
                    <button onClick={() => sendMessage(chatbox_text)} className="md:inline-block sm:hidden mb-2 mt-3 mx-8 text-center inline-flex items-center text-3xl text-green-500 hover:text-green-300 bg-transparent"><FaPaperPlane className="mx-auto" /></button>
                </div>
            </div>
        </div>

    )
}