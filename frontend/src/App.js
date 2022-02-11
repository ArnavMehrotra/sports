import './App.css';
import React, {useEffect, useState} from 'react';

const App = () => {
  const [player, setPlayer] = useState(null)

  const getData = ()=>{
    fetch('http://localhost:3000/getplayerstatsname', {
      method: 'GET',
      body: JSON.stringify({full_name: "Kevin Durant" }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response =>{
      return response.json()
    })
    .then(data =>{
      console.log(data)
      setPlayer(data)
    })
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>KD Stats</h1>
      {/* <h2>{player.pts} points per game</h2>
      <h2>{player.ast} assists per game</h2>
      <h2>{player.reb} rebounds per game</h2>
      <h2>{parseInt(100*player.fgp)}% from the field</h2>
      <h2>{parseInt(100*player.ftp)}% from the line</h2>
      <h2>{parseInt(100*player.tpp)}% from deep</h2> */}
    </div> 
  )
}

export default App;
