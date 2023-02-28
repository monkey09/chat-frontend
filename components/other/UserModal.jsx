import { 
  ActionIcon,
  Image,
  Menu,
  Modal, 
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import { 
  IconDotsVertical,
  IconLogout,
  IconMoonStars,
  IconSun,
  IconUserCircle
} from '@tabler/icons'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { ChatState } from '@/Context/ChatProvider'

const UserModal = () => {
  const router = useRouter()
  const [userModal, setUserModal] = useState(false)
  const { user, setUser, setChats, setSelectedChat } = ChatState()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const logout = () => {
    router.push('/')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    setUser(null)
    setChats([])
    setSelectedChat(null)
  }

  return (
    <>
      <Modal
        opened={userModal}
        onClose={() => setUserModal(false)}
        withCloseButton={false}
        sx={{textAlign: 'center'}}
      >
        <Image src={user?.pic} 
          mx="auto" 
          mb="md" 
          width={100} 
          height={100} 
        />
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>
      </Modal>
      <Menu>
        <Menu.Target>
          <ActionIcon>
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item 
            icon={<IconUserCircle stroke={1.4} size={14} />}
            onClick={() => setUserModal(true)}
          >
            الملف الشخصي
          </Menu.Item>
          <Menu.Item 
            icon={
              colorScheme === 'dark'
              ? <IconSun stroke={1.4} size={14} />
              : <IconMoonStars stroke={1.4} size={14} />
            }
            onClick={() => toggleColorScheme()}
          >
            المظهر
          </Menu.Item>
          <Menu.Item 
            icon={<IconLogout stroke={1.4} size={14} />}
            onClick={logout}
          >
            تسجيل خروج
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}

export default UserModal