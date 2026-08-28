# CalculadoraHipoteca

Calculadora personal para simular los gastos de compra de una vivienda, la cuota hipotecaria y el nivel de endeudamiento.

## Archivos

- `index.html`: estructura de la calculadora.
- `styles.css`: estilos y temas visuales.
- `script.js`: cálculos y acciones de descarga.
- `planificador.html`: cálculo inverso del precio máximo según ahorros e ingresos.
- `planificador.js`: lógica del planificador.

El planificador permite fijar manualmente el porcentaje financiado o activar el cálculo automático. En modo automático prueba porcentajes entre el 50% y el 95% y elige el que permite el mayor precio de vivienda compatible con los ahorros y la cuota máxima. El botón **Usar resultado en calculadora principal** transfiere el escenario mediante la URL.

## Publicarla en la web con GitHub Pages

1. Sube los cambios al repositorio de GitHub en la rama `main`.
2. En GitHub, abre **Settings** del repositorio.
3. En el menú lateral, entra en **Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)` y pulsa **Save**.
6. Espera unos instantes. GitHub mostrará la URL pública en esa misma pantalla.

La dirección tendrá este formato:

`https://ivanremolina.github.io/CalculadoraHipoteca/`

Como el archivo principal se llama `index.html`, GitHub Pages lo abrirá automáticamente. La calculadora funciona en el navegador; solo necesita conexión a Internet para cargar la librería de generación de PDF.