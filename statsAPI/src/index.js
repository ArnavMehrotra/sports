const mysql = require('mysql');
const express = require('express')

const PORT = 3000

const con = mysql.createConnection({
    host: 'localhost',
    user: 'arnav',
    password: 'password',
    database: 'nba',
    insecureAuth: 'true'
});

con.connect((err) =>{
    if(err){
        console.log('ERROR CONNECTING TO DB')
    }
    else{
        console.log('DB CONNECTION ESTABLISHED')
    }
})

const app = express()
app.set('db', con)

app.get("/getroster", (req, res) =>{
    let q = `SELECT * FROM stats WHERE team_abbr=\'${req.query.team}\' ORDER BY pts DESC;`
    req.app.get('db').query(q, (err, rows) =>{
        if(err) throw err
        const l = []
        for(var i = 0; i < rows.length; i++){
            l.push(rows[i]['full_name'])
        }
        res.send(l)
    })
})

app.get("/getplayerstats", (req, res) =>{
    let q = `SELECT full_name, team_abbr, age, gp, w, l, min, pts, fgm, fga, fgp, 3pm, 3pa, 3pp,
    ftm, fta, ftp, oreb, dreb, reb, ast, tov, stl, blk, pf, fp, dd, td, plus_minus
    FROM stats WHERE player_id=${req.query.id};`
    req.app.get('db').query(q, (err, rows) =>{
        if(err) throw err
        res.send(rows[0])
    })
})



const server = app.listen(PORT, ()=>{
    console.log(`listening on port http://localhost:${PORT}`)
})

const cleanup = () =>{
    server.close(() =>{
        console.log('Shutting down server')
        con.end((err) =>{
            if(err){
                console.log('ERROR ENDING CONNECTION WITH DB')
            }
            else{
                console.log('DB SESSION TERMINATED')
            }
            console.log('bye bye')
            process.exit(0)
        })
    })

    setTimeout(() =>{
        console.error("Could not close connections, forcing shut down")
        process.exit(1)
    }, 30*1000);
}


process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)