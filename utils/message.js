const uri = 'http://localhost:5000/api/messages'

const sendRecordReq = async ({request, token}) => {
  try {
    const res = await fetch(`${uri}/record`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      body: request
    })
    const data = await res.json()
    if (data.message === 'empty fields!')
      throw new Error('يجب ارسال محتوي')

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

const sendMessageReq = async ({request, token}) => {
  try {
    if (request.content.trim() == '') 
    throw new Error('يجب ارسال محتوي')

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
      throw new Error('يجب ارسال محتوي')

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

const getMessagesReq = async ({request, token}) => {
  try {
    const res = await fetch(`${uri}/${request._id}`, {
      headers: {
        authorization: `Bearer ${token}`
      },
    })
    const data = await res.json()

    if (res.status === 200)
      return data
    else
      throw new Error('حدث خطأ ما يرجي المحاولة مرة اخري')

  } catch (e) {
    throw new Error(e.message)
  }
}

export {
  sendMessageReq,
  getMessagesReq,
  sendRecordReq
}