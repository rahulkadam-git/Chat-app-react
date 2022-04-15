import React from 'react';

import SingleChat from './SingleChat';

function ChatBox({fetchAgain,setFetchAgain}) {
   


    return (
        <div className="chatbox">
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </div>
    );
}

export default ChatBox;