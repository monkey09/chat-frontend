import { useRouter } from "next/router"
import { signinReq } from "@/utils/user"
import { ChatState } from "@/Context/ChatProvider"
import { IconCheck, IconInfoCircle } from "@tabler/icons"
import { isEmail, isNotEmpty, useForm } from "@mantine/form"
import { Box, Button, PasswordInput, TextInput } from "@mantine/core"
import { showNotification, updateNotification } from "@mantine/notifications"

const Signin = () => {
  const {setUser} = ChatState()
  const router = useRouter()
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: isEmail('البريد غير صحيح'),
      password: isNotEmpty('يجب إدخال كلمة المرور')
    }
  })

  const submitted = async values => {
    const request = {
      email: values.email, 
      password: values.password
    }
    showNotification({
      id: 'signin-user',
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات تسجيل الدخول',
      autoClose: false,
      disallowClose: true
    })
    signinReq({request}).then(data => {
      updateNotification({
        id: 'signin-user',
        color: 'teal',
        title: 'تم',
        message: 'لقد تم تسجيل دخولك بنجاح',
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
      form.reset()
      const userInfo = JSON.stringify(data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', userInfo)
      setUser(data)
      router.push('/chat')
    }).catch(e => {
      updateNotification({
        id: 'signin-user',
        color: 'red',
        title: 'فشل',
        message: `${e.message}`,
        icon: <IconInfoCircle size={16} />,
        autoClose: 3000
      })
    })
  }

  return (
    <Box my="md">
      <form onSubmit={form.onSubmit(values => submitted(values))}>
        <TextInput
          mb="sm"
          autoComplete="off"
          withAsterisk
          label="البريد الإلكتروني"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mb="lg"
          withAsterisk
          autoComplete="off"
          label="كلمة المرور"
          placeholder="password"
          {...form.getInputProps('password')}
        />
        <Button type="submit" variant="light" fullWidth>
          تسجيل
        </Button>
      </form>
    </Box>
  )
}

export default Signin