# Estudio Preliminar

## Introducción

Este documento presenta un servicio que permite a los usuarios ver datos relacionados con el uso que hace del ordenador similar a la aplicación de tiempo de uso disponible en los productos de Apple. Esta idea nace de la falta de algo similar en el ecosistema de Windows/Linux y que impide a los usuarios saber cuánto tiempo pasan trabajando en el ordenador o que aplicaciones no han usado últimamente entre muchas otra, así como la creciente demanda en todo el mundo de seguridad y salud digital.

Como concepto el usuario a través de la aplicación web se descargará una aplicación que instalaría en su equipo la cual registraría cuanto tiempo pasa en cada aplicación y mandaría esos datos al servidor. Luego a través de la misma aplicación web que uso para descargar el software el usuario podría ver los datos recopilados por la aplicación de escritorio en forma de tablas, gráficos y demás representación además realizar una serie de acciones como crear y modificar categorías, hacer uso de los datos recopilados mediante una API, obtener recomendación y otras opciones.

### Audiencia

El público objetivo de nuestra aplicación comprende a usuarios que tienen interés en llevar el control del tiempo que emplean usando el ordenador con el fin de no solo saber que aplicaciones usan y el tiempo que emplean si no que busquen mejorar sus rendimientos y salud digital en base a los datos y consejos de nuestra aplicación.

También puede resultar atractiva a empresas que busquen un sistema de bajo coste y código libre para monitorizar el uso de los equipos informáticos, que aplicaciones se usan en estos, así como conocer el uso que hacen los empleados de los mismos.

A su vez al tener disponible los datos recopilados accesibles desde una API también puede interesar a empresas que busquen obtener información para sus negocios o proyectos.

### Objetivo del producto

Ayudar a los usuarios que busquen mejorar su salud digital permitiéndoles conocer el tiempo de uso y aplicaciones que emplean en su día a día mediante intuitivos gráficos, tablas y consejos adaptados. También ayuda a empresas que busquen monitorizar el uso de los equipos y aplicaciones en el centro de trabajo mediante una aplicación de escritorio optimizada y Open Source o bien obtener información sobre usuarios de los equipos informáticos recurriendo a la API que implementara la aplicación.

## Descripción general

### Perspectiva

Permite al usuario la consulta de información actualizada sobre su tiempo de uso con simplemente iniciar sesión en nuestra página web. A su vez también permite a las empresas un rápido despliegue y gestión de cuentas gracias la implementación de la API y Apps al igual que el escaso consumo de espacio y cómputo de nuestra aplicación la hace ideal para implementar el equipo de escasos recursos.

### Requisitos del negocio

En un inicio la aplicación registra: usuarios, logs, aplicaciones, apps, inicios de sesión, peticiones a la API, peticiones a la aplicación web y posts.

#### Usuarios

| **Dato** | **Tipo** |
| --- | --- |
| **Código de usuario** | Numérico |
| **Código de la aplicación que creó el usuario** | Numérico |
| **Código de estatus** | Numérico |
| **Visibilidad** | Texto |
| **Diff** | Numérico |
| **Nick** | Texto |
| **Contraseña** | Texto |
| **Email** | Texto |
| **Código de categoría** | Numérico |
| **Nombre** | Texto |
| **Apellidos** | Texto |
| **Fecha de registro** | Fecha y hora |
| **Fecha de actualización** | Fecha y hora |
| **Fecha de cumpleaños** | Fecha y hora |
| **URL de la imagen** | Texto |
| **Códigos de recuperación** | Texto |

#### Logs

| **Dato** | **Tipo** |
| --- | --- |
| **Código del log** | Numérico |
| **Código de usuario que creó el log** | Numérico |
| **Código de la aplicación** | Numérico |
| **Fecha de inicio** | Fecha y hora |
| **Fecha de fin** | Fecha y hora |
| **Duración** | Numérico |

#### Aplicaciones

| **Dato** | **Tipo** |
| --- | --- |
| **Código de la aplicación** | Numérico |
| **Código del usuario al que pertenece** | Numérico |
| **Categoría** | Texto |
| **Aplicación** | Texto |
| **Fecha de registro** | Fecha y hora |
| **Fecha de actualización** | Fecha y hora |

#### Apps

| **Dato** | **Tipo** |
| --- | --- |
| **Código de la app** | Numérico |
| **Código del usuario al que pertenece** | Numérico |
| **Código de status** | Numérico |
| **Visibilidad** | Texto |
| **Token** | Texto |
| **Código de categoría** | Numérico |
| **Nombre** | Texto |
| **Descripción** | Texto |
| **URL de la imagen** | Texto |
| **Fecha de creación** | Fecha y hora |
| **Fecha de modificación** | Fecha y hora |

#### Inicios de sesión

| **Dato** | **Tipo** |
| --- | --- |
| **Código de sesión** | Numérico |
| **Código del usuario que inicio sesión** | Numérico |
| **Fecha de inicio** | Fecha y hora |
| **Tipo de sesión** | Texto |
| **Dispositivo** | Texto |

#### Peticiones a la API

| **Dato** | **Tipo** |
| --- | --- |
| **Código de petición** | Numérico |
| **Código de la app** | Numérico |
| **IP del equipo** | Texto |
| **URL solicitada** | Texto |
| **Método** | Texto |
| **Fecha** | Fecha y hora |

#### Peticiones a la web

| **Dato** | **Tipo** |
| --- | --- |
| **Código de la petición** | Numérico |
| **IP del equipo** | Texto |
| **URl solicitada** | Texto |
| **Método** | Texto |
| **Fecha** | Fecha y hora |

#### Posts

| **Dato** | **Tipo** |
| --- | --- |
| **Código del post** | Numérico |
| **Código del usuario que lo creó** | Numérico |
| **Título** | Texto |
| **Contenido** | Texto |
| **Fecha de registro** | Fecha y hora |
| **Categoría del post** | Numérico |

La aplicación permitirá a través de una aplicación de escritorio registrar el uso que hace el usuario de cada aplicación y luego a través de una aplicación web este tendrá acceso a ver esos datos obtenidos de una manera más rápida, sencilla y clara a su vez se le permitirá realizar modificaciones sobre estos como modificar el perfil, crear o modificar sus aplicaciones o apps, mejorar de categorías sus usuarios o apps permitiéndoles realizar más acciones así como obtener acceso a la API o a los post de nuestra aplicación.

Los usuarios que usen nuestra aplicación proporcionarán información referente al dispositivo desde donde se conectan, fecha y hora del sistema, así como información personal como nombre, apellidos o correo electrónico. Todas las políticas y términos de uso están reflejados en la propia página.

### Categorías

En el sistema tanto usuario como apps tienen una categoría asignada. Esta categoría está indicada mediante un código el campo de **categoryCode** de cada recurso. Dependiendo de la categoría a la que pertenezca el recurso eliminará en mayor o menor medida las restricciones de uso, así como permitirles realizar ciertas acciones extra. En caso de que se quiera realizar un cambio de categoría se tendrá que realizar un único pago de la cantidad marcada en el precio de la categoría. A continuación, se detallan los datos de cada categoría.

| **Nombre** | **Precio (€)** | **Código** |
| --- | --- | --- |
| **Estándar (Por defecto)** | 0 | 7 |
| **Premium** | 20 | 6 |
| **Super** | 35 | 5 |
| **Ultra** | 50 | 4 |
| **Awesome** | 100 | 3 |
| **Almost admin** | 200 | 2 |
| **Admin** | 0 | 1 |

### Tipos de usuario

Nuestra aplicación distingue diferentes tipos de usuarios según su categoría. Todos los usuarios pertenecen a una categoría la cual está indicada en el propio recurso y que indica una relación con la tabla de categorías de usuario. Cada categoría de usuario permite a estos realizar ciertas acciones en mayor o menor medida o realizar acciones más avanzadas como las de administración, actualmente las categorías de usuario existentes son estas:

| **Nombre** | **Apps máximas** |
| --- | --- |
| **Estándar (Por defecto)** | 2 |
| **Premium** | 5 |
| **Super** | 10 |
| **Ultra** | 15 |
| **Awesome** | 20 |
| **Almost admin** | Ilimitadas |
| **Admin \*** | Ilimitadas |

\* Es la máxima categoría de usuario permitida y hace que quien la posea tenga acceso a todas las opciones de administración disponibles en la aplicación web, así como la eliminación del límite a apps de su cuenta. Esta categoría sólo puede ser asignada por otros usuarios administradores.

Todos los usuarios tienen acceso a la creación de apps, aplicaciones, así como al uso de la aplicación de escritorio y administración de sus datos.

### Tipos de apps

Ya que nuestra aplicación no solo tiene usuarios que acceden al servicio a través de la aplicación web, sino que también tiene una API a través de la cual las diferentes apps pueden realizar acciones también se ha creado un sistema de categorías para estas que permitirá a la aplicación gestionar mejor el uso de los recursos, así como facilitar la obtención de ingresos al poder monetizar el uso de sus recursos. Cualquier categoría mencionada permitirá a la app que la posea realizar las mismas acciones sin embargo la cantidad de estas se verá limitada por el número máximo de petición a la API marcada en su categoría.

| **Nombre** | **Peticiones diarias máximas** |
| --- | --- |
| **Estándar (Por defecto)** | 5 |
| **Premium** | 20 |
| **Super** | 50 |
| **Ultra** | 100 |
| **Awesome** | 200 |
| **Almost admin** | Ilimitadas |
| **Admin \*** | Ilimitadas |

\* Es la máxima categoría para una app. Esta elimina el máximo número de peticiones a la API diarias, así como de cualquier comprobación de permisos y seguridad. Esta categoría únicamente es empleada por la app de sistema. A su vez sólo puede ser asignada por otra app que la posea o por un usuario con categoría admin.

### Entorno operacional de la aplicación

Para acceder a la aplicación web desde donde se tendrá acceso a la información recopilada por la aplicación de escritorio únicamente se necesitará un dispositivo con navegador web y acceso a internet. Los navegadores empleados para el desarrollo y donde se ha comprobado el correcto funcionamiento de la aplicación son los siguientes: Google Chrome 21+, Opera 12.1+, Safari 6.1+, Mozilla Firefox 28+, Microsoft Edge 12+, IE10+ y Chromium 22+. La velocidad de internet recomendada es de 2 Mbps.

A su vez en lo que abarca a la aplicación de escritorio el equipo anfitrión únicamente tendrá que disponer de un sistema operativo Windows o macOS tanto en versión de x86 como x64. Este equipo deberá contar con un mínimo de 20 MB para la aplicación de escritorio, así como 10 MB de RAM disponible.

En caso de querer hacer uso del código de la aplicación para desarrolló los módulos necesarios, así como los requisitos de hardware son los siguientes:

Requisitos generales independientes del sistema operativo empleado:

- 2 Mbps de velocidad de conexión
- 10 MB de RAM disponible
- 36,5 KB de almacenamiento disponible
- Python 3.6
- Módulo de Python Requests 2.20

Para Windows se necesitará a mayores de lo anterior el módulo de Python PyWin32 225

Para macOS se necesitará a mayores de lo anterior el módulo de Python PyObjC 6.1

## Planificación y costes

### Estimación inicial

#### Calendario inicial

| **Actividad** | **Inicio** | **Duración (Días)** | **Fin** |
| --- | --- | --- | --- |
| **Estudio preliminar** | 16/03/2020 | 10 | 26/03/2020 |
| **Análisis de requisitos** | 26/03/2020 | 15 | 10/04/2020 |
| **Diseño** | 10/04/2020 | 20 | 30/04/2020 |
| **Codificación y pruebas** | 30/04/2020 | 45 | 14/06/2020 |

##### Estudio preliminar

Durante esta etapa nos centramos en pensar cual queríamos que fuese la aplicación a desarrollar pudiendo elegir libremente el tema y características de esta.

Durante esta fase del desarrollo únicamente se realizó una tarea:

| **Tarea #1** | **Búsqueda de la idea** |
| --- | --- |
| **Descripción** | Investigar posibles problemas o mejoras sobre las cuales poder desarrollar nuestro proyecto. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 10 días. |

##### Análisis de requisitos

Una vez ya teníamos la idea tocaba pensar las funcionalidades, características y prestaciones que queríamos desarrollar e incorporar a la aplicación, así como las necesidades que tendríamos para poder llevarlas a cabo.

Durante esta fase se desarrollaron un total de 3 tareas:

| **Tarea #1** | **Requisitos funcionales** |
| --- | --- |
| **Descripción** | Listar el conjunto de funcionalidades y características de nuestra aplicación, así como las necesidades de estas. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 7 días. |

| **Tarea #2** | **Requisitos no funcionales** |
| --- | --- |
| **Descripción** | Conocer los requisitos no funcionales de nuestra aplicación. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 5 días. |

| **Tarea #3** | **Revisión de la normativa** |
| --- | --- |
| **Descripción** | Revisar de las normas aplicables a nuestra propuesta. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 3 días. |

##### Diseño

Una vez las fases anteriores ya estuvieron listas lo siguiente era pensar y preparar el diseño de nuestra aplicación.

Durante esta fase se desarrollaron un total de 4 tareas:

| **Tarea #1** | **Búsqueda de ideas** |
| --- | --- |
| **Descripción** | Inicialmente se buscó a lo largo de la web posibles ejemplos y bases las cuales nos ayudaran a diseñar la paginas de nuestro sitio. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 5 días. |

| **Tarea #2** | **Revisión de convenciones** |
| --- | --- |
| **Descripción** | Investigación sobre convenciones, recomendaciones y buenos usos en el desarrollo. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 3 días. |

| **Tarea #3** | **Elaboración de maquetas** |
| --- | --- |
| **Descripción** | Mediante el uso de herramientas online se desarrollaron un conjunto de diseños y modelos. Estos modelos servirían de base para el desarrollo. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 8 días. |

| **Tarea #4** | **Revisión de los modelos** |
| --- | --- |
| **Descripción** | Revisión y ajuste de los modelos para adaptarlos a las necesidades, recomendaciones y convenciones. |
| **Recursos materiales** | Ordenador, navegador web e Internet. |
| **Recursos humanos** | Programador. |
| **Duración** | 4 días. |

##### Codificación y pruebas

Esta fase aglomera todo el proceso de creación del sistema desde la puesta en marcha de los recursos informáticos necesarios como de la creación del propio código fuente.

Durante esta fase se desarrollaron un total de 7 tareas:

| **Tarea #1** | **Puesta en marcha** |
| --- | --- |
| **Descripción** | Se pusieron en funcionamiento todos los sistemas necesarios para el desarrollo del sistema. Esto incluye servidor, sistema gestor de base de datos, aplicaciones, servicios y demás. |
| **Recursos materiales** | Ordenador, navegador web, Internet, editor de código, sistemas de gestión de bases de datos y terminales. |
| **Recursos humanos** | Programador. |
| **Duración** | 5 días. |

| **Tarea #2** | **Creación de la API** |
| --- | --- |
| **Descripción** | Investigación y desarrollo de la API. Esta API servirá de base para la aplicación web. |
| **Recursos materiales** | Ordenador, navegador web, Internet, editor de código, terminal y una aplicación que nos permitiese realizar las peticiones. |
| **Recursos humanos** | Programador. |
| **Duración** | 10 días. |

| **Tarea #3** | **Fase de pruebas API** |
| --- | --- |
| **Descripción** | Testear la API. |
| **Recursos materiales** | Ordenador, navegador web, Internet, editor de código, terminal y una aplicación que nos permitiese realizar las peticiones. |
| **Recursos humanos** | Programador. |
| **Duración** | 3 días. |

| **Tarea #4** | **Desarrollo de la aplicación web** |
| --- | --- |
| **Descripción** | Desarrollo de la aplicación web, tanto la parte del cliente como la parte del servidor. |
| **Recursos materiales** | Ordenador, navegadores web, Internet, editor de código y terminal |
| **Recursos humanos** | Programador. |
| **Duración** | 15 días. |

| **Tarea #5** | **Pruebas de la aplicación web** |
| --- | --- |
| **Descripción** | Testeo de la aplicación web. |
| **Recursos materiales** | Ordenador, navegadores web, Internet, editor de código y terminal |
| **Recursos humanos** | Programador. |
| **Duración** | 7 días. |

| **Tarea #6** | **Ajustes en la API y aplicación web** |
| --- | --- |
| **Descripción** | Resoluciones de problemas encontrados durante las fases de pruebas, así como ajustes para mejorar el rendimiento del sistema. |
| **Recursos materiales** | Ordenador, navegadores web, Internet, editor de código, terminal y una aplicación que nos permitiese realizar las peticiones. |
| **Recursos humanos** | Programador. |
| **Duración** | 6 días. |

| **Tarea #7** | **Pruebas generales del sistema** |
| --- | --- |
| **Descripción** | Pruebas conjuntas finales de todo el sistema. |
| **Recursos materiales** | Ordenador, navegadores web, Internet, editor de código, terminal y una aplicación que nos permitiese realizar las peticiones. |
| **Recursos humanos** | Programador. |
| **Duración** | 14 días. |

#### Estimación coste inicial

Se estima que los gastos para el desarrollo de esta aplicación no superen los 1300 euros mensuales. Se prevé un desarrollo de unos 3 meses de duración por lo que los gastos totales no deberían superar los 4000 euros. Estos gastos abarcan la contratación del servidor donde de ejecuta la aplicación y donde se guardan los datos recopilados siendo este de un total de 50 euros al mes, así como el nombre de dominio que emplea con un coste de 15 euros anuales, conexión a internet privada que nos permita agilizar el desarrollo 70 euros mensuales, así como 90 euros que corresponden a la parte proporcional del coste del equipo personal donde se va a desarrollar. En cuanto a los costes de suministros solo vamos a ten la cuenta los suministros eléctricos los cuales se estiman que serán de unos 50 euros mensuales, no se tienen en cuenta gastos de alquiler, agua o alimentación. En cuanto al sueldo del programador este será de 1000 euros.

Para minimizar los gastos se hará uso de aplicaciones Open Source o gratuitas como Libre Office, GIMP o Visual Studio Code.

#### Tabla de costes

##### Costes desarrollo

| **Concepto** | **Coste mensual (€)** | **Coste total proyecto** **(3 meses) (€)** |
| --- | --- | --- |
| **Servidor** | 50 | 150 |
| **Conexión a internet** | 70 | 210 |
| **Gastos de dominio** | 1,25 | 3,75 |
| **Coste equipo** | 90 | 270 |
| **Coste suministros** | 50 | 150 |
| **Salario programador** | 1000 | 3000 |
| **Aplicaciones** | 0 | 0 |
| **Total** | 1275 | 3795 |

##### Costes de mantenimiento

| **Concepto** | **Coste mensual (€)** | **Coste anual (€)** |
| --- | --- | --- |
| **Servidor** | 50 | 600 |
| **Conexión a internet** | 70 | 840 |
| **Gastos de dominio** | 1,25 | 15 |
| **Coste suministros** | 50 | 600 |
| **Total** | 1275 | 2055 |

##### Coste por actividad

| **Actividad** | **Duración** **(horas)** | **Coste (€)** | **Coste total (€)** |
| --- | --- | --- | --- |
| **Estudio preliminar** | 80 | 333 | 77 | 400 |
| **Análisis de requisitos** | 120 | 500 | 130 | 636 |
| **Diseño** | 160 | 667 | 178 | 849 |
| **Codificación y pruebas** | 360 | 1500 | 410 | 1910 |
| **Total, proyecto (€)** | 3000 | 795 | 3795 |
