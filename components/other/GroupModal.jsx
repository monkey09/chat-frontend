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
import { useEffect, useState } from 'react'
import { getSearchReq } from '@/utils/user'
import { createGroupReq } from '@/utils/group'
import { ChatState } from '@/Context/ChatProvider'
import { hasLength, useForm } from '@mantine/form'
import { useDebouncedValue } from '@mantine/hooks'
import { IconCheck, IconInfoCircle, IconPlus, IconX } from '@tabler/icons'
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

const GroupModal = ({triggerChats}) => {
  const { classes } = useStyles()
  const [groupModal, setGroupModal] = useState(false)
  const [searchValue, setSeachValue] = useState('')
  const [debounced] = useDebouncedValue(searchValue, 200)
  const [searchResult, setSearchResult] = useState([])
  const [searchLoader, setSearchLoader] = useState(false)
  const [groupUsers, setGroupUsers] = useState([])
  const [groupError, setGroupError] = useState(false)
  const { user, setSelectedChat } = ChatState()

  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: hasLength({min: 3, max: 10},
      'اسم المجموعة يجب ان يتكون من 3 الي 10 احرف')
    }
  })

  const formReset = () => {
    setGroupModal(false)
    form.reset()
    setSearchResult([])
    setGroupUsers([])
    setSeachValue('')
    setGroupError(false)
  }

  const createGroup = values => {
    const request = {
      name: values.name,
      users: groupUsers
    }
    if (groupUsers.length < 2) return
    formReset()
    showNotification({
      id: 'create-group',
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات المجموعة',
      autoClose: false,
      disallowClose: true
    })
    
    createGroupReq({request, token: user.token}).then(data => {
      triggerChats()
      setSelectedChat(data)
      updateNotification({
        id: 'create-group',
        color: 'teal',
        title: 'تم',
        message: 'لقد تم إنشاء المجموعة بنجاح',
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

  const submitPre = () => {
    if (groupUsers.length < 2) setGroupError(true)
    else setGroupError(false)
  }

  const closeModal = () => {
    formReset()
    setGroupModal(false)
  }

  const addToGroup = result => {
    const exist = groupUsers.find(u => u._id === result._id)
    if (!exist) setGroupUsers([...groupUsers, result])
  }

  const removeFromGroup = result => {
    const newGroup = groupUsers.filter(item => item._id !== result._id)
    setGroupUsers(newGroup)
    setSearchResult([result, ...searchResult])
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
      color="Primary.0" 
      variant='outline'
      rightSection={
        <ActionIcon
          size="xs" 
          color="Primary.0" 
          radius="xl" 
          variant="transparent"
          onClick={() => removeFromGroup(item)}
        >
          <IconX size={10} />
        </ActionIcon>
      }
      leftSection={
        <Avatar
          size={26}
          mr={5}
          src={item.pic}
        />
      }
    >
      {item.name}
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
    <>
      <Modal
        opened={groupModal}
        onClose={() => setGroupModal(false)}
        withCloseButton={false}
      >
        <form onSubmit={form.onSubmit(values => createGroup(values))}>
          <TextInput 
            mb="md"
            autoComplete="off"
            label="اسم المجموعة"
            {...form.getInputProps('name')}
          />
          <TextInput 
            label="الاعضاء"   
            autoComplete="off"
            value={searchValue}
            onChange={e => setSeachValue(e.currentTarget.value)}
            error={groupError ? 'يجب اختيار عضوين علي الأقل' : null}
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
          <Group position="right" mt="md">
            <Button variant='default' onClick={closeModal}>
              إلغاء
            </Button>
            <Button type="submit" color="Primary.0" onClick={submitPre}>
              حفظ
            </Button>
          </Group>
        </form>
      </Modal>
      <ActionIcon onClick={() => setGroupModal(true)}>
        <IconPlus />
      </ActionIcon>
    </>
  )
}

export default GroupModal