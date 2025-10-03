# Tareas CC5002

## Estructura Tarea 2:
- `adoption/`: Contiene la aplicación de flask.
- `database/`: Archivos relacionados a la base de datos.
  - `database/db.py`: Genera la sesión para leer y editar la BD.
  - `database/queries.py`; Contine las consultas relacionadas al uso de la BD de la aplicación.
  - `database/tables.py`: Establece los modelos de las tablas.
  - `database/region-comuna.sql`: Carga los datos de región y comuna en la BD.
  - `database/tarea2.sql`: Crea el esquema y la tabla de la BD usada.
- `static/css`: Contiene los archivo css.
- `static/js`: Contiene los archivos javascript.
- `static/templates`: Contiene los templates de HTML que usan Jinja2.
- `static/images`: Contiene las imagenes usadas en la página web.
- `utils/form.py`: Procesa el formulario rellenado por el usuario, validando y estableciendo el formato de la entrada.
- `app.py`: Configuración de rutas y aplicación web.
## Consideraciones Tarea 2:


---

**Estructura Tarea 1:**
- `html/index.html`: Portada de la página con el menú, mensaje de bienvenida y listado con información de los ultimos 5 avisos.
- `html/add.html`: Formulario de adopción con los datos pedidos y validaciones correspondientes.
- `html/posts.html`: El listado de 5 avisos de adopción y página con mayor información asociada.
- `html/statistics.html`: Ilustra los 3 gráficos y contiene el enlace pedido.
- `js/avisos.js`: Maneja las validaciones, eventos e inicialización del formulario de adopción.
- `js/region_comuna.js`: Genera las comunas asociadas a la región seleccionada en el formulario de agregar aviso.
- `js/list_posts.js`: Genera la página con información detallada sobre el aviso de adopción, con la posiibilidad de visualizar fotos con zoom.
- `imgs`: Carpeta de todas las fotos usadas, en los tamaños correspondientes.

**Consideraciones Tarea 1:**
- En las páginas donde pide filas/listado de información de los avisos de adopción, use flex para organizar en cajitas la información de cada fila, mejorando el elemento visual en comparación a una tabla como tal.
- Decidí incluir la barra de navegación en todas las páginas para que sea más uniforme el flujo. En casos donde pedía botones o alguna manera de volver a cierta página, si la opción estaba presente en la barra de navegación, se omitió para evitar redundancia. Por ejemplo, en el listado de adopciones, al hacer clic para ver el detalle pide: "un botón o enlace que permite volver al listado de avisos de adopción y otro que permite volver a la portada". Sin embargo, el botón para volver al listado ya está en la barra y no es razonable ponerlo 2 veces.
- Para el tamaño de las imágenes usé un resizer que encontré en Google.
- Para ilustrar los avisos de adopción de manera dinámica (en el listado de avisos de adopción), al hacer clic en uno para que abra el detalle de este, hice un objeto (JSON) con la información de cada aviso y genere el HTML con JS, pues de lo opuesto resultaría mucho más largo.
- Para pre rellenar la hora en el formulario, al usar Date.now() retornaba la hora de la zona horaria UTC que está 4 horas adelantada a la actual en Chile, por ende simplemente le reste una hora para simular el rellenado con 3 horas después. De manera similar, se considera la diferencia de 4 horas al validar la hora de entrega.