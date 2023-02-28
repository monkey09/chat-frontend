import { ChatState } from "@/Context/ChatProvider"
import { 
  Avatar, 
  Box, 
  createStyles, 
  Group, 
  Text 
} from "@mantine/core"
import { 
  showNotification, 
  updateNotification 
} from "@mantine/notifications"
import { 
  IconCheck, 
  IconInfoCircle 
} from "@tabler/icons"
import { accessChatReq } from '@/utils/chat'

const useStyles = createStyles(theme => ({
  box: {
    cursor: 'pointer',
    borderRadius: 8,
    '&:hover': {
      background: theme.colorScheme === 'dark' 
      ? '#2C2E33' 
      : '#F1F3F5'
    }
  }
}))

const SearchList = ({searchResult, triggerChats}) => {
  const { classes } = useStyles()
  const { user, chats, setSelectedChat } = ChatState()

  const accessChat = async result => {
    if (!result?._id)
      return showNotification({
        id: `access-chat`,
        color: 'red',
        title: 'فشل',
        message: 'يجب اختيار شخص لبدأ المحادثة',
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })

    const alreadyIn = chats
    .find(chat => chat.multi == false && chat.users
    .find(u => u._id === result._id))

    if (alreadyIn)
      return setSelectedChat(alreadyIn)

    showNotification({
      id: `access-chat-${result._id}`,
      loading: true,
      title: 'جاري ارسال البينات',
      message: `سيتم إضافة ${result.name} الي المحادثات`,
      autoClose: false,
      disallowClose: true
    })
    accessChatReq({result, token: user.token}).then(data => {
      triggerChats()
      updateNotification({
        id: `access-chat-${result._id}`,
        color: 'teal',
        title: 'تم',
        message: `لقد تم إضافة ${result.name} إلي المحادثات`,
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
    }).catch(e => {
      updateNotification({
        id: `access-chat-${result._id}`,
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const searchList = searchResult.map(result => (
    <Box 
      key={result._id} 
      my={5} 
      className={classes.box}
      p={7}
      onClick={() => accessChat(result)}
    >
      <Group position='apart'>
        <Group>
          <Avatar radius="xl" size="lg" src={result.pic} />
          <Box>
            <Text fw="bold" mb={1} lineClamp={1}>
              {result.name}
            </Text>
            <Text fz="sm" lineClamp={1}>
              {result.email}
            </Text>
          </Box>
        </Group>
      </Group>
    </Box>
  ))

  return searchList
}

export default SearchList