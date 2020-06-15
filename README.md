# Proyecto de fin de ciclo DAW | AWESOMETRACKER

## Descripción

Este documento presenta un servicio que permite a los usuarios ver datos relacionados con el uso que hace del ordenador similar a la aplicación de tiempo de uso disponible en los productos de Apple. Esta idea nace de la falta de algo similar en el ecosistema de Windows/Linux y que impide a los usuarios saber cuánto tiempo pasan trabajando en el ordenador o que aplicaciones no han usado últimamente entre muchas otra, así como la creciente demanda en todo el mundo de seguridad y salud digital.

Como concepto el usuarioa través de la aplicación web se descargará una aplicación que instalaría en su equipo la cual registraría cuanto tiempo pasa en cada aplicación y mandaría esos datos al servidor. Luego a través de la misma aplicación web que uso para descargar el software el usuario podría ver los datos recopilados por la aplicación de escritorio en forma de tablas, gráficos y demás representación además realizar una serie de acciones como crear y modificar categorías, hacer uso de los datos recopilados mediante una API, obtener recomendación y otras opciones.

## Convenciones

Log – Cada uno de los registros de tiempo de uso de una aplicación que hace la aplicación y que están almacenados en la base de datos de la aplicación.

App – Cada uno de los tokens proporcionados que permiten el uso de la API.

Diff – Tiempo mínimo para que se registre un log en el sistema. Individual y personalizable por cada usuario.

Post – Cada una de las noticias que se muestran en la página. Estas incluirán información sobre cambios, novedades o advertencias.

Estatus – Estado de un recurso. Se emplea para los usuarios o apps. Permite o no hacer uso de los recursos.

Visibilidad – Privacidad de la cuenta de usuario o app. Permite o no a los demás usuarios visualizar los datos tanto propios como relacionas de dicho recurso tanto.

## Instalación

Dado que hacemos uso de NodeJS para la aplicación web el proceso de instalación de nuestro software es extremadamente sencillo. Para poder hacer uso del codigo desarrollado, tanto de cliente como de servidor, tenemos que descargar los ficheros contenidos en las carpetas correspondientes [cliente](https://github.com/ppabli/awesometracker-server/tree/master/awesometracker.ddns.net/client) o [servidor](https://github.com/ppabli/awesometracker-server/tree/master/awesometracker.ddns.net/server).

Una vez descargado lo unico que tenemos que hacer es ejecutar el comando `npm install` y automaticamente el sistema descargara todas las dependencias necesarias para poder poner nuestro proyecto en uso.

En cuanto a la base de datos necesaria para el funcionamiento de la aplicación tenemos que ejecutar el script que esta proporcionado en el repositorio [script](docs/script.sql). Este script creara las tablas necesarias para la aplicación (se debe tener ya creada la base de datos donde queremos que se creen las tablas). A mayores del script el sistema necesita un usuario con todos los permisos sobre la base de datos creada, esta acción queda a manos del usuario. Si se desea conocer mas en detalles los campos, tipo de datos empleados y demas información sobre la base de datos esta esta indicada en la documentación del proyecto [documentacion](docs/Documentacion.pdf).

## Sobre el autor

Mi nombre es Pablo Liste Cancela, tengo 21 años y actualmente soy estudiante de 2 DAW en el IES San Clemente.
Desde pequeño me ha gustado la tecnologia y siempre he tenido curiosidad de saber como funcionan las cosas ese es el motivo por el cual decidi estudiar programación.

En cuanto a las tecnologias que mas he usado se encuentran las siguientes:
1. JavaScript
2. Python
3. NodeJS
4. Vue.JS

Puedes ponerte en contacto conmigo o saber mas sobre mi en los siguientes enlaces:
- [ppabli12@gmail.com](ppabli12@gmail.com)
- [a18pablolc@iessanclemente.net](a18pablolc@iessanclemente.net)
- [https://github.com/ppabli](https://github.com/ppabli)

## Licencia

Este proyecto tiene una licencia MIT. Esta licencia permite el uso del codigo, imagenes y demas contenido presente en este repositorio tanto para uso comercial como privado asi como su modificación y distribución. A su vez no se aporta ningun tipo de garantia y se elimina cualquier tipo de responsabilidad.

[Licencia](LICENSE)

## Bibliografía

A continuación, se listan las páginas más empleadas durante el desarrollo.

- [https://cloud.google.com/](https://cloud.google.com/)
- [https://www.opencodez.com/javascript/build-restful-api-using-node-js.htm](https://www.opencodez.com/javascript/build-restful-api-using-node-js.htm)
- [https://github.com/](https://github.com/)
- [https://auth0.com/learn/token-based-authentication-made-easy/](https://auth0.com/learn/token-based-authentication-made-easy/)
- [https://vuejs.org/v2/guide/](https://vuejs.org/v2/guide/)
- [https://www.w3schools.com/](https://www.w3schools.com/)
- [https://developer.mozilla.org/es/](https://developer.mozilla.org/es/)
- [https://stackoverflow.com/](https://stackoverflow.com/)
- [https://www.youtube.com/](https://www.youtube.com/)
- [https://mariadb.com/kb/en/documentation/](https://mariadb.com/kb/en/documentation/)
- [https://manuais.iessanclemente.net/index.php/Portada](https://manuais.iessanclemente.net/index.php/Portada)

## Memoria

1. [Estudio preliminar](docs/templates/1_estudio_preliminar.md)
2. [Análisis](docs/templates/2_analisis.md)
3. [Diseño](docs/templates/3_diseno.md)
4. [Codificación y pruebas](docs/templates/4_codificacion_pruebas.md)

## Anexos

1. [Documentación web](https://awesometracker.ddns.net/docs)
2. [Aplicación web](https://awesometracker.ddns.net)
3. Repositorios
	1. [Repositorio servidor](https://github.com/ppabli/awesometracker-server)
	2. [Repositorio aplicación escritorio](https://github.com/ppabli/awesometracker-desktop)
4. [Lista de reproducción](https://www.youtube.com/playlist?list=PL-1Ze9GVKLwzRJGEltgkMl-ICTp4Jo66a)