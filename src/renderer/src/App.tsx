import { DrawLine } from './utils/svg'

import { useRef, useState, useEffect, useCallback } from 'react'

export type BoardType = DrawLine

function App(): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [board, setBoard] = useState<BoardType | null>(null)

  useEffect(() => {
    let currentBoard: BoardType | null = null
    if (svgRef.current) {
      currentBoard = new DrawLine(svgRef.current)
    }

    if (currentBoard) {
      setBoard(currentBoard)
    }

    return (): void => {
      currentBoard?.destroy()
    }
  }, [])

  const clear = useCallback(() => {
    if (svgRef.current) {
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild)
      }
    }
  }, [svgRef.current])

  return (
    <div className="container">
      <button className="clear-btn" onClick={clear}>
        Clear
      </button>
      <svg ref={svgRef} fill={board?.fill} stroke={board?.color} strokeWidth={board?.weight}></svg>
    </div>
  )
}

export default App
