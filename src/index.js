import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const refs = {
  selectEl: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loaderEl: document.querySelector('.loader'),
  errorEl: document.querySelector('.error'),
};

const select = new SlimSelect({
  select: refs.selectEl,
  settings: {
    showSearch: false,
  },
});

function isLoaderActive() {
  if ((refs.loaderEl.style.visibility = 'visible')) {
    refs.selectEl.style.visibility = 'hidden';
    refs.catInfo.style.visibility = 'hidden';
  }
  refs.selectEl.style.visibility = 'visible';
  refs.catInfo.style.visibility = 'visible';
}

refs.errorEl.style.visibility = 'hidden';
refs.loaderEl.style.visibility = 'visible';

renderBreedsList();

refs.selectEl.addEventListener('change', onSelect);

function renderBreedsList() {
  isLoaderActive();
  fetchBreeds()
    .then(data => {
      const arrBreeds = data.map(({ name, id }) => {
        return { text: name, value: id };
      });

      select.setData([...arrBreeds]);
    })
    .catch(onFetchError);
}

function onSelect(evt) {
  refs.catInfo.innerHTML = '';
  isLoaderActive();

  fetchCatByBreed(evt.currentTarget.value)
    .then(data => {
      console.log(data);
      const {
        url,
        breeds: {
          [0]: { name, description, temperament },
        },
      } = data[0];

      refs.catInfo.innerHTML = `<div class="box-img">
        <img src="${url}" alt="${name}" width="400"/>
        </div>
        <div class="box-info">
        <h2>${name}</h2>
        <p>${description}</p>
        <p>
        <b>Temperament:</b> ${temperament}</p></div>`;

      refs.loaderEl.style.visibility = 'hidden';
    })
    .catch(onFetchError);
}

function onFetchError(error) {
  refs.selectEl.style.visibility = 'hidden';
  refs.loaderEl.style.visibility = 'hidden';
  console.log(error);

  Notiflix.Notify.failure(refs.errorEl.textContent, {
    position: 'center-center',
    timeout: 3000,
    width: '400px',
    fontSize: '20px',
  });
}
