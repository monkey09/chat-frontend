const uri = 'http://localhost:5000/api/users'

const signinReq = async ({request}) => {
  try {
    const res = await fetch(`${uri}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()

    if (data.message === 'empty fields!')
      throw new Error('يرجي ملئ البيانات')

    if (data.message === 'not found!')
      throw new Error('الحساب غير موجود')
    
    if (res.status === 200) 
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')
  } catch (e) {
    throw new Error(e.message)
  }
}

const signupReq = async ({request}) => {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()

    if (data.message === 'empty fields!')
      throw new Error('يرجي ملئ البيانات')

    if (data.message === 'user exists!') 
      throw new Error('يرجي ادخال بريد اخر')

    if (data.message === 'creation failed!')
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')
    
    if (res.status === 201) 
      return data.message
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')
  } catch (e) {
    throw new Error(e.message)
  }
}

const getSearchReq = async ({search, token}) => {
  const res = await fetch(`${uri}?search=${search}`, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  return data
}

export {
  getSearchReq,
  signinReq,
  signupReq
}

