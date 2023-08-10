enum Position {
    Left = 0,
    Right = 1
}

interface Props {
    position: Position
    message?: String
}

export default function ChatBubble({ position, message }: Props) {
    return (
        <div>
            <p className={`${position ? 'text-right' : 'text-left'} my-2`}>
                <div className={`w-fit rounded-lg text-white p-4 ${position ? 'bg-green-600 mr-0 ml-auto' : 'bg-gray-800'}`}>
                    {message?message:'Error retrieving message.'}
                </div>
                {position ?
                    <div className="text-sm opacity-50 mt-2">
                        Anonymous
                    </div> : null
                }
                {!position ?
                    <div className="flex">
                        <img className="w-8 h-8 mx-0 left-0" src="pedro_bubble.png" />
                        <div className="text-sm opacity-50 mt-4 ml-2">
                            Pedro
                        </div>
                    </div> : null}
            </p>
        </div>
    )
}