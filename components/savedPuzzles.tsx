import Image from 'next/image'
import { MdDeleteForever, MdReplay } from 'react-icons/md'

interface Props {
    puzzles: [],
    replayPuzzle: Function,
    deletePuzzle: Function,
    mobile: boolean
}

const savedPuzzles = ({ puzzles, replayPuzzle, deletePuzzle, mobile } : Props) => {
    
    return (
        <div className="saved-puzzles">
        {puzzles.map((puzzle: any) => {
        return (
            <div key={puzzle.id} className="thumbnail" >
            <Image 
            src={puzzle.image} 
            alt={puzzle.image} 
            layout="fill"
            placeholder='blur'
            blurDataURL={puzzle.image}
            priority
            />
                <div className="difficulties">
                    <div>
                    <span>Easy:{puzzle.easy}</span>
                    <span>Med:{puzzle.medium}</span>
                    <span>Hard:{puzzle.hard}</span>
                    {!mobile && (<span>Extra:{puzzle.extrahard}</span>)}
                    </div>
                    <div className="thumb-controls">
                    <MdReplay onClick={() => replayPuzzle(puzzle.image)} />
                    <MdDeleteForever onClick={() => deletePuzzle(puzzle.id)} />
                    </div>
                </div>
            </div>
        )
        })}
        </div>
    )
}

export default savedPuzzles