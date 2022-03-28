import useMediaQuery from "../hooks/useMediaQuery"
import SavedPuzzles from "./savedPuzzles"
import Creator from "./creator"
import { useState } from 'react'
import { useS3Upload } from "next-s3-upload"

interface Puzzles {
  id: string,
  userId: string,
  image: string,
  easy: number,
  medium: number,
  hard: number,
  extrahard: number
}

interface Props {
    showingPuzzle: boolean,
    puzzles: Puzzles[],
    user: {},
    setShow: Function,
    setMessage: any,
}

const Container = ({puzzles, setShow, showingPuzzle, user, setMessage} : Props) => {
    const mobileScreen = useMediaQuery(1000)
    const [image, setImage] = useState<any>()
    const [tiles, setTiles] = useState<number>(0)
    const [uploaded, setUploaded] = useState(false)
    const [imageUrl, setImageUrl] = useState<any>();
    const [finished, setFinished] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userPuzzles, setPuzzles] = useState<any>(puzzles)
    const breakpoint = useMediaQuery(700)
    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload()


    const deletePuzzle = async(id: string) => {
      await fetch(`/api/puzzle/${id}`, {
        method: 'DELETE'
      })
      setPuzzles(userPuzzles.filter((puzzle: any) => puzzle.id != id))
    }

    const fileHandler = async(file: any) => {
        setLoading(true)
        const uploadedImg = URL.createObjectURL(file)
        let { url } = await uploadToS3(file);
        console.log(uploadedImg)
        console.log(url)
        setUploaded(true)
        setLoading(false)
        setImage(uploadedImg)
        setImageUrl(url)
        setTiles(0)
    }

    const replayPuzzle = (image: string) => {
      setUploaded(true)
      setImageUrl(image)
      setShow(true)
    }
    
    const reset = () => {
      setTiles(0)
      setUploaded(false)
      setImageUrl("")
    }
    
    const savePuzzle = async() => {
        const body = {
          userId: Object.values(user)[1],
          image: imageUrl,
          easy: tiles == 4 ? 1 : 0,
          medium: tiles == 6 ? 1 : 0,
          hard: tiles == 8 ? 1 : 0,
          extrahard: tiles == 10 ? 1 : 0,
        }
        const p = await fetch('/api/puzzle/puzzle', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type' : 'application/json'
          }
          }).then((res) => {
            return res.json()
          }).then((data) => {
            return data
          })
         
        if(!p.updated) {
          delete p.created.userId
          setPuzzles(userPuzzles.concat(p.created))
        } else {
          delete p.updated.userId
          const i = userPuzzles.findIndex((el: any) => el.id === p.updated.id)
          if(i !== -1) {
            let puzzle = [...userPuzzles];
            puzzle[i] = p.updated
            setPuzzles(puzzle)
          }
        }
        setMessage('Puzzle Saved!')
        setTimeout(() => {
          setMessage('')
        }, 3000)
        setUploaded(false)
        setImageUrl("")
        setTiles(0)
        setFinished(false)
      }
     
    return (
        <>
          {!uploaded && (
            <button className="create" onClick={openFileDialog}>
              New Puzzle
            </button>)}
          <div className="container">
            {!mobileScreen ? (
              <>
                <Creator 
                breakpoint={breakpoint} 
                fileHandler={fileHandler}
                FileInput={FileInput}
                finished={finished}
                imageUrl={imageUrl}
                loading={loading}
                reset={reset}
                savePuzzle={savePuzzle}
                setFinished={setFinished}
                setTiles={setTiles} 
                tiles={tiles} 
                uploaded={uploaded} />

                <SavedPuzzles 
                deletePuzzle={deletePuzzle} 
                puzzles={userPuzzles}
                mobile={mobileScreen} 
                replayPuzzle={replayPuzzle} /> 
            </>
        ) : (
            <>
              {showingPuzzle ? (
                <Creator 
                breakpoint={breakpoint} 
                fileHandler={fileHandler}
                FileInput={FileInput}
                finished={finished}
                imageUrl={imageUrl}
                loading={loading}
                reset={reset}
                savePuzzle={savePuzzle}
                setFinished={setFinished}
                setTiles={setTiles} 
                tiles={tiles} 
                uploaded={uploaded} />
                ) : (
                <SavedPuzzles 
                deletePuzzle={deletePuzzle}
                mobile={mobileScreen}
                puzzles={userPuzzles} 
                replayPuzzle={replayPuzzle} /> 
                )}
            </>   
        )}
          </div>
        </>
    )
}

export default Container