function leerNumero(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function formatearEuros(valor) {
  return valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function calcularCuota(capital, tin, anos) {
  if (capital <= 0 || tin <= 0 || anos <= 0) return 0;
  const numeroCuotas = anos * 12;
  const interesMensual = (tin / 100) / 12;
  return capital * (interesMensual * Math.pow(1 + interesMensual, numeroCuotas)) /
    (Math.pow(1 + interesMensual, numeroCuotas) - 1);
}

function calcularCapitalDesdeCuota(cuotaMaxima, tin, anos) {
  if (cuotaMaxima <= 0 || anos <= 0) return 0;
  if (tin <= 0) return cuotaMaxima * anos * 12;
  const numeroCuotas = anos * 12;
  const interesMensual = (tin / 100) / 12;
  return cuotaMaxima * (1 - Math.pow(1 + interesMensual, -numeroCuotas)) / interesMensual;
}

function cambiarModoFinanciacion() {
  const automatica = document.getElementById('financiacionAutomatica').checked;
  document.getElementById('porcentajeFinanciacion').disabled = automatica;
  calcularPlanificacion();
}

function obtenerPorcentajeFinanciacion() {
  const porcentaje = Math.min(100, Math.max(1, leerNumero('porcentajeFinanciacion')));
  if (!document.getElementById('financiacionAutomatica').checked) return porcentaje;

  let mejorPorcentaje = porcentaje;
  let mejorPrecio = 0;
  for (let candidato = 50; candidato <= 95; candidato += 0.1) {
    const precio = calcularPrecioMaximo(candidato / 100, false);
    if (precio > mejorPrecio) {
      mejorPrecio = precio;
      mejorPorcentaje = candidato;
    }
  }
  document.getElementById('porcentajeFinanciacion').value = mejorPorcentaje.toFixed(1);
  return mejorPorcentaje;
}

function calcularPrecioMaximo(porcentajeFinanciacion, incluirResultado) {
  const ahorroDisponible = Math.max(0, leerNumero('ahorroActual') - leerNumero('ahorroReserva'));
  const porcentajeImpuestos = Math.max(0, leerNumero('porcentajeImpuestos')) / 100;
  const gastosFijos = leerNumero('gastosNotario') + leerNumero('gastosRegistro') + leerNumero('gastosGestion') + leerNumero('tasacion') + leerNumero('verificacion');
  const salarioMensual = Math.max(0, leerNumero('salarioMensual'));
  const numeroPagas = Math.max(1, leerNumero('numeroPagas'));
  const esfuerzo = Math.max(0, leerNumero('porcentajeEsfuerzo')) / 100;
  const tin = Math.max(0, leerNumero('tinBonificado'));
  const plazoAnos = Math.max(0, leerNumero('plazoAnos'));
  const recurrentesMensuales = (leerNumero('seguroVidaAnual') + leerNumero('seguroHogarAnual') + leerNumero('otrosGastosAnuales')) / 12;
  const ingresoMensualReal = salarioMensual * numeroPagas / 12;
  const cuotaMaxima = Math.max(0, ingresoMensualReal * esfuerzo - recurrentesMensuales);
  const capitalMaximo = calcularCapitalDesdeCuota(cuotaMaxima, tin, plazoAnos);
  const limitePorCuota = capitalMaximo / porcentajeFinanciacion;
  const porcentajeNecesario = (1 - porcentajeFinanciacion) + porcentajeImpuestos;
  const limitePorAhorros = porcentajeNecesario > 0 ? Math.max(0, (ahorroDisponible - gastosFijos) / porcentajeNecesario) : 0;
  const precio = Math.min(limitePorAhorros, limitePorCuota);
  if (incluirResultado) return { precio, limitePorAhorros, limitePorCuota };
  return precio;
}

function calcularPlanificacion() {
  const porcentajeFinanciacion = obtenerPorcentajeFinanciacion() / 100;
  const porcentajeImpuestos = Math.max(0, leerNumero('porcentajeImpuestos')) / 100;
  const gastosNotario = Math.max(0, leerNumero('gastosNotario'));
  const gastosRegistro = Math.max(0, leerNumero('gastosRegistro'));
  const gastosGestion = Math.max(0, leerNumero('gastosGestion'));
  const tasacion = Math.max(0, leerNumero('tasacion'));
  const verificacion = Math.max(0, leerNumero('verificacion'));
  const salarioMensual = Math.max(0, leerNumero('salarioMensual'));
  const numeroPagas = Math.max(1, leerNumero('numeroPagas'));
  const porcentajeEsfuerzo = Math.max(0, leerNumero('porcentajeEsfuerzo')) / 100;
  const tin = Math.max(0, leerNumero('tinBonificado'));
  const plazoAnos = Math.max(0, leerNumero('plazoAnos'));
  const gastosCompra = gastosNotario + gastosRegistro + gastosGestion;
  const gastosHipoteca = tasacion + verificacion;
  const gastosRecurrentesAnuales = leerNumero('seguroVidaAnual') + leerNumero('seguroHogarAnual') + leerNumero('otrosGastosAnuales');

  const ingresoMensualReal = salarioMensual * numeroPagas / 12;
  const segurosMensuales = gastosRecurrentesAnuales / 12;
  const limites = calcularPrecioMaximo(porcentajeFinanciacion, true);
  const limitePorAhorros = limites.limitePorAhorros;
  const limitePorCuota = limites.limitePorCuota;
  const precioMaximo = limites.precio;
  const hipoteca = precioMaximo * porcentajeFinanciacion;
  const costeFijoInicial = gastosCompra + gastosHipoteca;
  const entradaYGastos = precioMaximo - hipoteca + precioMaximo * porcentajeImpuestos + costeFijoInicial;
  const cuota = calcularCuota(hipoteca, tin, plazoAnos);
  const esfuerzoTotal = ingresoMensualReal > 0 ? ((cuota + segurosMensuales) / ingresoMensualReal) * 100 : 0;
  const limiteActivo = limitePorAhorros <= limitePorCuota ? 'tus ahorros' : 'el porcentaje de sueldo que quieres dedicar';

  document.getElementById('resAhorroDisponible').innerText = formatearEuros(Math.max(0, leerNumero('ahorroActual') - leerNumero('ahorroReserva')));
  document.getElementById('resGastosIniciales').innerText = formatearEuros(costeFijoInicial);
  document.getElementById('resLimiteAhorros').innerText = formatearEuros(limitePorAhorros);
  document.getElementById('resLimiteCuota').innerText = formatearEuros(limitePorCuota);
  document.getElementById('resPrecioMaximo').innerText = formatearEuros(precioMaximo);
  document.getElementById('resHipoteca').innerText = formatearEuros(hipoteca);
  document.getElementById('resAportacion').innerText = formatearEuros(entradaYGastos);
  document.getElementById('resCuota').innerText = formatearEuros(cuota) + '/mes';
  document.getElementById('resSeguros').innerText = formatearEuros(segurosMensuales) + '/mes';
  document.getElementById('resEsfuerzo').innerText = esfuerzoTotal.toFixed(2) + ' %';
  document.getElementById('resExplicacion').innerText = 'El límite lo marca ' + limiteActivo + '. Es una estimación y no sustituye el estudio del banco.';
  document.getElementById('usarEnPrincipal').href = 'index.html?' + new URLSearchParams({
    precioCompra: precioMaximo.toFixed(2),
    importeHipoteca: hipoteca.toFixed(2),
    porcentajeImpuestos: (porcentajeImpuestos * 100).toFixed(2),
    gastosNotario: gastosNotario.toFixed(2),
    gastosRegistro: gastosRegistro.toFixed(2),
    gastosGestion: gastosGestion.toFixed(2),
    tasacion: tasacion.toFixed(2),
    verificacion: verificacion.toFixed(2),
    socio: '0',
    seguroVidaAnual: leerNumero('seguroVidaAnual').toFixed(2),
    seguroHogarAnual: leerNumero('seguroHogarAnual').toFixed(2),
    otrosGastosAnuales: leerNumero('otrosGastosAnuales').toFixed(2),
    tinBonificado: tin.toFixed(2),
    plazoAnos: plazoAnos.toFixed(0),
    numPagas: numeroPagas.toFixed(0),
    salarioMensual: salarioMensual.toFixed(2)
  }).toString();
}

window.onload = calcularPlanificacion;
