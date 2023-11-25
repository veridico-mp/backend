const express = require('express'); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html
const cors = require('cors');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: "localhost", 
  user: "root", 
  password: "326435", 
  database: "e-commers", 
  connectionLimit: 5
});

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    console.log("¡Buenas bueeeenas!");
});

app.get("/lectura", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT user, email, password FROM usuarios");
        res.json(rows);
    }
    catch (error){
      res.status(500).json({message: "Error al transmitir los datos"});
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });
  //Realiza la verificación y el registro del usuario nuevo
  app.post("/registro", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT user FROM usuarios WHERE user=?", [req.body.user]);
      //console.log(rows);
      if(rows[0]){
        res.json({message: "El usuario ya existe, ingresa un usuario nuevo"});
      }else{
        const response = await conn.query("INSERT INTO usuarios(user, email, password) VALUE(?,?,?)", [req.body.user, req.body.email, req.body.password]);
        res.json({message: "true"});
      }
    }
    catch (error){
      res.status(500).json({message: "Error al transmitir los datos"});
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });
  //Realiza el login del usuario
  app.post("/login", async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query("SELECT user, password FROM usuarios WHERE user=?", [req.body.user]);
      //console.log(rows);
      if(!rows[0]){//si no se encuentra un usuario se devuelve un mensaje
        res.json({message: "Usuario o contraseña incorrectos"});
      }else{//Acá se realiza la verificación de las contraseñas, si A y B coinciden
        if (rows[0].password===req.body.password){
          //Falta generar un token y enviarlo al usuario en esta sección
          res.json({message: `Bienvenido ${rows[0].user}.`, status: "ok", usuario: `${rows[0].user}`});
        }else {
          res.json({message: "Usuario o contraseña incorrectos", status: "no"});
        }
      }
    }
    catch (error){
      res.status(500).json({message: "Error al transmitir los datos"});
    } finally {
      if (conn) conn.release(); //release to pool
    }
  });



  app.listen(port, ()=>{
    console.log(`Servidor corriendo en https://localhost:${port}`);
  })