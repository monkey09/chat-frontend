import { 
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  createStyles,
  Group,
  Loader,
  Modal, 
  ScrollArea, 
  Text,
  TextInput
} from '@mantine/core'
import {
  renameGroupReq,
  addToGroupReq,
  removeFromGroupReq
} from '@/utils/group'
import { useEffect, useState } from 'react'
import { getSearchReq } from '@/utils/user'
import { ChatState } from '@/Context/ChatProvider'
import { hasLength, useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { IconCheck, IconInfoCircle, IconPencil, IconX } from '@tabler/icons'
import { showNotification, updateNotification } from '@mantine/notifications'

const useStyles = createStyles(theme => ({
  box: {
    cursor: 'pointer',
    borderRadius: 8,
    '&:hover': {
      background: theme.colorScheme === 'dark' 
      ? '#2C2E33' 
      : '#F1F3F5'
    }
  },
  loaderContainer: {
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const GroupHandler = ({groupModal, setGroupModal, triggerChats}) => {
  const { classes } = useStyles()
  const { user, setSelectedChat, selectedChat } = ChatState()
  const [searchValue, setSeachValue] = useState('')
  const [debounced] = useDebouncedValue(searchValue, 200)
  const [searchResult, setSearchResult] = useState([])
  const [searchLoader, setSearchLoader] = useState(false)
  const [groupUsers, setGroupUsers] = useState(selectedChat.users)

  const form = useForm({
    initialValues: {
      name: selectedChat.name,
    },
    validate: {
      name: hasLength({min: 3, max: 10}, 
      'اسم المجموعة يجب ان يتكون من 3 الي 10 احرف')
    }
  })

  const formReset = () => {
    setGroupModal(false)
    setSearchResult([])
    setSeachValue('')
  }

  const renameGroup = values => {
    const request = {
      name: values.name,
      id: selectedChat._id
    }
    showNotification({
      id: 'rename-group',
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات المجموعة',
      autoClose: false,
      disallowClose: true
    })
    renameGroupReq({request, token: user.token}).then(data => {
      triggerChats()
      setSelectedChat(data)
      updateNotification({
        id: 'rename-group',
        color: 'teal',
        title: 'تم',
        message: 'لقد تم تغيير إسم المجموعة بنجاح',
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
    }).catch(e => {
      updateNotification({
        id: 'create-group',
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const addToGroup = result => {
    const request = {
      chat: selectedChat,
      user: result
    }
    showNotification({
      id: `add-to-group-${result._id}`,
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات إضافة العضو',
      autoClose: false,
      disallowClose: true
    })
    addToGroupReq({request, token: user.token}).then(data => {
      setSelectedChat(data)
      setGroupUsers([...groupUsers, result])
      updateNotification({
        id: `add-to-group-${result._id}`,
        color: 'teal',
        title: 'تم',
        message: `لقد تم إضافة ${result.name} بنجاح`,
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
    }).catch(e => {
      updateNotification({
        id: `add-to-group-${result._id}`,
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const removeFromGroup = result => {
    const request = {
      chat: selectedChat,
      user: result
    }
    showNotification({
      id: `remove-from-group-${result._id}`,
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات حذف العضو',
      autoClose: false,
      disallowClose: true
    })
    removeFromGroupReq({request, token: user.token}).then(data => {
      setSelectedChat(data)
      const newGroup = groupUsers.filter(item => item._id !== result._id)
      setGroupUsers(newGroup)
      updateNotification({
        id: `remove-from-group-${result._id}`,
        color: 'teal',
        title: 'تم',
        message: `لقد تم حذف ${result.name} بنجاح`,
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
    }).catch(e => {
      updateNotification({
        id: `remove-from-group-${result._id}`,
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  const filteredSearch = (originalSearch) => {
    const filteredSearchResults = []
    originalSearch.forEach(item => {
      const exist = groupUsers.find(u => u._id === item._id)
      if (!exist) filteredSearchResults.push(item)
    })
    setSearchResult(filteredSearchResults)
  }

  useEffect(() => {
    filteredSearch(searchResult)
  }, [groupUsers])

  useEffect(() => {
    if (searchValue.trim() !== '') {
      setSearchResult([])
      setSearchLoader(true)
      getSearchReq({search: searchValue, token: user.token}).then(data => {
        setSearchLoader(false)
        filteredSearch(data)
      })
    } else {
      setSearchLoader(false)
      setSearchResult([])
    }
  }, [debounced])

  const groupUsersItems = groupUsers.map(item => (
    <Badge
      key={item._id}
      sx={{ paddingLeft: 0 }} 
      size="lg" 
      radius="xl" 
      color={item._id === user._id ? 'red' : 'Primary.0'}
      variant='outline'
      rightSection={
        item._id !== user._id && (
          <ActionIcon
            size="xs" 
            color="Primary.0" 
            radius="xl" 
            variant="transparent"
            onClick={() => removeFromGroup(item)}
          >
            <IconX size={10} />
          </ActionIcon>
        )
      }
      leftSection={
        <Avatar
          size={24}
          mr={5}
          src={item.pic}
        />
      }
    >
      {item._id === user._id ? 'انت' : item.name}
    </Badge>
  ))

  const searchResultItems = searchResult.map(result => (
    <Box 
      key={result._id} 
      my={5} 
      className={classes.box}
      p={7}
      onClick={() => addToGroup(result)}
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

  return (
    <Modal
      opened={groupModal}
      onClose={() => setGroupModal(false)}
      withCloseButton={false}
    >
      <form onSubmit={form.onSubmit(values => renameGroup(values))}>
        <TextInput 
          mb="md"
          autoComplete="off"
          label="اسم المجموعة"
          rightSection={
            <ActionIcon type="submit">
              <IconPencil stroke={1.4} />
            </ActionIcon>
          }
          {...form.getInputProps('name')}
        />
        <TextInput 
          label="الاعضاء"   
          autoComplete="off"
          placeholder='إضافة عضو جديد'
          value={searchValue}
          onChange={e => setSeachValue(e.currentTarget.value)}
        />
        {groupUsers.length > 0 &&
          <Group my="sm">
            {groupUsersItems}
          </Group>
        }
        {searchLoader && 
          <Box className={classes.loaderContainer}>
            <Loader color="Primary.0" size="sm" />
          </Box>
        }
        {searchResult.length > 0 && 
          <ScrollArea style={{height: 300}} scrollbarSize={5}>
            {searchResultItems}
          </ScrollArea>
        }
        <Button variant='default' onClick={formReset} fullWidth mt="md">
            إغلاق
        </Button>
      </form>
    </Modal>
  )
}

export default GroupHandler