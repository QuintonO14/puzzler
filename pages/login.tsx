import { GetServerSideProps } from 'next';
import { getCsrfToken, getSession, signIn } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

const Login = () => {
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
            username: username.current!.value,
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
            setError('Invalid Username or Password')
        }
    }


    return (
        <div>
            <form onSubmit={loginHandler}>
                <input type="hidden" name="csrfToken"
                value={token ? token : ''} />
                <div>
                    <input 
                    id="username" 
                    name="username" 
                    type="text"
                    minLength={3} 
                    required
                    ref={username}
                    placeholder='Username' />
                </div>
                <div>
                    <input 
                    id="password" 
                    name="password" 
                    type="password"
                    minLength={6}
                    required
                    ref={password} />
                </div>
                <button type='submit'>Submit</button>
            </form>
            {error}
        </div>
    )
}

export default Login

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