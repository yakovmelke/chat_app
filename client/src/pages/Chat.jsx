import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { io } from "socket.io-client";

const allUsersRoute = `http://localhost:5000/api/auth/allusers`;

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();
  const checkLocalStorage = async () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
    }
  };
  useEffect(() => {
    checkLocalStorage();
  }, []);
  
  const checkMsg= async ()=>{
    if(currentUser){
      socket.current =io(`http://localhost:5000`)
      socket.current.emit("add-user",currentUser._id)
    }
  }
  
  useEffect(() => {
    checkMsg();
  }, [currentUser]);
  const getAllUsers = async () => {
    if (currentUser) {
      if (currentUser.isAvatarImgSet) {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data);
      } else {
        navigate("/setAvatar");
      }
    }
  };
  useEffect(() => {
    getAllUsers();
  }, [currentUser]);
  const HandelChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={HandelChatChange}
          />
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </Container>
    </>
  );
};
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
