const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qrcode = require('qrcode');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

const serviceAccount = require('./hosting-miniproject-firebase-adminsdk-z1hz8-908fb762c8.json'); // Ruta al archivo JSON de las credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hosting-miniproject.firebaseio.com' // URL de tu base de datos Firebase
});


app.use(cors());

app.use(express.static(process.cwd()+"/public/"));

// Obtén una referencia a la colección y documento que deseas leer
const db = admin.firestore();
const collectionRef = db.collection('Sitios');
const documentRef = collectionRef.doc('prueba1');
let documentString = "texto";

collectionRef.get()
  .then((snapshot) => {
    // Obtiene una matriz de los documentos
    const documents = snapshot.docs;

    // Elige un documento aleatorio de la matriz
    const randomIndex = Math.floor(Math.random() * documents.length);
    const randomDocument = documents[randomIndex];
    console.log(documents.length)
    console.log(randomIndex)
    if (randomDocument.exists) {
      console.log('Datos del documento aleatorio:', randomDocument.id);
      //documentString = JSON.stringify(randomDocument.data(), null, 2).replace(/[{"}]/g, '') + '\n';
      console.log("https://hosting-miniproject.web.app/reserva?parametro="+randomDocument.id);
      documentString = "https://hosting-miniproject.web.app/reserva?parametro="+randomDocument.id;

    } else {
      console.log('El documento aleatorio no existe.');
    }
  })
  .catch((error) => {
    console.log('Error al leer la colección:', error);
  });
// Lee los datos del documento
/*documentRef.get()
  .then((doc) => {
    if (doc.exists) {
      console.log('Datos del documento:', doc.data());
    } else {
      console.log('El documento no existe.');
    }
  })
  .catch((error) => {
    console.log('Error al leer el documento:', error);
  });*/

app.get('/api/generar-codigo-qr', (req, res) => {
  llamadaFirebaseQR();
  const qrCodeData = documentString;

  qrcode.toDataURL(qrCodeData, (err, url) => {
    if (err) {
      console.error('Error al generar el código QR:', err);
      res.sendStatus(500);
    } else {
      res.json({ qrCodeUrl: url });
    }
  });
});

function llamadaFirebaseQR(){
  collectionRef.get()
  .then((snapshot) => {
    // Obtiene una matriz de los documentos
    const documents = snapshot.docs;

    // Elige un documento aleatorio de la matriz
    const randomIndex = Math.floor(Math.random() * documents.length);
    const randomDocument = documents[randomIndex];
    console.log(documents.length)
    console.log(randomIndex)
    if (randomDocument.exists) {
      console.log('Datos del documento aleatorioasdasdasd:', documents.id);
      documentString = JSON.stringify(randomDocument.id, null, 2).replace(/[{"}]/g, '') + '\n';
      console.log(documentString);
    } else {
      console.log('El documento aleatorio no existe.');
    }
  })
  .catch((error) => {
    console.log('Error al leer la colección:', error);
  });
}



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
      user: 'proyectoginaweb90@gmail.com', // Coloca aquí tu dirección de correo
      pass: 'nkjlddzlbbtijilb', // Coloca aquí tu contraseña de correo
    },
  });

  // Configurar el correo electrónico a enviar
  const mailOptions = {
    from: 'proyectoginaweb90@gmail.com',
    to: correo, // Dirección de correo del usuario
    subject: 'Su reservacion ha sido registrada con exito.',
    text: descripcion,
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

app.post('/enviar-correo/contacto', (req, res) => {
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
      user: 'proyectoginaweb90@gmail.com', // Coloca aquí tu dirección de correo
      pass: 'nkjlddzlbbtijilb', // Coloca aquí tu contraseña de correo
    },
  });

  // Configurar el correo electrónico a enviar
  const mailOptions = {
    from: 'proyectoginaweb90@gmail.com',
    to: correo, // Dirección de correo del usuario
    subject: 'Gracias por contactarnos! le responderemos en breve',
    text: descripcion,
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


/*app.listen(3000, () => {
  console.log('Servidor en ejecución en http://localhost:3000');
});*/

app.listen(8080, '0.0.0.0', () => {
  console.log('App listening on 0.0.0.0:8080');
});