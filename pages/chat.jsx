import { useRouter } from "next/router"
import { getChatsReq } from '@/utils/chat'
import { useEffect, useState } from "react"
import { useMediaQuery } from "@mantine/hooks"
import ChatLHS from "@/components/chat/ChatLHS"
import ChatRHS from "@/components/chat/ChatRHS"
import { ChatState } from "@/Context/ChatProvider"
import { AppShell, Box, createStyles, Loader } from "@mantine/core"

const useStyles = createStyles(theme => ({
  placeholder: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const Chat = () => {
  const router = useRouter()
  const { classes } = useStyles()
  const [opened, setOpened] = useState(true)
  const largeScreen = useMediaQuery('(min-width: 992px)')
  const [allow, setAllow] = useState(false)
  const {user, selectedChat, setChats} = ChatState()
  const [chatsLoader, setChatsLoader] = useState(true)

  const triggerChats = () => {
    setChatsLoader(true)
    setChats([])
    getChatsReq({token: user.token}).then(data => {
      setChatsLoader(false)
      setChats(data)
    })
  }

  useEffect(() => {
    if (!largeScreen && selectedChat) {
      setOpened(false)
    }
  }, [selectedChat])
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      setAllow(true)
      router.push('/chat')
    } else {
      setAllow(false)
      router.push('/')
    }
  }, [])

  if (allow) {
    return (
      <AppShell 
        navbar={
        largeScreen
        ? <ChatRHS 
            setOpened={setOpened} 
            opened={opened} 
            chatsLoader={chatsLoader}
            triggerChats={triggerChats}
          />
        : null
        } 
        styles={{main: {padding: 0}}}
      >
        <ChatLHS 
          setOpened={setOpened} 
          opened={opened} 
          chatsLoader={chatsLoader}
          triggerChats={triggerChats}
        />
      </AppShell>
    )
  } else {
    return (
      <Box className={classes.placeholder}>
        <Loader variant="dots" color="Primary.0" size="xl" />
      </Box>
    )
  }
}

export default Chat