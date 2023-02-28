import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Signin from "@/components/home/Signin"
import Signup from "@/components/home/Signup"
import { Box, Card, createStyles, Loader, Tabs } from "@mantine/core"

const useStyles = createStyles((theme) => ({
  card: {
    width: 400
  },
  placeholder: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const Home = () => {
  const { classes } = useStyles()
  const router = useRouter()
  const [allow, setAllow] = useState(false)
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      setAllow(false)
      router.push('/chat')
    } else {
      setAllow(true)
      router.push('/')
    }
  }, [])
  if (allow) {
    return (
      <Box pt={150}>
        <Card
          className={classes.card}
          mx="auto"
          p="md"
          withBorder
          radius="md"
        >
          <Tabs defaultValue="first">
            <Tabs.List grow>
              <Tabs.Tab value="first">تسجيل دخول</Tabs.Tab>
              <Tabs.Tab value="second">إنشاء حساب</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="first">
              <Signin />
            </Tabs.Panel>
            <Tabs.Panel value="second">
              <Signup />
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Box>
    )
  } else {
    return (
      <Box className={classes.placeholder}>
        <Loader color="Primary.0" variant="dots" />
      </Box>
    )
  }
}

export default Home