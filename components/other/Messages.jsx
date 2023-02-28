import { ChatState } from '@/Context/ChatProvider'
import { Avatar, Box, createStyles, Group, Text } from '@mantine/core'
import moment from 'moment'
import AudioPlayer from "react-h5-audio-player"
// const AudioPlayer = dynamic(() => import('react-h5-audio-player'), { ssr: false })
const useStyles = createStyles(theme => ({
  rightContainer: {
    justifyContent: 'start'
  },
  leftContainer: {
    justifyContent: 'end'
  },
  recordRight: {
    height: 43,
    fill: '#FFF !important',
  },
  recordLeft: {
    height: 43,
    fill: `${theme.colors.Primary[0]}!important`,
  },
  rightText: {
    fill: '#FFF',
    wordWrap: 'break-word',
    backgroundColor: theme.colors.Primary[0],
    borderRadius: 8,
    position: 'relative',
    color: '#FFF',
    maxWidth:300,
    [theme.fn.smallerThan('xs')]: {
      maxWidth: 220,
    }
  },
  leftText: {
    fill: theme.colorScheme === 'dark' 
    ? '#DDD' 
    : '#333',
    wordWrap: 'break-word',
    background: theme.colorScheme === 'dark' 
    ? '#2C2E33' 
    : '#F1F3F5',
    borderRadius: 8,
    position: 'relative',
    color: theme.colorScheme === 'dark' 
    ? '#DDD' 
    : '#333',
    maxWidth: 300,
    [theme.fn.smallerThan('xs')]: {
      maxWidth: 220,
    }
  },
  rightArrow: {
    width: 10,
    height: 10,
    background: `${theme.colors.Primary[0]} !important`,
    position: 'absolute',
    transform: 'rotate(-20deg)',
    bottom: 3,
    left: -1
  },
  leftArrow: {
    width: 10,
    height: 10,
    background: theme.colorScheme === 'dark' 
    ? '#2C2E33' 
    : '#F1F3F5',
    position: 'absolute',
    transform: 'rotate(20deg)',
    bottom: 3,
    right: -1
  },
  rightTime: {
    float: 'right'
  },
  leftTime: {
    float: 'right'
  }
}))

const Messages = ({messages}) => {
  const { classes } = useStyles()
  const {user, selectedChat} = ChatState()

  const sameSender = (i, message) => 
    i < messages.length - 1 && messages[i + 1].sender._id !== message.sender._id

  const lastSender = (i) => 
    i === messages.length - 1

  const RightMessage = ({message, i}) => {
    return (
      <Group 
        align="end" 
        mb={(sameSender(i, message) || lastSender(i)) ? 'sm' : 2}
        className={classes.rightContainer}
      >
        {(sameSender(i, message) || lastSender(i)) &&
          (
            <Avatar 
              radius="xl" 
              size="md" 
              src={message.sender.pic}
            />
          )
        }
        <Box 
          className={classes.rightText} 
          px="md" 
          pb={0} 
          pt={2}
          ml={(sameSender(i, message) || lastSender(i)) ? 0 : 55}
        >
          {(sameSender(i, message) || lastSender(i)) && 
            <div className={classes.rightArrow}></div>
          }
          {selectedChat.multi &&
            <Text fz="xs" color="#DDD" fw='bold'>{message.sender.name}</Text>
          }
          {message.record ? (
            <Box className={classes.recordRight}>
              <AudioPlayer
                src={`data:audio/webm;base64,${message.content}`}
              />
            </Box>
            ) : (
            <Text>{message.content}</Text>
          )}
          <Text size="sm" className={classes.rightTime} italic color="#DDD">
            3:00 مساء
          </Text>
        </Box>
      </Group>
    )
  }

  const LeftMessage = ({message, i}) => {
    return (
      <Group 
        align="end" 
        mb={(sameSender(i, message) || lastSender(i)) ? 'sm' : 2}
        mr={8} 
        className={classes.leftContainer}
      >
        <Box className={classes.leftText} px="md" pb={0} pt={2}>
          {(sameSender(i, message) || lastSender(i)) && 
            <div className={classes.leftArrow}></div>
          }
          {message.record ? (
            <Box className={classes.recordLeft}>
              <AudioPlayer
                src={`data:audio/webm;base64,${message.content}`}
              />
            </Box>
            ) : (
            <Text>{message.content}</Text>
          )}
          <Text size="sm" className={classes.leftTime} italic color="dimmed">
            { moment(message.createdAt).format('h:mm A')}
          </Text>
        </Box>
      </Group>
    )
  }

  return messages.map((message, i) => {
    if (message.sender._id == user._id) {
      return (
        <LeftMessage key={message._id} i={i} message={message} />
      )
    } else {
      return (
        <RightMessage key={message._id} i={i} message={message} />
      )
    }
  })
}

export default Messages