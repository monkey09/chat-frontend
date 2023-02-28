import { Image, Modal, Text } from '@mantine/core'

const UserHandler = ({user, userModal, setUserModal}) => {
  return (
    <Modal
      opened={userModal}
      onClose={() => setUserModal(false)}
      withCloseButton={false}
      sx={{textAlign: 'center'}}
    >
      <Image src={user.pic} 
        mx="auto" 
        mb="md" 
        width={100} 
        height={100} 
      />
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
    </Modal>
  )
}

export default UserHandler