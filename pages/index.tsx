import type { GetServerSideProps, NextPage } from 'next'
import { signIn, getSession} from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import { getCsrfToken } from 'next-auth/react'
import Head from 'next/head'

const Home: NextPage = () => {
  const [token, setToken] = useState<any>()
  const username = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  

  const getToken = async() => {
    let t = await getCsrfToken()
    setToken(t)
  }
  useEffect(() => {
      getToken()
  }, [])



  const loginHandler = async(e: any) => {
      e.preventDefault()
      const user = {
          username: username.current!.value.toLowerCase(),
          password: password.current!.value
      }
      const validate = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(user)
      }).then((res) => {
          return res.json()
      }).then((data) => {
          return data
      })
      if(!validate.invalid) {
          await signIn('credentials',
      { 
          redirect: true,
          username: validate.username,
          password: validate.password
      })
      } else {
          setError('Incorrect Password')
          setTimeout(() => {
            setError('')
          }, 3000)
      }
  }

  return (
      <div className="login">
           <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width, shrink-to-fit=no" />
          <meta charSet="utf-8" />
          <title>Puzzler</title>
          <meta name="application-name" content="Puzzler" />
          <meta name="description" content="Create fun interactive puzzles from your own uploaded images" /> 
          </Head>
          <img src='/big-logo.png' alt="logo" className='big-logo' />
          <form onSubmit={loginHandler} autoComplete="off" className='form'>
              <p style={{color: 'red'}}>{error}</p>
              <h1>Login | Register</h1>
              <input type="hidden" name="csrfToken"
              value={token ? token : ''} />
                 <div className="form-group">
                 <input 
                  id="username" 
                  name="username" 
                  type="text"
                  minLength={6} 
                  required
                  ref={username}
                  placeholder='Username' />
                  <input 
                  id="password" 
                  name="password" 
                  type="password"
                  placeholder="Password"
                  minLength={6}
                  required
                  ref={password} />
                  <button type='submit'>Enter</button>
                </div>
          </form>
      </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async(context) => {
    const session: any = await getSession(context)
    if(session) {
      return {
        redirect: {
          destination: '/home',
          permanent: false
        }
      }
    }


    return {
      props: {
        null: null
      }
    }
 
}