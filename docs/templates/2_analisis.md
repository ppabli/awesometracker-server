# Análisis

## Funciones

A continuación, se listan todas las acciones que se permiten realizar tanto a las apps como al usuario del sistema a través de nuestra aplicación. La mayoría están disponibles para su uso a través de la API o de la versión web.

### Función 1: Dar de alta al usuario

Requerirá de los siguientes datos para completarse:

- Código de usuario por defecto será incremental y autogenerado por la propia aplicación.
- Código de la aplicación que crea el usuario.
- Nick.
- Contraseña la cual será procesada antes de guardar en la base de datos y deberá contar con al menos 8 caracteres incluyendo letras (mayúsculas y minúsculas), números y caracteres no numéricos.
- Email.
- Nombre de usuario.
- Apellidos del usuario.
- Fecha de registro será la hora actual del sistema.
- Fecha de última actualización la cual será la hora actual del sistema.
- Fecha de cumpleaños.
- Diff por defecto tiene el valor de 1.
- URl de la imagen del usuario en caso de no proporcionar ninguna por defecto se utilizará la básica de la aplicación [1](./../img/default.png).
- Código de estatus del usuario por defecto 1.
- Código de categoría del usuario por defecto se asigna la mínima categoría, es decir el código 7.
- Visibilidad del usuario pudiendo ser public o private se asigna por defecto public.

Algunos de campos tienen un valor por defecto ya que dependiendo de quién cree el usuario estos se podrán añadir o no.

### Función 2: Dar de baja al usuario

Requerirá de los siguientes datos para completarse:

- Código del usuario a eliminar.

### Función 3: Modificar un usuario

Para poder modificar un usuario únicamente hará falta proporcionar el código del usuario que queremos modificar, así como las propiedades de este que queremos cambiar. Las propiedades modificables del usuario son todas las que posee menos propio código, fecha de registro del usuario, así como la fecha de última modificación.

Ciertos cambios no están permitidos dependiendo de quién modifique el usuario por ejemplo si quien modifica el usuario es el mismo este no podrá cambiar el código de la app que lo creó, código de categoría, código de usuario. Mientras que en si quien está modificando el usuario es la app que lo creo esta puede modificar todos los campos menos el código de categoría y el código de usuario. Ya como único caso en caso de que una app o usuario administrador sea quien modifique un usuario este podrá modificar todos los valores salvo el código de propio usuario.

### Función 4: Mejorar la categoría de un usuario

Ya que nuestra aplicación hace uso de un sistema de categorías de usuario el sistema también permite al usuario realizar el proceso de mejorar su usuario mediante un solo pago para mejorar las capacidades de este. Para ello el sistema hace uso de la API de PayPal y por defecto el único parámetro que se tienen que proporcionar es el código de la nueva categoría. Por defecto esta acción únicamente está presente en la aplicación web.

### Función 5: Iniciar sesión

Requerirá de los siguientes datos para completarse:

- Email o nombre usuario,
- Contraseña.

El hecho de iniciar sesión implica un registro en la base de datos con los siguientes datos:

- Código de sesión por defecto un valor incremental autogenerado por el sistema.
- Código del usuario que ha iniciado sesión.
- Fecha de inicio.
- Tipo de sesión (cierre o inicio).
- Dispositivo desde donde se realizó la acción.

### Función 6: Dar de alta un log

Requerirá de los siguientes datos para completarse:

- Código del log el cual inicialmente será un valor incremental y autogenerado por el sistema.
- Código del usuario que crea el registro.
- Fecha de inicio.
- Fecha de fin.

### Función 7: Eliminar un log

Requerirá de los siguientes datos para completarse:

- Código del log el cual queramos eliminar.

### Función 8: Dar de alta una aplicación

Requerirá de los siguientes datos para completarse:

- Código de la aplicación por defecto es un valor incremental y autogenerado por el sistema.
- Código del usuario que da de alta la nueva aplicación.
- Nombre de la categoría.
- Nombre de la aplicación.

### Función 9: Eliminar una aplicación

Requerirá de los siguientes datos para completarse:

- Código de la aplicación que queramos eliminar.

### Función 10: Modificar una aplicación

Requerirá de los siguientes datos para completarse:

- Código de la aplicación que queramos modificar.
- Código del usuario propietario.
- Categoría.
- Nombre.

### Función 11: Dar de alta una App

Requerirá de los siguientes datos para completarse:

- Código de la app por defecto este será un valor incremental y autogenerado por el sistema.
- Código de usuario al que pertenece.
- Nombre de la app.
- Descripción de la app.
- Código de estatus.
- Visibilidad.
- Token de acceso a la API este será un valor autogenerado.
- Código de categoría a la que pertenece.
- Fecha de registro la cual será la hora del sistema en el momento de creación.
- Fecha de última modificación la cual será la hora del sistema en el momento de creación
- URL de la imagen de la app por defecto hará uso de la imagen por defecto [2](./../img/default.png).

### Función 12: Dar de baja una App

Requerirá de los siguientes datos para completarse:

- Código de la app que se quiere eliminar.

### Función 13: Modificar una App

Para poder modificar una app únicamente se tendrá que adjuntar el código de la app que queremos modificar. Todas las propiedades de esta son modificables exceptuando el propio código, fecha de registro del usuario, así como la fecha de última modificación.

El token de la app no es modificable desde la propia API se tendrá que acceder a la aplicación web con el usuario propietario y realizar el cambio. A su vez únicamente se podrá cambiar el código de usuario al que pertenece la app cuando quien la medique sea un usuario administrador a través de la aplicación web.

### Función 14: Mejorar la categoría de una App

Al igual que con los usuarios nuestra aplicación desarrolla un sistema de categorías para las apps. Para ello el sistema hace uso de la API de PayPal y por defecto el único parámetro que se tienen que proporcionar es el código de la nueva categoría. Por defecto esta acción únicamente está presente en la aplicación web.

Aparte de todas las funciones anteriormente mencionadas el sistema permite funciones de listado que están disponibles a través de la API y que son las empleadas para obtener ciertos datos como los mostrados en el panel de control de la aplicación web, etc.

Ciertos valores que son necesarios para realizar alguna de las acciones anteriores son autogenerados o bien los recoge el sistema automáticamente desde la base de datos, dispositivo del usuario o sesión y no son necesarios.

El uso de la API también genera un registro de peticiones que nos permite llevar un control de las llamadas. Estos registros cuentan con los siguientes campos: código de llamada, código de la app que ha hecho la petición, URL solicitada, método, y fecha y hora de la petición, así como la IP de la máquina desde la cual se realizó la acción.

Cabe destacar que en las funcione de adición, modificación o borrado se comprueba que los valores proporcionados son correctos es decir no hay conflicto con otros ya existentes, así como se comprueba que quien solicita esa acción tiene los permisos necesarios para realizarla.

## Recursos necesarios

Es esta sección detallaremos los equipos informáticos, servicios y aplicaciones que se usarán para el desarrollo de la aplicación, así como los costes, en caso de que existan, de cada uno de ellos.

### Recursos materiales

#### Hardware

Empezaremos por los más importante que es el equipo donde el programa va a desarrollar la aplicación. En un inicio y dada la corta envergadura del proyecto únicamente se hará uso de 2 equipos informáticos. El primero mi ordenador personal de sobremesa, así como sus 2 pantallas ya que considero que proporciona la potencia, versatilidad y rendimiento necesario para el desarrollo del proyecto además como dispositivo de apoyo se hará uso de un MacBook Pro de 2017 en el cual podremos probar la aplicación de escritorio par dispositivos MacOS.

Continuamos por otro de los dispositivos más importantes hoy en día [3](https://www.broadbandsearch.net/blog/mobile-desktop-internet-usage-statistics), el o los dispositivos móviles. Estos nos permitan comprobar el rendimiento, usabilidad, accesibilidad y comportamiento de la aplicación web en estos dispositivos de pantallas y potencia más reducida. Para realizar estas pruebas y al igual que en el caso anterior vamos a hacer uso de los dispositivos personales que tengo a mi disposición que son varios terminales Android como son mi OnePlus 6 y 3 así como otro Samsung Galaxy S8 a su vez y para testear el sitio desde un dispositivo de Apple con su navegador propietario haremos uso de un iPhone 6. Para poder testear la aplicación en dispositivos de pantalla intermedias entre un móvil y un portátil haremos uso de una Tablet Android Samsung Galaxy Tab S2, así como un iPad de 2018 estos también dispositivos personales.

#### Software

En cuanto a las aplicaciones que usaremos para desarrollar y testear nuestra aplicación tenemos que intentaremos primar las aplicaciones de código abierto y gratuitas como son en la categoría de IDEs: Visual Studio Code, Atom o Notepad En nuestro caso haremos uso de Visual Studio Code. En la categoría de navegadores y al tratarse de aplicaciones web tenemos que hacer uso del mayor número de estos para asegurarnos que nuestro sitio funciona correctamente en cuanto a usabilidad, accesibilidad y funcionalidad de cara a todos los usuarios independiente de navegador que usen. Para esto haremos uso de Google Chrome, Opera, IE, Microsoft Edge, Mozilla Firefox, Safari, Chrome entre otros. Nuestra aplicación hace un uso relativamente extenso de las bases de datos relaciones MariaDB para ello tenemos que tener disponible algún software que nos permita trabajar en este sistema de manera externa al terminal del propio servidor para ello haremos uso de MySQL Workbench. Para el testeo de la API haremos uso de la aplicación de escritorio Postman. A su vez y para el desarrollo de la parte del cliente instalaremos en nuestras máquinas de desarrollo vue-cli que nos permite un desarrollo más rápido y eficiente. Para ello instalaremos NodeJS en nuestras máquinas, así como los diferentes módulos como son Bootstrap, vue-cli, así como el procesador de ficheros sass.

#### Servicios contratados

En relación a todo lo anterior tenemos el servidor donde se estará ejecutando nuestra aplicación, bases de datos, contendrá nuestro fichero documentos, etc. Para este equipo haremos uso del cloud computing tan de moda últimamente [4](https://channels.theinnovationenterprise.com/articles/why-cloud-computing-is-so-popular-and-how-it-transforms-business) ya que nos permite un despliegue extremadamente rápido, eficiente y económico de nuestra aplicación en estas etapas iniciales. Como proveedor de este servicio haremos uso de Google Cloud Computing una de las mejores soluciones actualmente en internet gracias a sus precios tan competitivos. El equipo contratado es lo que denominan n1-standard-2 que cuenta con 2 virtual CPUs y 7,5 GB de memoria RAM siendo ésta la que más necesitara nuestra aplicación. Esta máquina contará con las configuraciones requeridas por la aplicación como la apertura de ciertos puertos como el 3306, 80 o 443, así como la instalación de determinados programas o complementos como NodeJS para el desarrollo de la aplicación o MariaDB para el desarrollo de las bases de datos 

Dentro de los recursos y configuraciones más importantes para el desarrollo de nuestra aplicación solo nos queda la contratación de nombre de dominio por el cual los usuarios y sistemas podrán comunicarse con nuestro servidor sin ser por la dirección IP. Este tipo de servicios es muy recomendable ya que de cara al programador es más sencillo apuntar a un nombre de dominio que no a una IP ya que esta última puede variar pudiendo dejar sin servicio a los usuarios y lo más importante de cara al usuario final de nuestra aplicación ya que resulta mucho más fácil recordar un nombre que no un conjunto de números. Para este servicio estableceremos una relación comercial con una empresa propia de Galicia como es Dinahosting que nos proporcionan servicios de hosting con terminación .com como es la que deseamos por un módico precio de unos 15 euros anuales.

### Recursos humanos

Una vez tenemos todos los sistemas y servicios que va a requerir tanto el desarrollo de nuestra aplicación como la propia aplicación solo nos queda el personal humano encargado de desarrollarla, actualizarla y mantenerla operativa los programadores y miembros del equipo de IT. Como ya hemos visto antes este es un proyecto pequeño por lo que el equipo de IT únicamente contará con un único miembro que se encargará de las tareas de codificación, despliegue y mantenimiento de los sistemas informáticos.
