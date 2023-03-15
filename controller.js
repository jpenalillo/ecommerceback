const db = require('./conexion')
const bcrypt = require('bcryptjs')

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await db.query(consulta, values)
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
    console.log(consulta)
    await db.query(consulta, values)
}

const generarPerfiles = async (perfil) => {
    let { nombre,descripcion} = perfil
    const values = [nombre,descripcion]
    const consulta = "INSERT INTO perfiles (id,nombre,descripcion) values (DEFAULT,$1,$2)"
    await db.query(consulta, values)
}
module.exports = {verificarCredenciales,registrarUsuario,generarPerfiles}
    