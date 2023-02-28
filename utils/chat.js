const uri = 'http://localhost:5000/api/chats'

const getChatsReq = async ({token}) => {
  const res = await fetch(uri, {
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  const data = await res.json()
  return data
}

const accessChatReq = async ({result, token}) => {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({id: result._id})
    })
    const data = await res.json()
    if (data.message === 'bad request!' || data.message === 'no id!') {
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')
    }
    if (res.status === 200) {
      return data
    } else {
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export {
  getChatsReq,
  accessChatReq
}