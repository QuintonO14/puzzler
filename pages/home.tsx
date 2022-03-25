import { useState } from "react"
import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css'
import { GetServerSideProps } from "next"
import { signOut } from "next-auth/react"
import { getSession } from "next-auth/react"
import prisma from "../lib/prisma"
import useMediaQuery from "../hooks/useMediaQuery"
import Head from "next/head"
import Container from "../components/container"
import { FaBars } from 'react-icons/fa'

interface Props {
  puzzles: any,
  user: HTMLElement,
  session: {}
}

const Home = ({puzzles, user} : Props) => {
  const [showingPuzzle, setShow] = useState(true)
  const [toggled, setToggled] = useState(false)
  const [menuItem, setItem] = useState('My Puzzles')
  const [message, setMessage] = useState('')
  const mobileScreen = useMediaQuery(1000)

  const toggle = () => {
    setItem(menuItem == 'My Puzzles' ? 'Creator' : 'My Puzzles')
    setShow(!showingPuzzle)
    setToggled(false)
  }
   
  return (
    <div className="App">
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="utf-8" />
        <title>Puzzler | Puzzles</title>
        <meta name="application-name" content="Puzzler" />
        <meta name="description" content="Create fun interactive puzzles from your own uploaded images" /> 
      </Head>
       <div className="main">
       <div className="header">
          <div className="logo">
            <img src="/big-logo.png" alt="logo"/>
          </div>
            <div className="menu" style={toggled == true ? {display: 'block'} : undefined}>
              {mobileScreen && (
              <div onClick={toggle}>
                <span>{menuItem}</span>
              </div>
              )}
              <div onClick={() => signOut()}>
                <span>Logout {Object.values(user)[0]}</span>
              </div>
            </div>
            <div className="message">{message}</div>
            <FaBars className="burger" onClick={() => setToggled(!toggled)} />
       </div>
        <div className="layout">
        <Container 
        showingPuzzle={showingPuzzle} 
        puzzles={puzzles} 
        user={user}
        setMessage={setMessage}
        setShow={setShow}       
        />
        </div>
       </div>
       <h2 className="rotateDevice">Please Rotate Your Device</h2>
    </div>
  );
}

export default Home

export const getServerSideProps: GetServerSideProps = async(context) => {
  let session: any = await getSession(context)

  if(!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.token.sub
    },
    select: {
      username: true,
      id: true
    }
  })


  const puzzles = await prisma.puzzle.findMany({
    where: {
      userId: session.token.sub
    }
  })
  
  return {
    props: {
      puzzles: puzzles,
      user: user,
    }
  }

}

