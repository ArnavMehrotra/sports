import fetch from 'node-fetch'


fetch('http://localhost:3000/getplayerstatsname', {
    method: 'GET',
    body: JSON.stringify({full_name: "Kevin Durant" }),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response =>{
    console.log(response.json())
})

