import { createContext, useContext, useEffect, useState } from "react"

const ChatContext = createContext()

const ChatProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)
  }, [])

  return (
    <ChatContext.Provider 
      value={{
        user, 
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
        activeUsers,
        setActiveUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

const ChatState = () => {
  return useContext(ChatContext)
}

export { ChatState }
export default ChatProvider