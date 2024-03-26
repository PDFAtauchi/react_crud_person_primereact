export const getIdealWeight = (height, sex) => {
  let idealWeight;

  if (sex === "F") {
    idealWeight = 62.1 * (height / 100) - 44.7;
  } else if (sex === "M") {
    idealWeight = 72.7 * (height / 100) - 58;
  } else {
    return "Não se pode calcular";
  }
  if (idealWeight < 0) {
    return "Não se pode calcular";
  }
  return idealWeight.toFixed(2) + " kg";
};
