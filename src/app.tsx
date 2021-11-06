import './app.css'

function seq(end: number) {
  const array = []
  for (let i = 1; i <= end; i++)
    array.push(i)
  return array
}

function App() {
  return (
    <div className="game-container">
      <div className="board">
        {seq(25).map(index => (
          <div className="square-container" key={`square-${index}`}>
            <div className="square">{index}</div>
          </div>
        ))}
      </div>
    </div>
  ) 
}

export default App
