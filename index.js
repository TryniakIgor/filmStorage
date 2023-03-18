import films from './films.js';

const pFilms = JSON.parse(localStorage.getItem(films)) ?? [...films];


const root = document.getElementById('root');
console.log(root);

const filmContainer = document.createElement('div');
filmContainer.setAttribute('id', 'film-container');
filmContainer.classList.add('left-column');

const title = document.createElement('h1');
title.setAttribute('id', 'title');
title.textContent = 'Films list';

const filmList = document.createElement('ul');
filmList.setAttribute('id', 'film-list');

const addFilmButton = document.createElement('button');
addFilmButton.setAttribute('id', 'add-film');
addFilmButton.classList.add('button');
addFilmButton.textContent = 'Add film';

filmContainer.appendChild(title);
filmContainer.appendChild(filmList);
filmContainer.appendChild(addFilmButton);

const previewContainer = document.createElement('div');
previewContainer.setAttribute('id', 'preview-container');
previewContainer.classList.add('right-column');

root.appendChild(filmContainer);
root.appendChild(previewContainer);

const modal = document.createElement('div');
modal.setAttribute('id', 'modal');
modal.classList.add('modal');

const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');

const modalTitle = document.createElement('h2');
modalTitle.setAttribute('id', '');
modalTitle.textContent = 'Undo changes?';

const modalButtons = document.createElement('div');
modalButtons.classList.add('modal-buttons');

const modalOkButton = document.createElement('button');
modalOkButton.setAttribute('id', 'modal-ok-button');
modalOkButton.classList.add('button');
modalOkButton.classList.add('modal-button');
modalOkButton.textContent = 'OK';

const modalCancelButton = document.createElement('button');
modalCancelButton.setAttribute('id', 'modal-cancel-button');
modalCancelButton.classList.add('button');
modalCancelButton.classList.add('modal-button');
modalCancelButton.textContent = 'Cancel';

modalButtons.appendChild(modalOkButton);
modalButtons.appendChild(modalCancelButton);

modalContent.appendChild(modalTitle);
modalContent.appendChild(modalButtons);

modal.appendChild(modalContent);

const modal2 = document.createElement('div');
modal2.setAttribute('id', 'modal2');
modal2.classList.add('modal');

const modal2Content = document.createElement('div');
modal2Content.classList.add('modal-content');

const undoChangesText = document.createElement('h2');
undoChangesText.setAttribute('id', 'undo-changes-text');
undoChangesText.textContent = 'Changes apply';

const modal2Buttons = document.createElement('div');
modal2Buttons.classList.add('modal-buttons');

const modal2OkButton = document.createElement('button');
modal2OkButton.setAttribute('id', 'modal-ok-button2');
modal2OkButton.classList.add('button');
modal2OkButton.classList.add('modal-button');
modal2OkButton.textContent = 'OK';

modal2Buttons.appendChild(modal2OkButton);

modal2Content.appendChild(undoChangesText);
modal2Content.appendChild(modal2Buttons);

modal2.appendChild(modal2Content);

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

function load() {
    const hash = window.location.hash;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (hash === '#preview') {
        renderFilmPreview(id);
        renderFilmList();
    } else if (hash === '#edit') {
        renderFilmList();
        editfilmForm(id);
    } else if (hash === '#add') {
        renderFilmList();
    } else {
        renderFilmList();
    }
};

load();

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

// popstate gets dispatched before hashchange.https://www.codeguage.com/courses/js/events-popstate-event

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
        editfilmForm(id);
        console.log(id);
    } else if (hash === '#add') {

    } else {
        console.error('/index.html');
    }

});


modalOkButton.addEventListener("click", () => {
    history.back();
    showModal(modal2, okButton2);
});

modal2OkButton.addEventListener("click", () => {
    hideModal(modal2);
});

modalCancelButton.addEventListener("click", () => {
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
