import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

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

refs.errorEl.style.visibility = 'hidden';

showLoader();

refs.selectEl.addEventListener('change', evt => {
  onSelect(evt.target.value);
  showCatInfo();
});

fetchBreeds()
  .then(data => {
    renderBreedsList(data);
    showCatInfo(false);
  })
  .catch(onFetchError)
  .finally(() => showLoader(false));

function renderBreedsList(data) {
  refs.selectEl.innerHTML = createListMarkup(data);
}

function onSelect(breedId) {
  showLoader();
  refs.catInfo.innerHTML = '';

  fetchCatByBreed(breedId)
    .then(data => {
      refs.catInfo.innerHTML = createInfoMarkup(data);
    })
    .catch(onFetchError)
    .finally(() => showLoader(false));
}

function createListMarkup(data) {
  select.setData(
    data.map(({ name, id }) => {
      return { text: name, value: id };
    })
  );
}

function createInfoMarkup(arr) {
  return arr
    .map(
      ({
        url,
        breeds: {
          [0]: { name, description, temperament },
        },
      }) => `<div class="box-img">
        <img src="${url}" alt="${name}" width="400"/>
        </div>
        <div class="box-info">
        <h2>${name}</h2>
        <p>${description}</p>
        <p>
        <b>Temperament:</b> ${temperament}</p></div>`
    )
    .join('');
}

function showLoader(isShow = true) {
  refs.loaderEl.style.visibility = isShow ? 'visible' : 'hidden';
}

function showSelect(isShow = true) {
  refs.selectEl.style.visibility = isShow ? 'visible' : 'hidden';
}

function showCatInfo(isShow = true) {
  refs.catInfo.style.visibility = isShow ? 'visible' : 'hidden';
}

function onFetchError(error) {
  showSelect(false);
  showLoader(false);
  console.log(error);

  Notiflix.Notify.failure(refs.errorEl.textContent, {
    position: 'center-center',
    timeout: 3000,
    width: '400px',
    fontSize: '20px',
  });
}
