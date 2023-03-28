const pool = require('./conexion')
const bcrypt = require('bcryptjs')

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Email o contraseña incorrecta" }
}
const registrarUsuario = async (usuario) => {
    let { perfil,rut,email, nombre,password,direccion,telefono,img,status} = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [perfil,rut,email,nombre,passwordEncriptada,direccion,telefono,img,status]
    const consulta = "INSERT INTO usuarios (id,perfil_id,rut,email,nombre,password,direccion,telefono,img,status) values (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8,$9)"
    await pool.query(consulta, values)
}

const generarPerfiles = async (perfil) => {
    let { nombre,descripcion} = perfil
    const values = [nombre,descripcion]
    const consulta = "INSERT INTO perfiles (id,nombre,descripcion) values (DEFAULT,$1,$2)"
    await pool.query(consulta, values)
}

const obtenerUsuarios = async () => {
    const { rows } = await pool.query("SELECT email FROM usuarios")
    console.log(rows)
    return rows
}
const updateUsuarios = async (id,body) => {
    const {rut,email,nombre,direccion,telefono,img,status}  = body
    const perfil = {rut,email,nombre,direccion,telefono,img,status}
    const result = await pool.query("UPDATE usuarios SET ? WHERE id = ?",[perfil,id])
    res.json(result)
}
/** productos* */
const registrarProductos = async (producto) => {
    let { titulo,usuario_id,precio,descripcion,stock,categoria_id,imagen1} = producto
    const values = [usuario_id,titulo,precio,descripcion,stock,categoria_id,imagen1]
    const consulta = "INSERT INTO publicaciones (id,usuario_id,titulo,precio,descripcion,stock,categoria_id,imagen1) values (DEFAULT,$1,$2,$3,$4,$5,$6,$7)"
    await pool.query(consulta, values)
}
/***categorias */
const registrarCategorias = async (cat) => {
    let { categoria,descripcion} = cat
    const values = [categoria,descripcion]
    const consulta = "INSERT INTO categorias (id,categoria,descripcion) values (DEFAULT,$1,$2)"
    await pool.query(consulta, values)
}

const obtenerProductos = async () => {
    const consulta = "SELECT * FROM publicaciones"
    const { rows } = await pool.query(consulta)
    return rows
}

const obtenerProductosId = async (id) => {
    let values = [id]
    const consulta = "SELECT * FROM publicaciones WHERE id = $1"
    const { rows } = await pool.query(consulta,values)
    return rows
}
module.exports = {verificarCredenciales,registrarUsuario,generarPerfiles,obtenerUsuarios,updateUsuarios,registrarProductos,registrarCategorias,obtenerProductos,obtenerProductosId}
    