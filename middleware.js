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
  let { email, password, nombre, direccion } = usuario
  const passwordEncriptada = bcrypt.hashSync(password)
  password = passwordEncriptada
  const values = [1, email, passwordEncriptada, nombre, direccion, true]
  const consulta = "INSERT INTO usuarios (id,perfil_id,email,password,nombre,direccion,status) values (DEFAULT,$1,$2,$3,$4,$5,$6)"
  await pool.query(consulta, values)
}

const generarPerfiles = async (perfil) => {
  let { nombre, descripcion } = perfil
  const values = [nombre, descripcion]
  const consulta = "INSERT INTO perfiles (id,nombre,descripcion) values (DEFAULT,$1,$2)"
  await pool.query(consulta, values)
}

const obtenerUsuarios = async () => {
  const { rows } = await pool.query("SELECT email FROM usuarios")
  console.log(rows)
  return rows
}
const updateUsuarios = async (id, body) => {
  const { rut, email, nombre, direccion, telefono, img, status } = body
  const perfil = { rut, email, nombre, direccion, telefono, img, status }
  const result = await pool.query("UPDATE usuarios SET ? WHERE id = ?", [perfil, id])
  res.json(result)
}
/** productos* */
const registrarProductos = async (producto) => {
  let { titulo, usuario_id, precio, descripcion, stock, categoria_id, imagen1 } = producto
  const values = [usuario_id, titulo, precio, descripcion, stock, categoria_id, imagen1]
  const consulta = "INSERT INTO publicaciones (id,usuario_id,titulo,precio,descripcion,stock,categoria_id,imagen1) values (DEFAULT,$1,$2,$3,$4,$5,$6,$7)"
  await pool.query(consulta, values)
}
/***categorias */
const registrarCategorias = async (cat) => {
  let { categoria, descripcion } = cat
  const values = [categoria, descripcion]
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
  const { rows } = await pool.query(consulta, values)
  return rows
}

const insertarDetalle = async (publicacion_id, cantidad, precio, item, codigo) => {
  const values = [publicacion_id, cantidad, precio, item, parseInt(codigo)]
  console.log(values)
  const queryIn = 'INSERT INTO "detalleOrden" (id, publicacion_id, cantidad, precio, item, orden_id) VALUES (DEFAULT, $1, $2, $3, $4, $5)'
  await pool.query(queryIn, values)
  const updateStock = "UPDATE publicaciones SET stock=stock-$2 WHERE id=$1"
  const value = [publicacion_id, cantidad]
  await pool.query(updateStock, value)

}
const comprar = async (email, datosCompra) => {
  const value = [email]
  const query = "select id,concat(extract(month from current_date),extract(day from current_date),id, trunc(random() * 99 + 13)) as codigo from usuarios where email = $1"
  const usuario_id = await pool.query(query, value)
  let id = usuario_id.rows[0].id
  let orden_id = usuario_id.rows[0].codigo
  let item = 1
  let total = 0

  datosCompra.map((e) => {
    insertarDetalle(e.id, 1, e.price, item, orden_id)
    item++;
    total += (e.price * 1)
  });

  const values = [id, total, datosCompra, orden_id]
  const InsertOrden = "INSERT INTO ordenes (id, usuario_id, total, observacion,orden_id,estado_id) VALUES (DEFAULT, $1 ,$2, $3, $4, 1)"
  await pool.query(InsertOrden, values)

  console.log("Compra agregada con exito");
}
const obtenerCompras = async (email) => {
  const value = [email]
  const query = "select id from usuarios where email = $1"
  const usuario_id = await pool.query(query, value)
  let id = usuario_id.rows[0].id
  let values = [id]
  const consulta = `SELECT c.id,b.titulo,b.precio,b.imagen1
                        FROM ordenes AS c
                        LEFT JOIN "detalleOrden" a
                        ON a.orden_id = c.orden_id
                        LEFT JOIN publicaciones b
                        ON b.id = a.publicacion_id
                      WHERE c.usuario_id = $1
                        AND b.titulo <> ''
                        ORDER BY c.id ASC`
  const { rows } = await pool.query(consulta, values)
  return rows
}

module.exports = { verificarCredenciales, registrarUsuario, generarPerfiles, obtenerUsuarios, updateUsuarios, registrarProductos, registrarCategorias, obtenerProductos, obtenerProductosId, comprar, obtenerCompras }
