import { 
  ActionIcon, 
  Box, 
  createStyles, 
  Drawer, 
  Group, 
  HoverCard, 
  Indicator, 
  Loader, 
  ScrollArea, 
  Text, 
  TextInput, 
  Title, 
} from "@mantine/core"
import { 
  IconArrowRight,
  IconBrandTelegram, 
  IconDotsVertical,
  IconInfoCircle,
  IconMicrophone,
  IconMoodHappy,
  IconPlayerPause,
  IconTrash, 
} from "@tabler/icons"
import {
  getMessagesReq,
  sendMessageReq,
  sendRecordReq
} from '@/utils/message'
import io from 'socket.io-client'
import emojis from '@/utils/emojis'
import { useMediaQuery } from "@mantine/hooks"
import ChatRHS from "@/components/chat/ChatRHS"
import AudioPlayer from "react-h5-audio-player"
import { ChatState } from "@/Context/ChatProvider"
import Messages from "@/components/other/Messages"
import { useEffect, useRef, useState } from "react"
import UserHandler from "@/components/other/UserHandler"
import GroupViewer from "@/components/other/GroupViewer"
import { showNotification } from "@mantine/notifications"
import GroupHandler from "@/components/other/GroupHandler"
import { useReactMediaRecorder } from 'react-media-recorder'

const useStyles = createStyles(theme => ({
  navbar: {
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, .25)',
    zIndex: 1,
    position: 'relative',
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  placeholder: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  main: {
    height: 'calc(100vh - 125px)',
    overflow: 'hidden'
  },
  rightText: {
    wordWrap: 'break-word',
    backgroundColor: theme.colors.Primary[0],
    borderRadius: 8,
    position: 'relative',
  },
  rightArrow: {
    width: 10,
    height: 10,
    background: theme.colors.Primary[0],
    position: 'absolute',
    transform: 'rotate(-20deg)',
    bottom: 3,
    left: -1
  },
  chatPlaceholder: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    backgroundColor: theme.colorScheme === 'dark' 
    ? '#1A1B1E' 
    : '#FFF',
    borderTop: '1px solid',
    borderColor: theme.colorScheme === 'dark' 
    ? '#444' 
    : '#DDD',
    height: 55
  },
  input: {
    width: 'calc(100% - 160px)'
  },
  previewContainer: {
    width: 'calc(100% - 160px)',
    height: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fill: theme.colorScheme === 'dark' 
    ? '#DDD' 
    : '#333',
  },
  send: {
    transform: 'rotateY(180deg)',
    color: '#FFF',
  }
}))

const ENDPOINT = 'http://localhost:5000'
let socket, selectedChatCompare

const ChatLHS = ({setOpened, opened, chatsLoader, triggerChats}) => {
  const { classes } = useStyles()
  const largeScreen = useMediaQuery('(min-width: 992px)')
  const { 
    user, 
    selectedChat, 
    notifications, 
    setNotifications, 
    setSelectedChat,
    activeUsers,
    setActiveUsers
  } = ChatState()
  const [groupModal, setGroupModal] = useState(false)
  const [groupViewer, setGroupViewer] = useState(false)
  const [userModal, setUserModal] = useState(false)
  // chat logic
  const ref = useRef(null)
  const viewport = useRef(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('') 
  const [inputDis, setInputDis] = useState(false)
  // socket logic
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  // record logic
  const [isNowRecording, setIsNowRecording] = useState(false)
  const [recordActions, setRecordActions] = useState(false)
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ 
    audio: true, 
    blobPropertyBag: {type: "audio/webm"}
  })

  const onStart = () => {
    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }
    startRecording()
    setIsNowRecording(true)
    setRecordActions(false)
  }

  const onStop = () => {
    setTyping(false)
    socket.emit('stop typing', selectedChat._id)
    stopRecording()
    setIsNowRecording(false)
    setRecordActions(true)
  }

  const onCanecl = () => {
    setIsNowRecording(false)
    setRecordActions(false)
  }

  const getMessages = () => {
    setLoading(true)
    getMessagesReq({request: selectedChat, token: user.token}).then(data => {
      setLoading(false)
      setMessages(data)
      socket.emit('join chat', selectedChat._id)
    }).catch(e => {
      setLoading(false)
      showNotification({
        id: 'err-get',
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))
    socket.on('broadcast', (actives) => {      
      const filteredA = actives.filter(active => active.c != user._id)
      const cActives = filteredA.map(active => active.c)
      setActiveUsers(cActives)
    })
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  const sendRecord = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob())
    const audioFile = new File([audioBlob], 'c.webm', { type: 'audio/webm' })
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('chat', selectedChat._id)
    socket.emit('stop typing', selectedChat._id)
    setNewMessage('')
    setInputDis(true)
    setTyping(false)
    sendRecordReq({request: formData, token: user.token}).then(data => {
      setRecordActions(false)
      setInputDis(false)
      ref.current?.focus()
      setMessages([...messages, data])
      socket.emit('new message', data)
    }).catch(e => {
      setInputDis(false)
      showNotification({
        id: 'err-send',
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const sendMessage = () => {
    const request = {
      chatId: selectedChat._id,
      content: newMessage.trim()
    }
    socket.emit('stop typing', selectedChat._id)
    setNewMessage('')
    setInputDis(true)
    sendMessageReq({request, token: user.token}).then(data => {
      setInputDis(false)
      ref.current?.focus()
      setMessages([...messages, data])
      socket.emit('new message', data)
    }).catch(e => {
      setInputDis(false)
      showNotification({
        id: 'err-send',
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const scrollToBottom = () => {
    if (viewport?.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (selectedChat) {
      getMessages()
      selectedChatCompare = selectedChat
      ref.current?.focus()
    }
    setNewMessage('')
  }, [selectedChat])

  useEffect(() => {
    if (selectedChat && messages.length > 2) scrollToBottom()
    if (selectedChatCompare?._id) {
      socket.on('typing', (room) => {
        if (room == selectedChatCompare._id) {
          setIsTyping(true)
        }
      })
    }
    socket.on('message recieved', (newMessageRec) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id != newMessageRec.chat._id
      ) {
        if (!notifications.includes(newMessageRec)) {
          setNotifications([newMessageRec, ...notifications])
        }
      } else {
        setMessages([...messages, newMessageRec])
      }
    })
  })

  useEffect(() => {
    if (!user) socket.emit('logout')
  }, [user])

  const typingHandler = e => {
    setNewMessage(e.currentTarget.value)
    if (!socketConnected) {
      return
    }
    if (!typing) {
    setTyping(true)
    socket.emit('typing', selectedChat._id)
      setTimeout(() => {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }, 3000)
    }
  }

  const triggerDrawer = () => {
    setOpened(true)
    setSelectedChat(null)
  }

  return (
    <>
      {!largeScreen && 
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          withOverlay={false}
          withCloseButton={false}
        >
          <ChatRHS 
            setOpened={setOpened} 
            opened={opened} 
            chatsLoader={chatsLoader}
            triggerChats={triggerChats}
          />
        </Drawer>
      }
      {selectedChat && 
        <>
          <Box className={classes.navbar} px="md">
            {!largeScreen && 
              <Indicator 
                color="red" 
                label={parseInt(notifications.length)}
                overflowCount={9}
                size={18}
                showZero={false}
                dot={false}
              >
                <ActionIcon onClick={triggerDrawer}>
                  <IconArrowRight />
                </ActionIcon>
              </Indicator>
            }
            <Box>
              {selectedChat.multi ? (
                  <Title order={3} mt={10} ml="sm">
                    {selectedChat.name}
                  </Title>
                ) : (
                  <>
                    <Title order={4} mt={10} ml="sm">
                      {selectedChat.users.find(u => u._id != user._id).name}
                    </Title>
                    {activeUsers.includes(selectedChat.users.find(u => u._id != user._id)._id) &&
                      <Text fz="xs" ml="sm" color="dimmed">
                        {isTyping ? 'يكتب...' : 'متصل الآن'}
                      </Text>
                    }
                  </>
                )
              }
            </Box>
            {selectedChat.multi && selectedChat.admin._id == user._id && (
              <>
                <GroupHandler 
                  groupModal={groupModal}
                  setGroupModal={setGroupModal}
                  triggerChats={triggerChats}
                  key={selectedChat._id}
                />
                <ActionIcon onClick={() => setGroupModal(true)}>
                  <IconDotsVertical />
                </ActionIcon>
              </>
            )}
            {selectedChat.multi && selectedChat.admin._id != user._id && (
              <>
                <GroupViewer
                  groupViewer={groupViewer}
                  setGroupViewer={setGroupViewer}
                />
                <ActionIcon onClick={() => setGroupViewer(true)}>
                  <IconDotsVertical />
                </ActionIcon>
              </>
            )}
            {!selectedChat.multi && (
              <>
                <UserHandler 
                  userModal={userModal}
                  setUserModal={setUserModal}
                  user={
                    selectedChat.users.find(u => u._id != user._id)
                  }
                />
                <ActionIcon onClick={() => setUserModal(true)}>
                  <IconDotsVertical />
                </ActionIcon>
              </>
            )}
          </Box>
          <Box className={classes.main}>
            {loading &&
              <Box className={classes.chatPlaceholder}>
                <Loader color="Primary.0" />
              </Box>
            }
            {messages.length > 0 && 
            <ScrollArea 
              style={{height: '100%'}} 
              viewportRef={viewport}
              px={1}
              scrollbarSize={5}
            >
              <Messages messages={messages} />
              {isTyping ? 
                <Box 
                  className={classes.rightText} 
                  display="inline-block"
                  px="xs" 
                  pb={2} 
                  pt={0}
                  ml={5}
                  mb={5}
                >
                  <div className={classes.rightArrow}></div>
                  <Loader variant="dots" size="sm" color="#FFF" /> 
                </Box>
              : (<></>)}
            </ScrollArea>
            }
          </Box>
          <Box className={classes.footer}>
            <Group>
              {(!isNowRecording && !recordActions) &&
                <ActionIcon ml={5} onClick={onStart} disabled={inputDis}>
                  <IconMicrophone stroke={1.2} size={28} color="#666" />
                </ActionIcon>
              }
              {isNowRecording &&
                <ActionIcon ml={5} onClick={onStop}>
                  <IconPlayerPause stroke={1.2} size={28} color="#666" />
                </ActionIcon>}
              {recordActions &&
                <ActionIcon ml={5} onClick={onCanecl}>
                  <IconTrash stroke={1.2} size={28} color="#666" />
                </ActionIcon>
              }
              {recordActions ? (
                <Box className={classes.previewContainer}>
                  <AudioPlayer
                    src={`${mediaBlobUrl}`}
                  />
                </Box>
              ) : (
                <TextInput 
                  styles={{input: {height: 54, fontSize: 16, color: '#555'}}}
                  className={classes.input}
                  disabled={inputDis}
                  ref={ref}
                  autoComplete="off"
                  autoFocus={true}
                  type="text"
                  px={largeScreen ? "md" : 0}
                  placeholder="اكتب شيئا هنا..."
                  variant="unstyled"
                  value={newMessage}
                  onKeyDown={e => {
                    if (e.code == 'Enter') sendMessage()
                  }}
                  onChange={e => typingHandler(e)}
                />
              )}
              <Group position="center">
                <HoverCard width={285} shadow="md">
                  <HoverCard.Target>
                    <ActionIcon>
                      <IconMoodHappy stroke={1.2} size={28} color="#666" />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Group>
                      {emojis.map((emoji, i) => (
                        <ActionIcon
                          key={i}
                          onClick={() => {
                            setNewMessage(`${newMessage}${emoji} `)
                            ref.current?.focus()
                          }}
                        >
                          <Text>{emoji}</Text>
                        </ActionIcon>
                      ))}
                    </Group>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
              {recordActions ?
                <ActionIcon 
                  radius="xl" 
                  bg="Primary.0" 
                  variant="transparent" 
                  loading={inputDis}
                  loaderProps={{color: "#FFF"}}
                  size="xl"
                  onClick={sendRecord}
                >
                  <IconBrandTelegram  
                    className={classes.send} 
                    stroke={1}
                    size={28}
                  />
                </ActionIcon> :
                <ActionIcon 
                  radius="xl" 
                  bg="Primary.0" 
                  variant="transparent" 
                  loading={inputDis}
                  loaderProps={{color: "#FFF"}}
                  size="xl"
                  onClick={sendMessage}
                >
                  {isNowRecording ? (
                    <Loader size="xs" variant="bars" color="#FFF" />
                  ) : (
                    <IconBrandTelegram  
                      className={classes.send} 
                      stroke={1}
                      size={28}
                    />
                  )}
                </ActionIcon>
              }
            </Group>
          </Box>
        </>
      }
      {!selectedChat &&
        <Box className={classes.placeholder}>
          <Title 
            color="dimmed" 
            order={largeScreen ? 2 : 3}
          >
            اختر محادثة لبدأ الدردشة
          </Title>
          {!largeScreen &&
            <ActionIcon 
              onClick={() => setOpened(true)}
              variant="filled"
              color="Primary.0"
              mt='xl'
            >
              <IconArrowRight />
            </ActionIcon>
          }
        </Box>
      }
    </>
  )
}

export default ChatLHS