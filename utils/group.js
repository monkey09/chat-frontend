const uri = 'http://localhost:5000/api/chats/group'

const createGroupReq = async ({request, token}) => {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()
    if (data.message === 'empty fields!')
      throw new Error('يجب إدخال اسم المجموعة والأعضاء')

    if (data.message === 'less than 2!')
      throw new Error('عدد الأعضاء يجب ان لا يقل عن عضوين')

    if (data.message === 'bad request!')
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

    if (res.status === 200)
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

  } catch (e) {
    throw new Error(e.message)
  }
}

const renameGroupReq = async ({request, token}) => {
  try {
    const res = await fetch(uri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()
    if (data.message === 'empty fields!')
      throw new Error('يجب إدخال اسم المجموعة')

    if (data.message === 'bad request!')
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

    if (res.status === 200)
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

  } catch (e) {
    throw new Error(e.message)
  }
}

const addToGroupReq = async ({request, token}) => {
  try {
    const res = await fetch(`${uri}/add`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()

    if (data.message === 'already exist!')
      throw new Error('العضو بالفعل في المجموعة')
    
    if (data.message === 'bad request!')
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

    if (res.status === 200) 
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

  } catch (e) {
    throw new Error(e.message)
  }
}

const removeFromGroupReq = async ({request, token}) => {
  try {
    const res = await fetch(`${uri}/remove`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(request)
    })
    const data = await res.json()

    if (data.message === 'less than 2!')
      throw new Error('المجموعة يجب ان لا تقل عن عضوين وانت')

    if (data.message === 'not found!')
      throw new Error('يجب تحديد العضو')
    
    if (data.message === 'bad request!')
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

    if (data.message === 'admin remove!')
      throw new Error('لا يمكن حذف مدير المجموعة')

    if (res.status === 200) 
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

  } catch (e) {
    throw new Error(e.message)
  }
}

export {
  renameGroupReq,
  addToGroupReq,
  removeFromGroupReq,
  createGroupReq
}