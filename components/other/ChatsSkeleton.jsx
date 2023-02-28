import { Box, Group, Skeleton } from '@mantine/core'

const ChatsSkeleton = () => {
  return (
    <>
      <Group my={5} p={7}>
        <Skeleton width={50} height={50} radius={'50%'} />
        <Box>
          <Skeleton height={15} mb={10} radius="md" width={100} />
          <Skeleton height={10} radius="md" width={150} />
        </Box>
      </Group>
      <Group my={5} p={7}>
        <Skeleton width={50} height={50} radius={'50%'} />
        <Box>
          <Skeleton height={15} mb={10} radius="md" width={100} />
          <Skeleton height={10} radius="md" width={150} />
        </Box>
      </Group>
    </>
  )
}

export default ChatsSkeleton