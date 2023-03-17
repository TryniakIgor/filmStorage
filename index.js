import films from './films.js';

const pFilms = JSON.parse(localStorage.getItem(films)) ?? [...films];

const filmContainer = document.getElementById('film-container');
const filmList = document.getElementById('film-list');
const previewContainer = document.getElementById('preview-container');
const addFilmButton = document.getElementById('add-film');
function renderFilmList() {
    filmList.innerHTML = "";
    pFilms.forEach((film) => {

        const listItem = document.createElement("li");
        listItem.style.listStyleType = 'none';
        const titleLink = document.createElement("a");
        titleLink.setAttribute('id', 'titleLink')
        titleLink.textContent = film.title;
        titleLink.addEventListener("click", () => {
            renderFilmPreview(film.id);
            history.pushState({ id: film.id }, '', `?id=${film.id}#preview`);
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.setAttribute('class', 'button');
        editButton.setAttribute('id', 'edit-button');
        editButton.addEventListener("click", (e) => {
            editfilmForm(film.id);

        });
        listItem.appendChild(editButton);
        listItem.appendChild(titleLink);
        filmList.appendChild(listItem);
    })

    const newId = Math.floor(Math.random() * 100);

    addFilmButton.addEventListener("click", () => {
        history.pushState({ film: newId }, '', `/index.html#add `);
    });
}

renderFilmList();

function renderFilmPreview(filmId) {
    const film = pFilms.find((film) => film.id === filmId);
    if (!film) {
        previewContainer.innerHTML = "Film not found";
        return;
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = film.title;

    const categoryElement = document.createElement("p");
    categoryElement.textContent = film.category;

    const imageElement = document.createElement("img");
    imageElement.src = film.imageUrl;
    imageElement.setAttribute('class', 'img');

    const descriptionElement = document.createElement("p");
    descriptionElement.setAttribute('id', 'descriptionItem')
    descriptionElement.textContent = film.plot;

    previewContainer.innerHTML = "";
    previewContainer.appendChild(titleElement);
    previewContainer.appendChild(categoryElement);
    previewContainer.appendChild(imageElement);
    previewContainer.appendChild(descriptionElement);
}

function editfilmForm(filmId) {
    history.pushState({ x: 2 }, '', `/index.html?id=${filmId}#edit `);
    console.log('form');
    const filmItem = pFilms.find((film) => film.id === filmId);

    const createInputField = (labelText, inputValue) => {
        const label = document.createElement('label');
        label.textContent = labelText;
        const input = document.createElement('input');
        input.value = inputValue;
        label.append(input);
        return [label, input];
    };

    const [labelTitle, inputTitle] = createInputField('film title: ', filmItem.title);
    const [labelCategory, inputCategory] = createInputField('film category: ', filmItem.category);
    const [labelImgURL, inputImgURL] = createInputField('film image URL: ', filmItem.imageUrl);
    const [labelDescription, inputDescription] = createInputField('film description: ', filmItem.plot);

    const form = document.createElement('form');
    form.classList.add('edit-form');

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('fieldset');
    fieldset.append(labelTitle, labelCategory, labelImgURL, labelDescription);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'save';
    saveButton.classList.add('button');

    saveButton.addEventListener('click', e => {
        e.preventDefault();
        history.pushState({ y: 1 }, '', `?id=${filmId}#preview`);
        filmItem.title = inputTitle.value;
        filmItem.category = inputCategory.value;
        filmItem.imageUrl = inputImgURL.value;
        filmItem.plot = inputDescription.value;

        localStorage.setItem('films', JSON.stringify(films));

        filmContainer.innerHTML = '';
        filmList.innerHTML = '';
        renderFilmList();
        filmContainer.appendChild(filmList);
        filmContainer.appendChild(filmList);
        filmContainer.appendChild(addFilmButton);
        const undoChangesText = document.getElementById('undo-changes-text');
        undoChangesText.textContent = 'Movie updated successfully';
        showModal(modal2, okButton2);
        previewContainer.innerHTML = '';
    });

    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'cancel';
    btnCancel.classList.add('button');
    btnCancel.setAttribute('id', 'form-cansel-button')


    btnCancel.addEventListener('click', e => {
        e.preventDefault();
        history.back();
        showModal(modal, okButton);
    });

    form.append(fieldset, saveButton, btnCancel);
    previewContainer.innerHTML = '';
    previewContainer.appendChild(form);
    return form;
}

// popstate gets dispatched before hashchange.

window.addEventListener("popstate", () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id || !hash || hash !== '#preview' && hash !== '#edit' && hash !== '#add') {
        window.location.replace('/index.html');
    }
    else if (hash === '#preview') {
        renderFilmPreview(id);
    } else if (hash === '#edit') {
        renderFilmEditForm(id);
    } else if (hash === '#add') {
        renderFilmEditForm(id);
    } else {
        console.error('/index.html');
    }

});



const modal = document.getElementById("modal");
const modal2 = document.getElementById("modal2");
const okButton = document.getElementById("modal-ok-button");
const okButton2 = document.getElementById("modal-ok-button2");
const cancelButton = document.getElementById("modal-cancel-button");


okButton.addEventListener("click", () => {
    history.back();
    showModal(modal2, okButton2);
});

okButton2.addEventListener("click", () => {
    hideModal(modal2);
});

cancelButton.addEventListener("click", () => {
    hideModal(modal);
});

function showModal(modal, button) {
    modal.style.display = "block";
    button.addEventListener("click", () => {
        hideModal(modal);
    });
}

function hideModal(modal) {
    modal.style.display = "none";
}
