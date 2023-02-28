import { useState } from "react"
import { ChatState } from "@/Context/ChatProvider"
import { Avatar, Badge, Button, Group, Modal, Text } from "@mantine/core"

const GroupViewer = ({groupViewer, setGroupViewer}) => {
  const { user, selectedChat } = ChatState()
  const [groupUsers, setGroupUsers] = useState(selectedChat.users)

  const groupUsersItems = groupUsers.map(item => (
    <Badge
      key={item._id}
      sx={{ paddingLeft: 0 }} 
      size="lg" 
      radius="xl" 
      color={item._id === user._id ? 'green' : 'Primary.0'}
      variant='outline'
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

  return (
    <Modal
      opened={groupViewer}
      onClose={() => setGroupViewer(false)}
      withCloseButton={false}
    >
      <Text>{selectedChat.name}</Text>
      <Group my="sm">
        {groupUsersItems}
      </Group>
      <Button 
        variant='default' 
        onClick={() => setGroupViewer()} 
        fullWidth 
        mt="md"
      >
        إغلاق
      </Button>
    </Modal>
  )
}

export default GroupViewer