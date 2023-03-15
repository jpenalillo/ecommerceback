const express = require('express')
const jwt = require("jsonwebtoken")
const app = express()
const cors = require('cors')

app.listen(3000, console.log("¡Servidor encendido!"))
app.use(cors())
app.use(express.json())

const params =  "paralelepipedo123"

const { verificarCredenciales,registrarUsuario,generarPerfiles } = require('./controller')

app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body
            console.log(req.body.email)
            await verificarCredenciales(email, password)
            const token = jwt.sign({ email },params)
            res.send(token)
        } catch (error) {
            console.log(error)
            res.status(error.code || 500).send(error)
        }
    }
)
app.post("/usuarios", async (req, res) => {
        try {
            const usuario = req.body
            console.log(usuario)
            await registrarUsuario(usuario)
            res.send("Usuario creado con éxito")
        } catch (error) {
            res.status(500).send(error)
        }
    }
)

app.post("/perfiles", async (req, res) => {
    try {
        const perfil = req.body
        await generarPerfiles(perfil)
        res.send("Perfil creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
}
)
    
