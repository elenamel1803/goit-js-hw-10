const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_jF2SYnFO24cqrwLrlNjPUhhRUBdrwnPxJAeBTNZk9kgSr1yB8ENf2UP9waIxiDnC';
const headers = {
  'x-api-key': API_KEY,
};

export function fetchBreeds() {
  return fetch(`${BASE_URL}/breeds`, { headers }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

export function fetchCatByBreed(breedId) {
  return fetch(`${BASE_URL}/images/search?breed_ids=${breedId}`, {
    headers,
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}
