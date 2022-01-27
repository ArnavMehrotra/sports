import './App.css';
import React, {useEffect, useState} from 'react';

const App = (props) => {
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    const getData = async ()=>{
      const response = await fetch('http://localhost:3000/getplayerstatsname', {
        method: 'GET',
        body: JSON.stringify({full_name: "Kevin Durant" }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      setPlayer(data) 
    }
    getData();
  }, [setPlayer]);

  return (
    <div>
      <h1>KD Stats</h1>
      <h2>{player.pts} points per game</h2>
      <h2>{player.ast} assists per game</h2>
      <h2>{player.reb} rebounds per game</h2>
      <h2>{parseInt(100*player.fgp)}% from the field</h2>
      <h2>{parseInt(100*player.ftp)}% from the line</h2>
      <h2>{parseInt(100*player.tpp)}% from deep</h2>
    </div> 
  )
}

export default App;
