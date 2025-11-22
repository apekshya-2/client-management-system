import mysql from 'mysql'

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    user:"root",
    password:"",
    database:"clientms"

})
con.connect(function(err){
    if(err){
        console.log("connection error")
    }else{
        console.log("Connected")
    }
})

export default con;