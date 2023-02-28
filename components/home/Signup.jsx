import { signupReq } from '@/utils/user'
import { IconCheck, IconInfoCircle } from "@tabler/icons"
import { hasLength, isEmail, useForm } from "@mantine/form"
import { Box, Button, PasswordInput, TextInput } from "@mantine/core"
import { showNotification, updateNotification } from "@mantine/notifications"

const Signup = () => {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: value => !!value ? null : 'يجب إدخال الإسم',
      email: isEmail('البريد غير صحيح'),
      password: hasLength({min: 3, max: 8},
      'كلمة المرور يجب ان تتكون من 3 إلي 8 احرف'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'كلمة المرور غير متطابقة' : null,
    }
  })

  const submitted = async values => {
    const request = {
      name: values.name,
      email: values.email,
      password: values.password,
      pic: values.pic
    }
    showNotification({
      id: 'signup-user',
      loading: true,
      title: 'جاري ارسال البينات',
      message: 'سيتم إرسال بيانات حسابك',
      autoClose: false,
      disallowClose: true
    })
    signupReq({request}).then(data => {
      updateNotification({
        id: 'signup-user',
        color: 'teal',
        title: 'تم',
        message: 'تم تسجيل حسابك بنجاح',
        icon: <IconCheck size={16} />,
        autoClose: 3000
      })
      form.reset()
    })
    .catch(e => {
      updateNotification({
        id: 'signup-user',
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
      <form 
        onSubmit={
          form.onSubmit(values => submitted(values))
        }
      >
      <TextInput
          mb="sm"
          withAsterisk
          autoComplete="off"
          label="الإسم"
          placeholder="name"
          {...form.getInputProps('name')}
        />
        <TextInput
          mb="sm"
          withAsterisk
          autoComplete="off"
          label="البريد الإلكتروني"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mb="sm"
          withAsterisk
          autoComplete="off"
          label="كلمة المرور"
          placeholder="password"
          {...form.getInputProps('password')}
        />
        <PasswordInput
          mb="md"
          autoComplete="off"
          withAsterisk
          label="تأكيد كلمة المرور"
          placeholder="confirm password"
          {...form.getInputProps('confirmPassword')}
        />
        {/* <FileInput
          mb="lg"
          placeholder="choose a file"
          label="صورة شخصية"
          accept="image/png,image/jpeg,image/jpg"
          {...form.getInputProps('pic')}
        /> */}
        <Button 
          type="submit" 
          variant="light" 
          color="green" 
          fullWidth
        >
          تسجيل
        </Button>
      </form>
    </Box>
  )
}

export default Signup