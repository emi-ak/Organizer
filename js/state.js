let data = null;
let classificationVisible = false;

export function getData() {
  return data;
}

export function setData(newData) {
  data = newData;
}

export function getClassificationVisible() {
  return classificationVisible;
}

export function toggleClassificationVisible() {
  classificationVisible = !classificationVisible;
  return classificationVisible;
}
