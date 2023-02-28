import { 
  ActionIcon,
  Box, 
  Card, 
  createStyles, 
  Group, 
  Loader, 
  ScrollArea, 
  TextInput, 
  Title
} from '@mantine/core'
import { 
  IconSearch, 
  IconX
} from '@tabler/icons'
import { 
  useDebouncedValue, 
  useMediaQuery 
} from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { getSearchReq } from '@/utils/user'
import { ChatState } from '@/Context/ChatProvider'
import UserModal from '@/components/other/UserModal'
import ChatsList from '@/components/other/ChatsList'
import SearchList from '@/components/other/SearchList'
import GroupModal from '@/components/other/GroupModal'
import ChatsSkeleton from '@/components/other/ChatsSkeleton'

let RHS_WIDTH = '25%'

const useStyles = createStyles(theme => ({
  card: {
    borderRadius: 0,
    height: '100vh',
    zIndex: 2,
    position: 'relative',
    backgroundColor: theme.colorScheme === 'dark' 
    ? '#1A1B1E' 
    : '#FFF',
    borderRight: '1px solid',
    borderColor: theme.colorScheme === 'dark' 
    ? '#444' 
    : '#DDD',
  },
  searchList: {
    height: 300,
    borderBottom: '1px solid',
    borderColor: theme.colorScheme === 'dark' 
    ? '#444' 
    : '#DDD',
  },
  searchLoaderContainer: {
    height: 300,
    borderBottom: '1px solid',
    borderColor: theme.colorScheme === 'dark' 
    ? '#444' 
    : '#DDD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const ChatRHS = ({setOpened, opened, chatsLoader, triggerChats}) => {
  const { classes } = useStyles()
  const { user, chats } = ChatState()
  const [search, setSearch] = useState('')
  const [debounced] = useDebouncedValue(search, 200)
  const [searchResult, setSearchResult] = useState([])
  const [searchLoader, setSearchLoader] = useState(false)

  const largeScreen = useMediaQuery('(min-width: 992px)')
  if (largeScreen) RHS_WIDTH = '25%'
  else RHS_WIDTH = '100vw'
  
  useEffect(() => {
    if (search.trim() !== '') {
      setSearchResult([]) 
      setSearchLoader(true)
      getSearchReq({search, token: user.token}).then(data => {
        setSearchLoader(false)
        setSearchResult(data)
      })
    } else {
      setSearchResult([]) 
      setSearchLoader(false)
    }
  }, [debounced])

  useEffect(() => {
    if (user) triggerChats()
  }, [])

  return (
    <Card className={classes.card} px={5} sx={{width: RHS_WIDTH}}>
      <Group position='apart' mb="xs">
        <Group>
          {!largeScreen && 
            <ActionIcon 
              onClick={() => setOpened(false)}
            >
              <IconX />
            </ActionIcon>
          }
          <Title order={2} mt={10}>المحادثات</Title>
        </Group>
        <Group>
          <GroupModal triggerChats={triggerChats} />
          <UserModal />
        </Group>
      </Group>
      <TextInput 
        variant='filled'
        autoComplete="off"
        placeholder='البحث...'
        className={classes.search}
        value={search}
        onChange={e => setSearch(e.currentTarget.value)}
        radius={8}
        rightSection={<IconSearch size={16} />}
      />
      {searchLoader && 
        <Box className={classes.searchLoaderContainer}>
          <Loader color="Primary.0" size="sm" />
        </Box>
      }
      {searchResult.length > 0 && 
        <Box className={classes.searchList}>
          <ScrollArea style={{height: '100%'}} scrollbarSize={5}>
            <SearchList 
              searchResult={searchResult} 
              triggerChats={triggerChats}
            />
          </ScrollArea>
        </Box>
      }
      {chats.length > 0 && 
        <ScrollArea
          scrollbarSize={5} 
          style={{ 
            height: searchResult.length > 0 || searchLoader 
            ? 'calc(100% - 375px)' 
            : 'calc(100% - 75px)'
          }}
        >
          <ChatsList chats={chats} />
        </ScrollArea>
      }
      {chatsLoader && <ChatsSkeleton />}
    </Card>
  )
}

export default ChatRHS