import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

function Messenger() {
    const [conversations, setConversations] = useState([]); // 대화방
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useContext(AuthContext);
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        // 여러번 연결 끊기
    }, []);
    // sock

    // useEffect(() => {
    //     // 받기
    //     socket?.on("welcome", (message) => {
    //         console.log(message);
    //     }); // "eventName", "{}"
    // }, [socket]);

    // 모두에게 보낼땐 상관없는데, 개인 톡은 아이디가 계속 변한다
    useEffect(() => {
        socket.current.emit("addUser", user._id); // ref썻으니까
        socket.current.on("getUsers", (users) => {
            console.log(users);
        });
    }, [user]);

    // sock

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };
        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getConversations();
    }, [user._id]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat._id);
                setMessages(res.data);
            } catch (e) {
                console.log(e);
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input
                            placeholder="Search for friends"
                            className="chatMenuInput"
                        />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation
                                    conversation={c}
                                    currentUser={user}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((msg) => {
                                        return (
                                            <div ref={scrollRef}>
                                                <Message
                                                    msg={msg}
                                                    own={
                                                        msg.sender === user._id
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        value={newMessage}
                                        onChange={(e) => {
                                            setNewMessage(e.target.value);
                                        }}
                                    ></textarea>
                                    <button
                                        onClick={handleSubmit}
                                        className="chatSubmitButton"
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <span className="noConversationText">
                                Open a conversation to start a chat
                            </span>
                        )}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline />
                        <ChatOnline />
                        <ChatOnline />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Messenger;
