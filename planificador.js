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

function calcularPlanificacion() {
  const ahorroDisponible = Math.max(0, leerNumero('ahorroActual') - leerNumero('ahorroReserva'));
  const porcentajeFinanciacion = Math.min(100, Math.max(1, leerNumero('porcentajeFinanciacion'))) / 100;
  const porcentajeImpuestos = Math.max(0, leerNumero('porcentajeImpuestos')) / 100;
  const gastosCompra = Math.max(0, leerNumero('gastosCompra'));
  const gastosHipoteca = Math.max(0, leerNumero('gastosHipoteca'));
  const otrosGastosIniciales = Math.max(0, leerNumero('otrosGastosIniciales'));
  const salarioMensual = Math.max(0, leerNumero('salarioMensual'));
  const numeroPagas = Math.max(1, leerNumero('numeroPagas'));
  const porcentajeEsfuerzo = Math.max(0, leerNumero('porcentajeEsfuerzo')) / 100;
  const tin = Math.max(0, leerNumero('tinBonificado'));
  const plazoAnos = Math.max(0, leerNumero('plazoAnos'));
  const gastosRecurrentesAnuales = Math.max(0, leerNumero('gastosRecurrentes'));

  const ingresoMensualReal = salarioMensual * numeroPagas / 12;
  const segurosMensuales = gastosRecurrentesAnuales / 12;
  const cuotaMaximaTotal = ingresoMensualReal * porcentajeEsfuerzo;
  const cuotaHipotecaMaxima = Math.max(0, cuotaMaximaTotal - segurosMensuales);
  const capitalPorCuota = calcularCapitalDesdeCuota(cuotaHipotecaMaxima, tin, plazoAnos);
  const limitePorCuota = porcentajeFinanciacion > 0 ? capitalPorCuota / porcentajeFinanciacion : 0;

  const costeFijoInicial = gastosCompra + gastosHipoteca + otrosGastosIniciales;
  const porcentajeNecesarioPorPrecio = (1 - porcentajeFinanciacion) + porcentajeImpuestos;
  const limitePorAhorros = porcentajeNecesarioPorPrecio > 0
    ? Math.max(0, (ahorroDisponible - costeFijoInicial) / porcentajeNecesarioPorPrecio)
    : 0;
  const precioMaximo = Math.min(limitePorAhorros, limitePorCuota);
  const hipoteca = precioMaximo * porcentajeFinanciacion;
  const entradaYGastos = precioMaximo - hipoteca + precioMaximo * porcentajeImpuestos + costeFijoInicial;
  const cuota = calcularCuota(hipoteca, tin, plazoAnos);
  const esfuerzoTotal = ingresoMensualReal > 0 ? ((cuota + segurosMensuales) / ingresoMensualReal) * 100 : 0;
  const limiteActivo = limitePorAhorros <= limitePorCuota ? 'tus ahorros' : 'el porcentaje de sueldo que quieres dedicar';

  document.getElementById('resLimiteAhorros').innerText = formatearEuros(limitePorAhorros);
  document.getElementById('resLimiteCuota').innerText = formatearEuros(limitePorCuota);
  document.getElementById('resPrecioMaximo').innerText = formatearEuros(precioMaximo);
  document.getElementById('resHipoteca').innerText = formatearEuros(hipoteca);
  document.getElementById('resAportacion').innerText = formatearEuros(entradaYGastos);
  document.getElementById('resCuota').innerText = formatearEuros(cuota) + '/mes';
  document.getElementById('resSeguros').innerText = formatearEuros(segurosMensuales) + '/mes';
  document.getElementById('resEsfuerzo').innerText = esfuerzoTotal.toFixed(2) + ' %';
  document.getElementById('resExplicacion').innerText = 'El límite lo marca ' + limiteActivo + '. Es una estimación y no sustituye el estudio del banco.';
}

window.onload = calcularPlanificacion;
