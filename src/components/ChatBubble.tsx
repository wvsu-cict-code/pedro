import type { ReactElement } from "react"

enum Position {
    Left = 0,
    Right = 1
}

enum IChatMode {
    English = 0,
    Tagalog = 1,
    Hiligaynon = 2
}

interface IProps {
    id: String
    position: Position
    message?: ReactElement,
    mode: IChatMode
}

export default function ChatBubble({ position, message, mode }: IProps) {
    return (
        <div>
            <div className={`${position ? 'text-right' : 'text-left'} my-2`}>
                {
                    message ? <div className={`steps--2 w-fit rounded-lg border border-gray-100 shadow-md text-gray-900 p-4 ${position ? 'bg-green-100 mr-0 ml-auto' : 'bg-white'} `}>
                        {message}
                    </div> : <div className={`steps--2 w-fit rounded-lg border border-gray-100 shadow-md text-gray-900 p-4 bg-orange-400 `}>
                        {message ? message : 'Error retrieving message.'}
                    </div>
                }
                {position ?
                    <div className="text-sm opacity-50 mt-2">
                        Anonymous
                    </div> : null
                }
                {!position ?
                    <div className="flex">
                        {mode==IChatMode.English&&<img className="w-8 h-8 mx-0 left-0" src="pedro_bubble.png" />}
                        {mode==IChatMode.Tagalog&&<img className="w-8 h-8 mx-0 left-0" src="pedro_bubble.png" />}
                        {mode==IChatMode.Hiligaynon&&<img className="w-8 h-8 mx-0 left-0" src="pedro_bubble.png" />}
                        <div className="text-sm opacity-50 mt-4 ml-2">
                            Pedro
                        </div>
                    </div> : null}
            </div>
        </div>
    )
}