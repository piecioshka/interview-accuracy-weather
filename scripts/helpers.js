export async function makeRequest(url, options = {}) {
  const response = await fetch(url, options);
  return await response.json();
}

export function displayTemperature(number) {
  const container = document.querySelector('.temperature');
  if (container) {
    container.textContent = number;
  }
}
