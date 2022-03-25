import React from "react"
import { JigsawPuzzle } from 'react-jigsaw-puzzle'
import Loader from "./loader"

interface Props {
    breakpoint: boolean,
    fileHandler: Function,
    FileInput: Function,
    finished: boolean,
    imageUrl: string,
    loading: boolean,
    reset: any,
    savePuzzle: any,
    setFinished: Function,
    setTiles: Function,
    tiles: number,
    uploaded: boolean,
}

const Creator = ({breakpoint, fileHandler, FileInput, finished, imageUrl, loading, reset, savePuzzle,
    setFinished, setTiles, tiles, uploaded} : Props) => {
    const handler = (event: any) => {
        const value = event.target.value
        setTiles(value)
    }

    return (
        <div className="puzzle-creator">
        <FileInput 
        type="file"
        onChange={fileHandler} 
        name="file" 
        accept='.jpeg, .png, .jpg'
        />
        <div className="puzzle" style={!uploaded ? {display: 'flex'} : {display: 'block'}}>
            {uploaded ? (
                <JigsawPuzzle
                imageSrc={imageUrl}
                onSolved={() => setFinished(true)}
                rows={tiles ? tiles : 1}
                columns={tiles ? tiles : 1}
                />
            ) : (
                <>
                    {loading && ( <Loader /> )}
                    <img src="/default.png" alt="default_image" />
                </>
            )}
        </div>
        <div className="options">
            <select
            disabled={!uploaded} 
            onChange={handler}
            defaultValue={'DEFAULT'} 
            className="piece-selection">
                <option disabled hidden value="DEFAULT">Select Mode</option>
                <option value={4}>Easy</option>
                <option value={6}>Medium</option>
                <option value={8}>Hard</option>
                {!breakpoint && (<option value={10}>Extra Hard</option>)}
            </select>
            <div>
                <button className="buttons" onClick={savePuzzle}>Save</button>
                <button className="buttons" onClick={reset} disabled={!uploaded}>Reset</button>
            </div>
        </div>
        </div>
    )
}

export default Creator