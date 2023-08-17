import Fuse from 'fuse.js';
import { Key, ReactElement, useEffect, useState } from 'react';
import { FaExclamationCircle, FaPaperPlane, FaHome } from "react-icons/fa";
import { animateScroll as scroll } from 'react-scroll';
import { TypeAnimation } from "react-type-animation"
import { v4 as uuidv4 } from 'uuid';
import shuffle from 'fisher-yates';
import en_data from '../data/en/questions.json';
import intro_en_data from '../data/en/intro.json'
import extro_en_data from '../data/en/extro.json'

import ta_data from '../data/ta/questions.json';
import intro_ta_data from '../data/ta/intro.json'
import extro_ta_data from '../data/ta/extro.json'

import hi_data from '../data/hi/questions.json';
import intro_hi_data from '../data/hi/intro.json'
import extro_hi_data from '../data/hi/extro.json'

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

const fuse_en = new Fuse(en_data, fuseOptions);
const fuse_ta = new Fuse(ta_data, fuseOptions);
const fuse_hi = new Fuse(hi_data, fuseOptions);

enum Position {
    Left = 0,
    Right = 1
}

enum IChatMode {
    English = 0,
    Tagalog = 1,
    Hiligaynon = 2
}
interface IConversation {
    position: Position
    message: ReactElement
    id: Key
}

interface IConverstions extends Array<IConversation> { }

export default function Chat(props: any) {

    const ChatMode: IChatMode = (props.ChatMode)

    const [chatbox_text, setChatBoxText] = useState("")
    const [questions_visible, toggleQuestions] = useState(true)
    const [conversations, setConverstations] = useState<IConverstions>([])
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
        setConverstations(conversations => [...conversations, { position: Position.Right, message: <span>{query}</span>, id: uuidv4() }])
    }

    function replyMessage(query: string) {

        const result_en = fuse_en.search(query)
        const result_ta = fuse_ta.search(query)
        const result_hi = fuse_hi.search(query)

        const not_found_message: ReactElement = <span><FaExclamationCircle className="text-yellow-500 mb-2" /><span> I found no matches with your query. You can check our </span><a className="underline" href="#" onClick={e => {
            e.preventDefault()
            setResultCount(en_data.length)
            toggleQuestions(true)
        }}>FAQ list</a>.</span>

        if (ChatMode == IChatMode.English) {
            if (result_en.length > 0) {
                // A score of 0 is perfect match
                const score = result_en[0].score ? result_en[0].score : 1
                setConverstations(conversations => [...conversations, { id: result_en[0].item.id, position: Position.Left, message: <span><TypeAnimation style={{ whiteSpace: 'pre-line' }} speed={80} cursor={false} sequence={[(result_en[0].item.response == "RANDOM" ? shuffle(intro_en_data)[0].body : result_en[0].item.response) + '\n\n' + shuffle(extro_en_data)[0].body]} /></span> }])
            } else {
                setConverstations(conversations => [...conversations, { id: uuidv4(), position: Position.Left, message: not_found_message }])
            }
        }

        if (ChatMode == IChatMode.Tagalog) {
            if (result_ta.length > 0) {
                // A score of 0 is perfect match
                const score = result_ta[0].score ? result_ta[0].score : 1
                setConverstations(conversations => [...conversations, { id: result_ta[0].item.id, position: Position.Left, message: <span><TypeAnimation style={{ whiteSpace: 'pre-line' }} speed={80} cursor={false} sequence={[(result_ta[0].item.response == "RANDOM" ? shuffle(intro_ta_data)[0].body : result_ta[0].item.response) + '\n\n' + shuffle(extro_ta_data)[0].body]} /></span> }])
            } else {
                setConverstations(conversations => [...conversations, { id: uuidv4(), position: Position.Left, message: not_found_message }])
            }
        }

        if (ChatMode == IChatMode.Hiligaynon) {
            if (result_hi.length > 0) {
                // A score of 0 is perfect match
                const score = result_hi[0].score ? result_hi[0].score : 1
                setConverstations(conversations => [...conversations, { id: result_hi[0].item.id, position: Position.Left, message: <span><TypeAnimation style={{ whiteSpace: 'pre-line' }} speed={80} cursor={false} sequence={[(result_hi[0].item.response == "RANDOM" ? shuffle(intro_hi_data)[0].body : result_hi[0].item.response) + '\n\n' + shuffle(extro_hi_data)[0].body]} /></span> }])
            } else {
                setConverstations(conversations => [...conversations, { id: uuidv4(), position: Position.Left, message: not_found_message }])
            }
        }

    }

    console.log(props)

    return (
        <div>
            {questions_visible && <ul role="list" className="grid md:grid-cols-2 gap-4 sm:grid-cols-1">
                {ChatMode == IChatMode.English && en_data.slice(0, result_count).map((question: any) => <Card key={uuidv4()}
                    onClick={() => {
                        sendMessage(question.body)
                    }}
                    tags={question.tags[0]}
                    body={question.body}
                />)}
                {ChatMode == IChatMode.Tagalog && ta_data.slice(0, result_count).map((question: any) => <Card key={uuidv4()}
                    onClick={() => {
                        sendMessage(question.body)
                    }}
                    tags={question.tags[0]}
                    body={question.body}
                />)}
                {ChatMode == IChatMode.Hiligaynon && hi_data.slice(0, result_count).map((question: any) => <Card key={uuidv4()}
                    onClick={() => {
                        sendMessage(question.body)
                    }}
                    tags={question.tags[0]}
                    body={question.body}
                />)}
            </ul>}
            <div className="mt-4 grid grid-cols-1 gap-4">
                {
                    ChatMode == IChatMode.English && <ChatBubble
                        key={"intro"}
                        id={uuidv4()}
                        position={Position.Left}
                        message={<span>{shuffle(intro_en_data)[0].body}</span>}
                    />                    
                }
                {
                    ChatMode == IChatMode.Tagalog && <ChatBubble
                    key={"intro"}
                    id={uuidv4()}
                    position={Position.Left}
                    message={<span>{shuffle(intro_ta_data)[0].body}</span>}
                />
                }
                {
                    ChatMode == IChatMode.Hiligaynon && <ChatBubble
                    key={"intro"}
                    id={uuidv4()}
                    position={Position.Left}
                    message={<span>{shuffle(intro_hi_data)[0].body}</span>}
                />
                }
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
                <div className='mb-2'>
                <a href="/" className="mx-2 text-3xl text-green-700 hover:text-green-300 bg-transparent inline-flex"><FaHome className="mx-auto pt-3" /></a>
                    {ChatMode == IChatMode.English ? null : <a className='bg-green-800 text-white rounded hover:bg-green-700 px-4 py-2 text-center mx-2' href="/en">English</a>}
                    {ChatMode == IChatMode.Tagalog ? null : <a className='bg-green-800 text-white rounded hover:bg-green-700 px-4 py-2 text-center mx-2' href="/ta">Tagalog</a>}
                    {ChatMode == IChatMode.Hiligaynon ? null : <a className='bg-green-800 text-white rounded hover:bg-green-700 px-4 py-2 text-center mx-2' href="/hi">Hiligaynon</a>}
                    
                </div>
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