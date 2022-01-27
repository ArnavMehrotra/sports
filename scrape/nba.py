import requests
import mysql.connector

#magic headers to get around Silver's goons
headers  = {
    'Connection': 'keep-alive',
    'Accept': 'application/json, text/plain, */*',
    'x-nba-stats-token': 'true',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
    'x-nba-stats-origin': 'stats',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Referer': 'https://stats.nba.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
}

#nba stats api endpoint
player_info_url = "https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2021-22&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight="

response = requests.get(url=player_info_url, headers= headers).json()

cnx = mysql.connector.connect(user='arnav', password='password', host='localhost', database='nba')
cursor = cnx.cursor()

dt = "DROP TABLE IF EXISTS `stats`;"
cursor.execute(dt)

ct = (
    "CREATE TABLE `stats` ("
    "   `player_id` INT PRIMARY KEY,"
    "   `full_name` VARCHAR(64) NOT NULL,"
    "   `team_id` INT NOT NULL,"
    "   `team_abbr` VARCHAR(3) NOT NULL,"
    "   `age` FLOAT NOT NULL,"
    "   `gp` INT NOT NULL,"
    "   `w` INT NOT NULL,"
    "   `l` INT NOT NULL,"
    "   `min` FLOAT NOT NULL,"
    "   `pts` FLOAT NOT NULL,"
    "   `fgm` FLOAT NOT NULL,"
    "   `fga` FLOAT NOT NULL,"
    "   `fgp` FLOAT NOT NULL,"
    "   `tpm` FLOAT NOT NULL,"
    "   `tpa` FLOAT NOT NULL,"
    "   `tpp` FLOAT NOT NULL,"
    "   `ftm` FLOAT NOT NULL,"
    "   `fta` FLOAT NOT NULL,"
    "   `ftp` FLOAT NOT NULL,"
    "   `oreb` FLOAT NOT NULL,"
    "   `dreb` FLOAT NOT NULL,"
    "   `reb` FLOAT NOT NULL,"
    "   `ast` FLOAT NOT NULL,"
    "   `tov` FLOAT NOT NULL,"
    "   `stl` FLOAT NOT NULL,"
    "   `blk` FLOAT NOT NULL,"
    "   `pf` FLOAT NOT NULL,"
    "   `fp` FLOAT NOT NULL,"
    "   `dd` INT NOT NULL,"
    "   `td` INT NOT NULL,"
    "   `plus_minus` FLOAT NOT NULL);"
)

cursor.execute(ct)

player_info = response['resultSets'][0]['rowSet']
for row in player_info:
    print("inserting " + row[1] + " into db")
    ins = (
        "INSERT INTO stats "
        "(player_id, full_name, team_id, team_abbr, age, gp, w, l, min, "
        "fgm, fga, fgp, tpm, tpa, tpp, ftm, fta, ftp, oreb, dreb, reb, "
        "ast, tov, stl, blk, pf, pts, plus_minus, fp, dd, td) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, "
        "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    )
    data = (row[0:2] + row[3:9]+ row[10:27] + row[28:29] + row[30:35])

    cursor.execute(ins, data)

cnx.commit()
cursor.close()
cnx.close()