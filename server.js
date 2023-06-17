const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Ruta para recibir los datos del formulario
app.post('/enviar-correo', (req, res) => {
  const { asunto, correo, descripcion } = req.body;

  // Imprimir los datos en la consola
  console.log('Datos del formulario:');
  console.log('Asunto:', asunto);
  console.log('Correo:', correo);
  console.log('Descripción:', descripcion);
   //res.setHeader('Access-Control-Allow-Origin','*');
  // Configurar el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'neroxpilgrim@gmail.com', // Coloca aquí tu dirección de correo
      pass: 'mpkgrglohwiuwuqp', // Coloca aquí tu contraseña de correo
    },
  });

  // Configurar el correo electrónico a enviar
  const mailOptions = {
    from: 'neroxpilgrim@gmail.com',
    to: correo, // Dirección de correo del usuario
    subject: 'Recibimos su comentario',
    text: 'Gracias por su comentario, se atenderá lo antes posible.',
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el correo.');
    } else {
      console.log('Correo enviado:', info.response);
      res.status(200).send('Correo enviado correctamente.');
    }
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor Node.js iniciado en el puerto 3000');
});
