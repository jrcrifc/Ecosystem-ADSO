import fetch from 'node-fetch'

const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:8000'

async function register(email, password, userType = 'aprendiz'){
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, password, userType })
  })
  const data = await res.json()
  return { status: res.status, data }
}

async function login(email, password){
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail: email, password })
  })
  const data = await res.json()
  return { status: res.status, data }
}

async function listUsers(token){
  const res = await fetch(`${API_URL}/api/users/list`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  return { status: res.status, data }
}

;(async ()=>{
  try{
    console.log('API_URL=', API_URL)
    // attempt to clean user table before starting tests (requires development mode on server)
    try {
      const resReset = await fetch(`${API_URL}/api/users/reset`, { method: 'POST' })
      const dataReset = await resReset.json()
      console.log('Reset response', resReset.status, dataReset)
    } catch(e) {
      console.warn('Could not reset users table (might not be in dev mode):', e.message)
    }
    const testEmail = `testuser_${Date.now()}@example.com`
    const testPassword = 'Test1234'

    console.log('\n1) Registrando usuario:', testEmail)
    const reg = await register(testEmail, testPassword, 'gestor')
    console.log('Registro status:', reg.status)
    console.log('Registro body:', reg.data)
    if (reg.data && reg.data.token) {
      console.log('Token obtenido tras registro:', reg.data.token.slice(0, 20) + '...')
    }

    console.log('\n2) Intentando login con el usuario registrado')
    const lg = await login(testEmail, testPassword)
    console.log('Login status:', lg.status)
    console.log('Login body:', lg.data)

    if (lg.data && lg.data.token){
      const token = lg.data.token
      console.log('\n3) Solicitando lista de usuarios con token')
      const list = await listUsers(token)
      console.log('List status:', list.status)
      console.log('List body:', list.data)
    } else {
      console.log('\nNo se obtuvo token desde login; revisa la respuesta anterior')
    }
  }catch(err){
    console.error('Error en prueba:', err)
  }
})()
