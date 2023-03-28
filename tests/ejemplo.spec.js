const request = require("supertest");
const server = require("../index");

describe('Testing unitario con Jest', () => {
    let token = '';
    it("Obteniendo un 200 en login", async () => {
        const usuario = {"email":"prueba@admin.com","password":"123456"}
        const response = await request(server)
            .post("/login")
            .send(usuario);
        const login = response;
        token = login.res.text;
        const status = login.statusCode;
        expect(status).toBe(200)
        //expect(login).toBeInstanceOf(Response)
    });
    it("Obteniendo un 200 al crear usuario", async () => {
        const usuario = { 
            "perfil":"1",
            "rut":"1-9",
            "email":"mail5@mail.com",
            "nombre":"prueba desde aca",
            "password":"clave",
            "direccion":"direccion 12345",
            "telefono":"65465465456",
            "img":"https://www.alairelibre.cl/noticias/site/artic/20230323/imag/foto_0000000120230323184558.png",
            "status":true
        }
        const response = await request(server)
            .post("/usuarios")
            .send(usuario);
        const login = response;
        const status = login.statusCode;
        expect(status).toBe(200)
        
    });
    
    it("Obteniendo un 200 al seleccionar usuario", async () => {
        const response = await request(server)
        .get("/usuarios")
        .set('Authorization', 'Bearer ' + token)
        .send()
        const status = response.statusCode;
        expect(status).toBe(400);
    });
})
