import { 
  Avatar, 
  Box, 
  createStyles, 
  Group, 
  Indicator, 
  Text 
} from "@mantine/core"
import { ChatState } from "@/Context/ChatProvider"
import { IconMicrophone } from "@tabler/icons"

const useStyles = createStyles(theme => ({
  box: {
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: 8,
    '&:hover': {
      background: theme.colorScheme === 'dark' 
      ? '#2C2E33' 
      : '#F1F3F5'
    }
  },
  selectedBox: {
    overflow: 'hidden',
    cursor: 'pointer',
    borderRadius: 8,
    background: theme.colors.Primary[0],
    color: '#FFF'
  },
  unseen: {
    borderRadius: '50%',
    background: theme.colors.red[8],
    color: '#FFF',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const ChatsList = ({ chats }) => {
  const { classes } = useStyles()
  const {
    user, 
    setSelectedChat, 
    selectedChat, 
    notifications, 
    setNotifications,
    activeUsers
  } = ChatState()

  const notificationsHandler = (item) => {
    const myNoti = []
    if (notifications.length > 0) {
      notifications.forEach(noti => {
        if (noti.chat._id == item._id) {
          myNoti.push(noti)
        }
      })
    }
    return myNoti
  }

  const lastMessage = (item) => {
    let myNoti
    if (notifications.length > 0) {
      notifications.forEach(noti => {
        if (noti.chat._id == item._id) {
          myNoti=noti
        } else {
          myNoti = null
        }
      })
    }
    return myNoti
  }

  const checkRecord = (item) => {
    if (item) {
      if (item.record) return (<IconMicrophone stroke={1} size={15} />)
      else return item.content
    }
  }

  const lastSender = (item) => {
    if (item.multi) {
      if (lastMessage(item)) {
        if (item.sender._id == user._id) return 'انت'
        else return lastMessage(item).sender.name
      } else {
        if (item.latest?.sender._id == user._id) return 'انت'
        else return item.latest?.sender.name
      }
    } else {
      return null
    }
  }

  const clearNotifications = (item) => {
    const filteredNoti = notifications.filter(noti => noti.chat._id != item._id)
    setNotifications(filteredNoti)
  }

  const openChat = (item) => {
    setSelectedChat(item)
    clearNotifications(item)
  }

  const chatsList = chats.map(item => (
    <Box 
      my={5} 
      className={selectedChat?._id === item._id 
      ? classes.selectedBox 
      : classes.box} 
      key={item._id} 
      p={7}
      onClick={() => openChat(item)}
    >
      <Group position='apart'>
        <Group>
          {item.multi ? (
              <Avatar
                radius="xl" 
                size="lg" 
                src="https://icon-library.com/images/group-icon-png/group-icon-png-1.jpg"
              />
            ) : (
              <Indicator
                dot 
                inline 
                position="bottom-start" 
                disabled={
                  !activeUsers.includes(item.users.find(u => u._id != user._id)._id)
                }
                offset={7}
                styles={{indicator: {background: '#1dd1a1'}}}
              >
                <Avatar
                  radius="xl" 
                  size="lg" 
                  src={item.users.find(u => u._id != user._id).pic} 
                />
              </Indicator>
            )
          }
          <Box sx={{width:'calc(100% - 80px) !important'}}>
            <Text fw="bold" mb={1}>
              {
                item.multi 
                ? item.name 
                : item.users.find(u => u._id != user._id).name
              }
            </Text>
            {selectedChat?._id != item._id && 
              <Group>
                <Text color="dimmed" fz="sm" lineClamp={1} sx={{width: 140}}>
                  {lastSender(item) && 
                    <Text color="dimmed" mr={3} fw="bold" display="inline" fz="sm">
                      {lastSender(item)}:
                    </Text>
                  }
                  {lastMessage(item) ? checkRecord(lastMessage(item)) : checkRecord(item.latest)}
                </Text>
              </Group>
            }
          </Box>
        </Group>
        {notificationsHandler(item).length > 0 &&  
          <Box className={classes.unseen} pt={3} pl={1}>
            {notificationsHandler(item).length}
          </Box>
        }
      </Group>
    </Box>
  ))

  return chatsList
}

export default ChatsList