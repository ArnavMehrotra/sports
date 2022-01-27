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
app.use(express.json())
app.set('db', con)

app.get("/getroster", (req, res) =>{
    console.log(`getroster ${req.body.team}`)
    let q = `SELECT full_name, pts, ast, reb, player_id FROM stats WHERE team_abbr=\'${req.body.team}\' ORDER BY pts DESC;`
    req.app.get('db').query(q, (err, rows) =>{
        if(err) throw err
        const l = []
        for(var i = 0; i < rows.length; i++){
            l.push(rows[i]['full_name'])
        }
        res.json(l)
    })
})

app.get("/getplayerstatsid", (req, res) =>{
    console.log(`getplayerstatsid ${req.body.id}`)
    let q = `SELECT full_name, team_abbr, age, gp, w, l, min, pts, fgm, fga, fgp, tpm, tpa, tpp,
    ftm, fta, ftp, oreb, dreb, reb, ast, tov, stl, blk, pf, fp, dd, td, plus_minus
    FROM stats WHERE player_id=${req.body.id};`
    req.app.get('db').query(q, (err, rows) =>{
        if(err) throw err
        res.json(rows[0])
    })
})

app.get("/getplayerstatsname", (req, res) =>{
    console.log(`getplayerstatsname ${req.body.name}`)
    let q = `SELECT full_name, team_abbr, age, gp, w, l, min, pts, fgm, fga, fgp, tpm, tpa, tpp,
    ftm, fta, ftp, oreb, dreb, reb, ast, tov, stl, blk, pf, fp, dd, td, plus_minus
    FROM stats WHERE full_name=\'${req.body.name}\';`
    req.app.get('db').query(q, (err, rows) =>{
        if(err) throw err
        res.json(rows[0])
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