# Diseño

## Base de datos

Toda aplicación necesita datos para poder funcionar y la nuestra no va a ser una excepción ya que recopiló datos de uso de las aplicaciones, sesiones de los usuarios, categorías, etc. Todos estos datos necesitan ser almacenados y procesados para poder ser mostrados al usuario de la mejor manera posible para ello haremos uso de las bases de datos en concreto haremos uso del sistema de gestión de datos MariaDB. Hemos elegido este sistema y no otro ya que nuestra aplicación contará con una gran cantidad de tablas y relaciones entre ellas así que necesitábamos hacer uso de un sistema de bases de dato relacionales que nos permita obtener la información completa a pesar de estar en diferentes tablas. Dentro de todos los sistemas de gestión de bases de datos relacionales que existen hemos optado por MariaDB dada su mejor soporte a motores, así como su mejor rendimiento [5](https://www.eversql.com/mariadb-vs-mysql/) y amplias funcionalidades aparte de que como ya hemos visto en apartados anteriores intentaremos priorizar el uso de software libre y este MariaDB se distribuye bajo una licencia GPL.

Una vez ya tenemos escogido el sistema de base de datos para nuestra aplicación tenemos que ver que tablas tenemos que crear, que datos almacenará cada una de ellas y las relaciones entre estas.

## Modelo entidad relación

[modeloER](doc/img/modeloER.png)

## Modelo relacional

[modeloRelacional](doc/img/modeloRelacional.png)

## Análisis

En las imágenes anteriores se puede ver el modelo relacional y modelo entidad relación de nuestra base de datos. En ellas podemos apreciar la existencia de 12 tablas, así como la existencia de relaciones entre ellas, todas de tipo 1-N.

Analizando un poco las tablas tenemos una que destaca en especial la tabla de usuarios. Esta tabla como se puede esperar contendrá todos los usuarios del sistema. De estos usuarios tenemos que almacenar información como **code** siendo clave primaria de la tabla, almacenamos el código de la aplicación que creó el usuario **appCode**, **statusCode** que determinará si un usuario puede hacer uso o no de los servicios, **visibility** que indicará si otros usuarios pueden ver ese perfil así como los datos relacionados con este, **diff**, **user** que vendría a ser el nick del usuario, **password** sería la contraseña la cual estará encriptada con la función hash bcrypt, **email**, **categoryCode** que sería el código de usuario ya que nuestra aplicación contendrá diferentes categorías como administrador o usuarios premium, **name** que vendría a ser el nombre de usuario, **surname** apellidos del usuario, **registrationDate** fecha de registro, **lastUpdate** que vendría a ser la fecha de la última modificación del usuario así como el día de su cumpleaños almacenado en **birthDate** así como la URL de la imagen de perfil del usuario **imageURL**. Aparte también tiene un conjunto formado por **recoverURL** y **recoverURLCode** que serían los campos que se usarían cuando el usuario quisiese recuperar su cuenta porque olvidó de la contraseña.

Esta tabla está en relación con **userCategories** que contiene las categorías de los usuarios de las cuales almacenamos código de categoría el cual al igual que el code de la tabla de usuarios sería la clave primaria de la tabla aparte almacenamos un nombre de categoría y descripción, así como su precio y las apps máximas que puede tener creadas.

Luego tenemos que también está en relación con la tabla de apps, esta tabla contiene todas las apps que se crearon. Esta tabla contiene al igual que toda las anteriores un código de la app que es la clave primaria de la tabla, así como el código del usuario que creó la aplicación y el cual tiene control sobre ella también se almacena el token el cual le permite a la aplicación hacer uso de la API aparte del nombre y descripción de la app. También contiene el **statusCode** el cual determina si esa app puede hacer uso de los servicios proporcionados por el sistema, **visibility** el cual determina si otros usuarios tienen acceso a ver los datos de la app, **categoryCode** el cual determinará la categoría de la app. Ya para terminar la tabla contendrá la URL de la imagen de la app que estará almacenada en el campo **imageURL,** así como la fecha de registro y última actualización de la app. Luego tenemos que esta tiene una relación con la tabla de **appCategories** esto es porque las apps pertenecen a una categoría que les permiten hacer ciertas acciones, así como un sistema que controla las peticiones máximas que pueden hacer permitiendo así monetizar el uso de la API.

La tabla de **appCategories** contiene un código de categoría, nombre de la categoría, descripción y precio aparte del número máximo de peticiones diarias que puede hacer la app a nuestra API.

En relación con esta tabla tenemos la tabla de **apiCalls**, esta tabla lleva un registro de las peticiones que hace cada app a la API permitiendo llevar un control más preciso del sistema. Esta contiene un código que sería la clave primaria de la tabla que sería el número con el cual se registró la llamada, **appCode** que sería el código de la app que hizo la llamada, así como la URL solicitada, método empleado, así como la IP de la máquina que realizó la petición y fecha en la cual se realizó.

Aparte de estas tablas tenemos otras que si bien son algo más sencillas son las más importantes ya que la aplicación se basa en registrar las aplicaciones que usa el usuario en su equipo, así como cuanto tiempo y todos estos datos se almacenan en la tabla de **trackerLogs**.

Esta tabla contiene un código de registro siendo este la clave primaria de la tabla, así como el código de usuario al que pertenece cada registro y el código de la aplicación registrada luego tenemos que también almacena la fecha de inicio de la aplicación esto equivale a cuando el usuario empezó a usar la aplicación en su equipo, así como la fecha cuando dejo de usarla bien porque el cerro o porque cambió de aplicación. Como diferencia entre estos 2 campos tenemos el tiempo en segundos que uso cada aplicación el usuario.

Hemos visto que la tabla de trackerLogs tiene una relación con la tabla de **applications** esta tabla contiene un registro con las aplicaciones que los usuarios han usado así la categoría a la que pertenecen cada una. Más en profundidad contiene al igual que todas las tablas del sistema un campo code que sería la clave primaria de la tabla un campo **userCode** para relacionar cada aplicación con el usuario al que pertenece aparte de los campos **category** y **app** que indican a qué categoría equivale cada aplicación así como el nombre de la aplicación aparte y como medida de control tenemos que hay un campo **registrationDate** que nos proporciona la fecha cuando fue registrada esa aplicación en el sistema así como el campo **lastUpdate** que registra la fecha de la última modificación.

Luego y si bien no cumple una función extremadamente necesaria tenemos la última tabla **sessionLogs** esta tabla nos proporciona un registro de todos los inicios de sesión y cierre de sesión en el sistema, así como el dispositivo desde donde se realizó la acción, el usuario que la realizó gracias a su código de usuario, así como la fecha cuando se realizó la acción.

Como hemos visto en la tabla de usuarios y app estas contienen un campo **status**, este campo indica al sistema si estos recursos están activados y tienen acceso al sistema. Para llevar un mejor control de los status estos están en relación con la tabla **status** mediante un código de estatus. Esta tabla contiene un campo code que sería el campo que conforma la clave primaria, así como los campos **name** y **description** que proporcionan el nombre del estado, así como una pequeña descripción.

La tabla **appCalls** si bien no es la más útil sí que nos permite llevar a cabo un control de quien accede a nuestra página web, si bien está haciendo uso de sistemas de seguimiento y control como Google Analytics esta tabla también nos permite obtener alguna información extra por nuestra cuenta. Esta tabla está conformada por los siguientes campos: **code** que sería el código de petición y clave primaria de la tabla, **IP** de la máquina desde la cual se realizó la petición, URL solicitada, **method** que nos indicará el método de petición empleado, así como la fecha en cual se realizó.

Como última adición durante el desarrollo tenemos **posts**, Estos anuncios están almacenados en la base de datos en la tabla **posts**. Esta tabla es formada al igual que todas por un campo **code** que vendría a ser la clave primaria de tabla, así como por **userCode** que almacenará el código del usuario creador del post, así como los campos **body** y **title** que vendría a ser el contenido y el título de la noticia. Ya para terminar tendríamos un campo fecha que almacenará el momento del registro, así como el código de categoría al que pertenece y que está en relación con la tabla de **postCateogries**.

Esta sería la última tabla de nuestra base de datos y almacena las categorías a las que puede pertenecer un post. Esta tabla está formada por un código de categoría siendo este la clave primaria de la tabla y por los campos **name** y **description** que proporcionan el nombre de la categoría, así como una breve descripción de la misma.

Hemos visto a qué equivale cada campo de las diferentes tablas de nuestra base de datos, pero no hemos visto los tipos de datos que estos usan. Como resumen tenemos que los datos de tipo fecha hacen uso de timestamp (yyyy-MM-dd HH:mm:ss) que nos permiten almacenar tanto el día como la hora aparte en la mayoría de casos donde se hace uso de este tipo de datos tiene un valor por de defecto de currenttimestamp.

Para los campos code de las tablas los cuales son los campos que forman la clave primaria tenemos que estos son de tipo int con un máximo de 11 dígitos, así como no permiten nulos y por defecto son auto incrementales.

Para los campos de precios hacemos uso de float como dato ya que nos permite tener una gran precisión con números decimales.

Para los campos de tipo texto como nombres, descripciones y demás haremos uso de varchar con un tamaño máximo de 250.

## Mockups

Hoy en día es muy importante el diseño de una aplicación ya que, aunque la aplicación funcione muy bien si el diseño no resultaba adecuado a las condiciones donde se va usar la aplicación, usuarios que van a usarla, etc. no valdrá de nada. Para solucionar este problema haremos uso de las recomendaciones que nos proporcionan numerosos profesionales y medios

- [https://es.wikipedia.org/wiki/Mockup](https://es.wikipedia.org/wiki/Mockup)
- [https://ingenieriadesoftware.es/generacion-interfaces-usuario-desde-mockups-inteligencia-artificial/](https://ingenieriadesoftware.es/generacion-interfaces-usuario-desde-mockups-inteligencia-artificial/)
- [http://blog.intelligenia.com/2017/10/requisitos-mediante-mockups.html](http://blog.intelligenia.com/2017/10/requisitos-mediante-mockups.html)

Los cuales nos recomiendan realizar una serie de diseños preliminar a la codificación, muy simplificados que nos permitan visualizar la posición de los componentes en nuestra aplicación, estos se denominan mockups.

Los diseños que se muestran están realizados teniendo como base un dispositivo móvil ya que según las recomendaciones actuales tenemos que priorizar el desarrollo de las interfaces para estos dispositivos a su vez ya que haremos uso de Bootstrap estos diseños están pensados para ser iguales tanto para la versión móvil como para la versión de navegador de escritorio por lo que únicamente se mostrarán las versiones móviles ya que las únicas diferencias que pueden existir residen en la posición de los diferentes elementos.

### Diseño general

Todas las páginas de nuestro sitio web que no requieran de un inicio de sesión es decir a las que todo el mundo sean usuarios registrados o no tienen acceso mantienen un conjunto de elementos y características comunes entre ellas. Estas son que el contenido de los diferentes sitios este contenido dentro de un div (2) el cual a su vez está comprendido dentro de otro div más grande y sobre el cual se mostrara el fondo que serán los colores de la página (1). Dentro del div (2) que contendrá las diferentes opciones, formularios, textos y demás para las diferentes localizaciones de nuestro sitio también tenemos elementos comunes como son el uso del logo de la aplicación, así como el nombre como cabecera para el bloque.

[img_index](doc/img/index.png)

En cuanto a las páginas que requieren de un inicio de sesión tenemos que todas tienen una barra de navegación la cual muestra el botón que permite abrir y cerrar el menú lateral que se encontrara situado la izquierda de la página, así como el nombre de la página. En lo que abarca al menú tenemos que este contendrá el logo de la página, así como un conjunto de submenús que permitirán al usuario recorrer nuestro sitio web. Este menú se adaptará al tamaño de la página. Dentro de estas páginas los diseños que se mostrarán estarán contenido dentro de un bloque del bloque de contenido manteniendo estáticos la barra de navegación como el menú lateral.

[img_menu](doc/img/menu.png)

### Index

Aquí se muestra la página por defecto de la aplicación cuando accedemos desde un navegador a la URL. Dentro del bloque central vemos que se mostrará el logo de la aplicación, así como el nombre y un slogan. Justo debajo de estos elementos tenemos que se muestran una serie de botones los cuales se tiene pensado que enlacen con la documentación de aplicación, así como con la página de login que veremos más adelante. Justo debajo tendremos una sección de novedades donde se mostrarán las últimas noticias de nuestra aplicación en forma de pequeño resumen. Justo debajo tendríamos unos iconos que representan la esencia de la aplicación, así como un footer que incluiría información extra sobre el autor y licencia.

[img_index](doc/img/index.png)

### Inicio de sesión (Login)

En este diseño vamos a mostrar la página que los usuarios verán cuando intenten iniciar sesión en nuestra aplicación. Manteniendo la coherencia entre las diferentes páginas del sitio esta también tiene un div con el contenido de la aplicación sobre otro div que contendrá en fondo. En este bloque principal tenemos a su vez y al igual que los otros lugares del sitio el logo de la aplicación, así como el nombre de la misma. Justo debajo tendríamos el formulario de inicio de sesión con las credenciales que se decidan implementar, así como el botón de subir del formulario. A continuación, tendríamos el botón que nos mostraría la página para recuperar la contraseña en caso de que no nos acordemos, así como otro enlace a la página para registrarse en caso de que no se tenga cuenta. Justo debajo tenemos 2 links que en un principio se tiene pensado que muestren la política de privacidad, así como los términos y condiciones que aceptan los usuarios al hacer uso de nuestros servicios. En caso de que ocurra algún error se mostrar una alerta indicando el error que se produjo.

[img_login](doc/img/login.png)

### Recuperación de cuenta 1 (forgot)

Vamos a revisar la página de que permite a los usuarios recuperar su cuenta. Este diseño es el más básico de todos los que dispone nuestra página ya que solo incluye a parte de lo típico que es el bloque de contenido con el logo y nombre de la aplicación sobre un div que contiene el fondo, un formulario con un campo y un botón de subir, así como los links a la política de privacidad y términos y condiciones y un botón para acceder al formulario para crear una cuenta.

[img_forgot](doc/img/forgot.png)

### Recuperación de cuenta 2 (recover)

Este diseño será el que disfrutará el usuario cuando reinicie la contraseña de su cuenta en caso de que la olvidara. En este disponemos de un formulario con 4 campos que serán las credenciales que se requerirán para reiniciar la contraseña de la cuenta, así como un botón de envió de formulario para llevar a cabo la acción. Aparte de estos elementos tenemos los ya típicos de la página y que están explicados en modelos anteriores.

[img_recover](doc/img/recover.png)

### Creación de cuenta

Aquí veremos el diseño que tendrá la página que permitirá al usuario crear una cuenta en el sistema. En este diseño y teniendo como base el diseño típico de nuestro sitio tenemos un formulario con el conjunto de campos a cubrir que serán necesarios para crear el usuario, así como el botón que permite el envío de este. Justo debajo tendríamos un texto explicativo de la siguiente opción que el un inicio es la de ir a la página de inicio de sesión para ello disponemos de un botón. Justo debajo de este tendríamos el conjunto de link que harán referencia a la política de privacidad, así como los términos y condiciones de uso. [img_create](doc/img/create.png)

### Perfil o App

Esta vista contiene lo que verá el usuario cuando acceda a su perfil o al de cualquier otro usuario o app. En este diseño podemos ver que dentro de la página del perfil se verá una foto del recurso, así como los datos del mismo como nombre, fecha de registro cumpleaños y demás a su vez justo debajo de los datos estarían las opciones que podría hacer dar de baja el recurso o editarlo. Justo debajo tenemos un conjunto de gráficos que mostrarán diferentes datos del usuario o app como tiempo de uso, registros, tiempo diario y demás. [img_profile](doc/img/profile.png)

### Data 1

Los diferentes datos que muestre la aplicación a partir de los datos recopilados se tienen que mostrar de alguna manera. Para solucionar este problema en un principio haremos uso de estos 2 diseños que se muestran a continuación. El primero sería el empleado para ver datos de una manera masiva como por ejemplo el registro de aplicaciones o de logs. En estos casos haríamos uso de tablas que nos permitirían mostrar todos los registros. Para dar facilidades a estas vistas las tablas tendrán un tamaño personalizable (selector situado en la parte superior izquierda) así como un sistema de paginación u búsqueda por campo que permitirá al usuario visualizar los datos de una manera más cómodo. Además de estas medidas se pueden organizar las tablas según los datos de las cabeceras. Luego estas vistas proporcionarán a los usuarios diferentes funcionalidades como la opción de borrar, añadir o editar los diferentes registros. Para estas acciones se hará uso de un pop que ocupará la pantalla y donde se permitirá al usuario la introducción de datos, así como la confirmación de la acción.

[img_data_1](doc/img/data.png)

### Data 2

Esta es otra vista que usaremos para mostrar los datos a los usuarios. Esta vista es una mucho más trabajada que mostrará datos en forma de gráficos, tanto de líneas, barras, pociones, etc. así como mediante números y porcentajes que resumirá los datos de manera que resulte sencilla de ver. En la primera sección justo después de la barra de navegación tenemos un conjunto de grupos (cards) que contendrán datos en forma de resumen de uso por ejemplo el número de aplicaciones del usuario o el número de logs que ha realizado el día actual entre otros muchos. A continuación, en otro bloque tenemos los gráficos estos darán información mucho más extendida en el tiempo y proporcionarán al usuario la capacidad de interactuar con ella de una manera más sencilla pudiendo ajustar las gráficas cambiar los colores y demás. Estos gráficos además y con el fin de resultar más amigables se podrán ocultar pensando en las pequeñas pantallas de los dispositivos móviles.

[img_data_2](doc/img/dashboard.png)