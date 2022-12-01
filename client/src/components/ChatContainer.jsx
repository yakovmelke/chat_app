import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";


const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const scrollRef = useRef();
  const getAllMsg = async () => {
    const api = `http://localhost:5000/api/messages/getmsg`;
    const { data } = await axios.post(api, {
      from: currentUser._id,
      to: currentChat._id,
    });
    setMessages(data);
  };
  useEffect(() => {
    getAllMsg();
  }, [currentChat]);

  const handelSendMsg = async (msg) => {
    if (currentChat) {
      const apiAddMsg = `http://localhost:5000/api/messages/addmsg`;
      const { data } = await axios.post(apiAddMsg, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    }
  };
  const checkConnection = () => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessages({ fromSelf: false, message: msg });
      });
    }
  };
  useEffect(() => checkConnection(), []);

  const checkNewMsg = () => {
    arrivalMessages && setMessages((prev) => [...prev, arrivalMessages]);
  };
  useEffect(() => checkNewMsg(), [arrivalMessages]);

  const scroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scroll(), [messages]);
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat?.avatarImg}`}
              alt="avatar picture"
            />
          </div>
          <div className="username">
            <h3>{currentChat?.userName}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((mes, index) => {
          return (
            <div ref={scrollRef} key={index}>
              <div
                className={`message ${mes.fromSelf ? "sended" : "received"}`}
              >
                <div className="content">
                  <p>{mes.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handelSendMsg={handelSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar{
      width:0.2rem;
      &-thumb{
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
