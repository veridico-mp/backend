//Constantes Globales-------------------------------------------------------------------------------------------------------------------------------------//
const express = require('express'); // Importa ExpressJS. Más info de Express en =>https://expressjs.com/es/starter/hello-world.html
const cors = require('cors');
const jwt = require('jsonwebtoken');
const key = "326435";
const app = express();
const port = 3000;
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: "localhost", 
  user: "root", 
  password: `${key}`, 
  database: "e-commers", 
  connectionLimit: 5
});
//------------------------------------------------------------------------------JSONS API--------------------------------------------------------------------------//
let cats = require('./emercado-main/cats/cat.json');
let cats_products = require('./emercado-main/cats_products/101.json');
//---------------------------------------------------------------------------------Uses-------------------------------------------------------------------------------------------------------------------------------------------------//
app.use(express.json());
app.use(cors());

app.get("/", (req, res)=>{
    console.log("¡Buenas bueeeenas!");
});
//--------------------------------------------------------------Realiza la verificación y el registro del usuario nuevo---------------------------------------------------------------------------------------------//
app.post("/registro", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT user FROM usuarios WHERE user=?", [req.body.user]);
    if(rows[0]){
      res.json({message: "El usuario ya existe, ingresa un usuario nuevo"});
    }else{
      const save = await conn.query("INSERT INTO usuarios(user, email, password) VALUE(?,?,?)", [req.body.user, req.body.email, req.body.password]);
      res.json({message: "true"});
    }
  }
  catch (error){
    res.status(500).json({message: "Error al transmitir los datos"});
  } finally {
    if (conn) conn.release(); //release to pool
  }
});
//-----------------------------------------------------------------------------------Realiza el login del usuario---------------------------------------------------------------------------------------------------------------//
app.post("/login", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT user, password FROM usuarios WHERE user=?", [req.body.user]);
    if(!rows[0]){//si no se encuentra un usuario se devuelve un mensaje
      res.json({message: "Usuario o contraseña incorrectos"});
    }else{//Acá se realiza la verificación de las contraseñas, si A y B coinciden
      if (rows[0].password===req.body.password){
        let user = req.body.user;        
        let token = jwt.sign({user}, key);//Genera un token y enviarlo al usuario en esta sección
        res.json({message: `Bienvenido ${rows[0].user}.`, status: "ok", usuario: `${rows[0].user}`, token: `${token}`});
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
//--------------------------------------------------------------------Middleware GET--------------------------------------------------------------------------//
app.use('/categories', (req, res, next)=>{
  try{
    let decoded = jwt.verify(req.headers["access-token"], key);
    console.log(decoded);
    next();
  }catch (error){
    res.status(401).json({message: "Debes loguear para acceder"});
  }
});
app.use('/product', (req, res, next)=>{
  try{
    let decoded = jwt.verify(req.headers["access-token"], key);
    console.log(decoded);
    next();
  }catch (error){
    res.status(401).json({message: "Debes loguear para acceder"});
  }
});
app.use('/comments', (req, res, next)=>{
  try{
    let decoded = jwt.verify(req.headers["access-token"], key);
    console.log(decoded);
    next();
  }catch (error){
    res.status(401).json({message: "Debes loguear para acceder"});
  }
});
//--------------------------------------------------------------------------GET CATEGORIES-------------------------------------------------------------------------------------------//
app.get('/categories', (req, res)=>{
  res.json(cats);
});
//-----------------------------------------------------------------------GET CATEGORIES x ID-----------------------------------------------------------------------------//
app.get('/categories/:id', (req, res)=>{
  let cats_products = require(`./emercado-main/cats_products/${req.params.id}.json`);
  res.json(cats_products.products);
});
//-------------------------------------------------------------------------GET PRODUCTS x ID-------------------------------------------------------------------------------//
app.get('/product/:id', (req, res)=>{
  let products = require(`./emercado-main/products/${req.params.id}.json`);
  res.json({
    id: products.id,
    name: products.name,
    description: products.description,
    cost: products.cost,
    currency: products.currency,
    soldCount: products.soldCount,
    category: products.category,
    images: products.images,
    relatedProducts: products.relatedProducts});
})
//--------------------------------------------------------------------------GET COMMENTS x ID-------------------------------------------------------------------------/
app.get('/comments/:id', (req, res)=>{
  let products_comments = require(`./emercado-main/products_comments/${req.params.id}.json`);
  res.json(products_comments);
})
//----------------------------------------------------------------Define el puerto que escuchara el servidor-------------------------------------------------------------------------------------------------------------//
app.listen(port, ()=>{
  console.log(`Servidor corriendo en https://localhost:${port}`);
});