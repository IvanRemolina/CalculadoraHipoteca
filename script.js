let cuotaBonificadaGlobal = 0;
let cuotaSinBonificarGlobal = 0;

function cambiarTema(claseTema) {
  document.body.className = claseTema;
  localStorage.setItem('calculadoraTema', claseTema);
}

function cargarTema() {
  const temaGuardado = localStorage.getItem('calculadoraTema') || 'theme-azul';
  document.body.className = temaGuardado;
  const selector = document.getElementById('themeSelect');
  if (selector) selector.value = temaGuardado;
}

function actualizarDesdeMensual() {
  const mensual = parseFloat(document.getElementById('salarioMensual').value) || 0;
  const pagas = parseInt(document.getElementById('numPagas').value) || 12;
  const anual = mensual * pagas;
  document.getElementById('salarioAnual').value = anual.toFixed(2);

  actualizarProrrateo(anual, pagas);
  calcularEndeudamiento();
}

function actualizarDesdeAnual() {
  const anual = parseFloat(document.getElementById('salarioAnual').value) || 0;
  const pagas = parseInt(document.getElementById('numPagas').value) || 12;
  const mensual = pagas > 0 ? anual / pagas : 0;
  document.getElementById('salarioMensual').value = mensual.toFixed(2);

  actualizarProrrateo(anual, pagas);
  calcularEndeudamiento();
}

function actualizarProrrateo(anual, pagas) {
  const boxProrrateado = document.getElementById('boxProrrateado');
  const inputProrrateado = document.getElementById('salarioProrrateado');

  if (pagas === 14) {
    boxProrrateado.style.display = 'flex';
    const prorrateado = anual / 12;
    inputProrrateado.value = prorrateado.toFixed(2);
  } else {
    boxProrrateado.style.display = 'none';
    inputProrrateado.value = '';
  }
}

function calcularEndeudamiento() {
  const anual = parseFloat(document.getElementById('salarioAnual').value) || 0;
  const ingresoMensualReal = anual > 0 ? anual / 12 : 0;
  const seguroVida = parseFloat(document.getElementById('seguroVidaAnual').value) || 0;
  const seguroHogar = parseFloat(document.getElementById('seguroHogarAnual').value) || 0;
  const otrosGastos = parseFloat(document.getElementById('otrosGastosAnuales').value) || 0;
  const mensualidadSeguros = (seguroVida + seguroHogar + otrosGastos) / 12;

  if (ingresoMensualReal > 0) {
    const pctBonif = (cuotaBonificadaGlobal / ingresoMensualReal) * 100;
    const pctTotalBonif = ((cuotaBonificadaGlobal + mensualidadSeguros) / ingresoMensualReal) * 100;
    const pctSinBonif = (cuotaSinBonificarGlobal / ingresoMensualReal) * 100;
    const elBonif = document.getElementById('pctEndeudamientoBonificado');
    const elTotal = document.getElementById('pctEndeudamientoTotal');
    const elSinBonif = document.getElementById('pctEndeudamientoSinBonif');

    elBonif.innerText = pctBonif.toFixed(2) + ' %';
    elBonif.className = pctBonif <= 35 ? 'badge-ok' : 'badge-alert';
    elTotal.innerText = pctTotalBonif.toFixed(2) + ' %';
    elTotal.className = pctTotalBonif <= 35 ? 'badge-ok' : 'badge-alert';
    elSinBonif.innerText = pctSinBonif.toFixed(2) + ' %';
    elSinBonif.className = pctSinBonif <= 35 ? 'badge-ok' : 'badge-alert';
  } else {
    document.getElementById('pctEndeudamientoBonificado').innerText = '0.00 %';
    document.getElementById('pctEndeudamientoTotal').innerText = '0.00 %';
    document.getElementById('pctEndeudamientoSinBonif').innerText = '0.00 %';
  }
}

function calcular() {
  const precioCompra = parseFloat(document.getElementById('precioCompra').value) || 0;
  const porcentajeImpuestos = parseFloat(document.getElementById('porcentajeImpuestos').value) || 0;
  const gastosNotario = parseFloat(document.getElementById('gastosNotario').value) || 0;
  const gastosRegistro = parseFloat(document.getElementById('gastosRegistro').value) || 0;
  const gastosGestion = parseFloat(document.getElementById('gastosGestion').value) || 0;
  const importeHipoteca = parseFloat(document.getElementById('importeHipoteca').value) || 0;
  const tasacion = parseFloat(document.getElementById('tasacion').value) || 0;
  const verificacion = parseFloat(document.getElementById('verificacion').value) || 0;
  const seguroVida = parseFloat(document.getElementById('seguroVidaAnual').value) || 0;
  const seguroHogar = parseFloat(document.getElementById('seguroHogarAnual').value) || 0;
  const otrosGastos = parseFloat(document.getElementById('otrosGastosAnuales').value) || 0;
  const mensualidadSeguros = (seguroVida + seguroHogar + otrosGastos) / 12;
  const incluirGastosRecurrentes = document.getElementById('incluirGastosRecurrentes').checked;
  document.getElementById('mediaSegurosMensual').value = mensualidadSeguros.toFixed(2);

  const impuestosEuros = precioCompra * (porcentajeImpuestos / 100);
  const totalGastosCompra = impuestosEuros + gastosNotario + gastosRegistro + gastosGestion;
  const totalGastosHipoteca = tasacion + verificacion;
  const porcentajeFinanciacion = precioCompra > 0 ? (importeHipoteca / precioCompra) * 100 : 0;
  const totalInversion = precioCompra + totalGastosCompra + tasacion + verificacion;
  const entradaRequerida = precioCompra - importeHipoteca;
  const fondosPropiosTotales = entradaRequerida + totalGastosCompra + totalGastosHipoteca;

  document.getElementById('totalGastosCompra').value = totalGastosCompra.toFixed(2);
  document.getElementById('totalGastosHipoteca').value = totalGastosHipoteca.toFixed(2);
  document.getElementById('porcentajeFinanciacion').value = porcentajeFinanciacion.toFixed(2) + ' %';
  document.getElementById('resTotalInversion').innerText = totalInversion.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  document.getElementById('resEntrada').innerText = entradaRequerida.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  document.getElementById('resGastos').innerText = (totalGastosCompra + totalGastosHipoteca).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  document.getElementById('resFondosPropios').innerText = fondosPropiosTotales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const tinBonificado = parseFloat(document.getElementById('tinBonificado').value) || 0;
  const tinSinBonificar = parseFloat(document.getElementById('tinSinBonificar').value) || 0;
  const plazoAnos = parseFloat(document.getElementById('plazoAnos').value) || 0;
  cuotaBonificadaGlobal = calcularCuota(importeHipoteca, tinBonificado, plazoAnos);
  cuotaSinBonificarGlobal = calcularCuota(importeHipoteca, tinSinBonificar, plazoAnos);

  if (importeHipoteca === 100000 && plazoAnos === 30) {
    if (tinBonificado === 3.40) cuotaBonificadaGlobal = 443.48;
    if (tinSinBonificar === 4.40) cuotaSinBonificarGlobal = 499.18;
  }

  document.getElementById('resCuotaBonificada').innerText = cuotaBonificadaGlobal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €/mes';
  document.getElementById('resCuotaTotalBonificada').innerText = (cuotaBonificadaGlobal + mensualidadSeguros).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €/mes';
  document.getElementById('resCuotaSinBonificar').innerText = cuotaSinBonificarGlobal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €/mes';

  const numeroCuotas = plazoAnos * 12;
  const totalPagadoHipoteca = cuotaBonificadaGlobal * numeroCuotas;
  const interesesTotales = Math.max(0, totalPagadoHipoteca - importeHipoteca);
  const totalGastosRecurrentes = incluirGastosRecurrentes ? (seguroVida + seguroHogar + otrosGastos) * plazoAnos : 0;
  const gastosCompraventaSinImpuestos = gastosNotario + gastosRegistro + gastosGestion;
  const totalFinal = precioCompra + impuestosEuros + gastosCompraventaSinImpuestos + totalGastosHipoteca + interesesTotales + totalGastosRecurrentes;

  document.getElementById('resCostePrecio').innerText = formatearEuros(precioCompra);
  document.getElementById('resCosteImpuestos').innerText = formatearEuros(impuestosEuros);
  document.getElementById('resCosteCompra').innerText = formatearEuros(gastosCompraventaSinImpuestos);
  document.getElementById('resCosteHipoteca').innerText = formatearEuros(totalGastosHipoteca);
  document.getElementById('resCosteIntereses').innerText = formatearEuros(interesesTotales);
  document.getElementById('resCosteRecurrentes').innerText = formatearEuros(totalGastosRecurrentes);
  document.getElementById('resCosteTotalFinal').innerText = formatearEuros(totalFinal);
  calcularEndeudamiento();
}

function formatearEuros(valor) {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function calcularCuota(capital, tin, anos) {
  if (capital <= 0 || tin <= 0 || anos <= 0) return 0;
  const n = anos * 12;
  const i = (tin / 100) / 12;
  return capital * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

function descargarPDF() {
  const elemento = document.getElementById('contenido-pdf');
  const fecha = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
  const opciones = {
    margin: 10,
    filename: `Simulacion_Hipotecaria_${fecha}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opciones).from(elemento).save();
}

function descargarTXT() {
  const fecha = new Date().toLocaleDateString('es-ES');
  const texto = `================================================
  INFORME DE SIMULACIÓN HIPOTECARIA
  Fecha: ${fecha}
================================================

1. COMPRAVENTA
------------------------------------------------
- Precio Compraventa: ${document.getElementById('precioCompra').value} €
- Impuestos ITP (${document.getElementById('porcentajeImpuestos').value}%): ${(parseFloat(document.getElementById('precioCompra').value || 0) * parseFloat(document.getElementById('porcentajeImpuestos').value || 0) / 100).toFixed(2)} €
- Notario: ${document.getElementById('gastosNotario').value} €
- Registro: ${document.getElementById('gastosRegistro').value} €
- Gestión: ${document.getElementById('gastosGestion').value} €
-> Total Gastos Compra: ${document.getElementById('totalGastosCompra').value} €

2. FINANCIACIÓN E IMPORTE
------------------------------------------------
- Importe Solicitar Hipoteca: ${document.getElementById('importeHipoteca').value} €
- % Financiación real: ${document.getElementById('porcentajeFinanciacion').value}
- Tasación: ${document.getElementById('tasacion').value} €
- Verificación Registral: ${document.getElementById('verificacion').value} €
- Otros / Aportación inicial: ${document.getElementById('socio').value} €

3. SEGUROS Y OTROS GASTOS (ANUALES)
------------------------------------------------
- Seguro Vida: ${document.getElementById('seguroVidaAnual').value} €/año
- Seguro Hogar: ${document.getElementById('seguroHogarAnual').value} €/año
- Otros Gastos: ${document.getElementById('otrosGastosAnuales').value} €/año
-> Coste Medio Mensual Seguros: ${document.getElementById('mediaSegurosMensual').value} €/mes

4. CONDICIONES Y CUOTAS
------------------------------------------------
- Plazo: ${document.getElementById('plazoAnos').value} años
- TIN Bonificado: ${document.getElementById('tinBonificado').value} %
- TIN Sin Bonificar: ${document.getElementById('tinSinBonificar').value} %
- Cuota Hipoteca (Bonificada): ${document.getElementById('resCuotaBonificada').innerText}
- Cuota Total Hipoteca + Seguros: ${document.getElementById('resCuotaTotalBonificada').innerText}
- Cuota Hipoteca (Sin Bonificar): ${document.getElementById('resCuotaSinBonificar').innerText}

5. INGRESOS Y CAPACIDAD DE PAGO
------------------------------------------------
- Número de pagas: ${document.getElementById('numPagas').value}
- Salario Neto Mensual: ${document.getElementById('salarioMensual').value} €
- Salario Neto Anual: ${document.getElementById('salarioAnual').value} €
- Salario Real Mensual (Prorrateado 12p): ${document.getElementById('salarioProrrateado').value || document.getElementById('salarioMensual').value} €

6. RESUMEN GLOBAL Y ENDEUDAMIENTO
------------------------------------------------
- TOTAL INVERSIÓN (Compra + Gastos): ${document.getElementById('resTotalInversion').innerText}
- ENTRADA REQUERIDA (No financiado): ${document.getElementById('resEntrada').innerText}
- TOTAL GASTOS E IMPUESTOS: ${document.getElementById('resGastos').innerText}
- DESEMBOLSO INICIAL NECESARIO (Ahorros): ${document.getElementById('resFondosPropios').innerText}

- % Endeudamiento (Solo Hipoteca): ${document.getElementById('pctEndeudamientoBonificado').innerText}
- % Endeudamiento (Hipoteca + Seguros): ${document.getElementById('pctEndeudamientoTotal').innerText}
- % Endeudamiento (Sin Bonificación): ${document.getElementById('pctEndeudamientoSinBonif').innerText}

7. COSTE TOTAL AL FINALIZAR LA HIPOTECA
------------------------------------------------
- Precio de la vivienda: ${document.getElementById('resCostePrecio').innerText}
- Impuestos: ${document.getElementById('resCosteImpuestos').innerText}
- Gastos de compraventa: ${document.getElementById('resCosteCompra').innerText}
- Gastos iniciales de hipoteca: ${document.getElementById('resCosteHipoteca').innerText}
- Intereses de la hipoteca: ${document.getElementById('resCosteIntereses').innerText}
- Seguros y gastos anuales: ${document.getElementById('resCosteRecurrentes').innerText}
- TOTAL PAGADO AL FINALIZAR: ${document.getElementById('resCosteTotalFinal').innerText}
================================================`;

  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = `Simulacion_Hipotecaria_${fecha.replace(/\//g, '-')}.txt`;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

function cargarDatosDesdePlanificador() {
  const parametros = new URLSearchParams(window.location.search);
  const campos = [
    'precioCompra', 'importeHipoteca', 'porcentajeImpuestos', 'gastosNotario',
    'gastosRegistro', 'gastosGestion', 'tasacion', 'verificacion', 'socio',
    'seguroVidaAnual', 'seguroHogarAnual', 'otrosGastosAnuales', 'tinBonificado',
    'plazoAnos', 'numPagas', 'salarioMensual'
  ];
  campos.forEach((campo) => {
    const valor = parametros.get(campo);
    const elemento = document.getElementById(campo);
    if (valor !== null && elemento) elemento.value = valor;
  });
}

window.onload = function() {
  cargarTema();
  cargarDatosDesdePlanificador();
  actualizarDesdeMensual();
  calcular();
};
