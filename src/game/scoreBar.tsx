import './scoreBar.css'

interface ScoreBarProps {
  score: number
  maxScore: number
  fill: string
}

function ScoreBar(props: ScoreBarProps) {
  
  const makeFillStyle = () => {
    const pct = (props.score / props.maxScore) * 100.0
    return {
      width: pct,
      height: "100%",
      backgroundColor: props.fill
    }
  }

  return (
    <div className="score-bar">
      <div style={makeFillStyle()}/>
    </div>  
  )
}

export default ScoreBar
