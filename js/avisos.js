
// Get publication form information
let post_form = document.getElementsByClassName('data-form')[0];

// location form
let region_select = document.getElementById('region');
let commune_select = document.getElementById('commune');
let sector_input = document.getElementById('sector');

// contact form 
let contact_name_input = document.getElementById('contact-name');
let contact_email_input = document.getElementById('contact-email');
let contact_phone_input = document.getElementById('contact-telephone');
let contact_communication = document.getElementById('communication-option');

let contact_channels = {
    "select": [document.getElementById('contact-channels')],
    "inputs": [document.getElementById('contact-id-or-url')],
};
let add_contact_channel_btn = document.getElementById('add-contact-channel');

// pet info form
let pet_type_select = document.getElementById('pet-type');
let pet_qty_input = document.getElementById('pet-qty');
let pet_age_input = document.getElementById('pet-age');
let pet_age_dimension_select = document.getElementById('pet-age-dimension');
let pet_delivery_date_input = document.getElementById('pet-delivery-date');
let pet_description_input = document.getElementById('pet-description');
let pet_image_upload = document.getElementById('pet-image-upload');
let pet_image_inputs = [document.getElementById('pet-image')];
let add_pet_image_btn = document.getElementById('add-pet-images');


let submit_form_btm = document.getElementById('submit-post');

let post_confirmation_box = document.getElementById('confirm-post');
let post_confirmed_box = document.getElementById('post-confirmed');
let confirm_submit_post_btn = document.getElementById('confirm-add-post-btn');
let cancel_submit_post_btn = document.getElementById('deny-add-post-btn');

let error_box = document.getElementById('post-errors');
let errors_list = document.getElementById('errors-list');
let close_error_box_btn = document.getElementById('close-errors');


// initiate necessary counters and fixed parameters
let contact_channels_counter = 1;
let pet_images_counter = 1;
const max_contact_channels = 5;
const max_pet_images = 5;

// event related functions
const set_timestamp = () => {
    const show_time = new Date(Date.now() - 60*60*1000);
    pet_delivery_date_input.valueAsNumber = show_time.getTime();
};

const add_contact_channel = () => {
    if (contact_channels_counter < max_contact_channels) {
        contact_channels_counter++;

        let comm_div = document.createElement('div');
        comm_div.className = "communication-option";
        contact_communication.append(comm_div);

        let contact_channel_select = document.createElement('select');
        contact_channel_select.innerHTML = contact_channels['select'][0].innerHTML;
        contact_channel_select.value = 'None';
        contact_channels['select'].push(contact_channel_select);
        comm_div.append(contact_channel_select);

        let contact_channel_input = document.createElement('input');
        contact_channel_input.type = 'text';
        contact_channel_input.placeholder = 'ID o URL';
        contact_channel_input.hidden = true;
        contact_channels['inputs'].push(contact_channel_input);
        comm_div.append(contact_channel_input);

        contact_channel_select.addEventListener("change", () => {
            contact_channel_input.hidden = false;
        });
    }
};

const show_id_or_url_input = () => {
    contact_channels['inputs'][0].hidden = false;
};

const add_image_inputs = () => {
    if (pet_images_counter < max_pet_images) {
        pet_images_counter++;

        let file_upload_div = document.createElement('div');
        file_upload_div.className = 'form-group file-upload';
        let image_upload_input = document.createElement('input');
        image_upload_input.type = 'file';
        image_upload_input.accept = "image/*";
        pet_image_inputs.push(image_upload_input);

        file_upload_div.append(image_upload_input);
        pet_image_upload.append(file_upload_div);
    }
};

const confirm_post = () => {
    post_form.style.display = 'none';
    post_confirmation_box.style.display = 'none';
    post_confirmed_box.style.display = 'block';
};

const cancel_post = () => {
    post_form.style.display = 'block';
    post_confirmation_box.style.display = 'none';
    post_confirmed_box.style.display = 'none';
};

// validation functions
const verify_region = () => {
    return region_select.value != "None" 
    ? "" 
    : "Debe seleccionar una región.";
};

const verify_commune = () => {
    return commune_select.value != "None" 
    ? "" 
    : "Debe seleccionar una comuna.";
};

const verify_sector = () => {
    return sector_input.value.trim().length <= 100 
    ? "" 
    : "El sector tiene un largo máximo es 100 caracteres."; 
};

const verify_contact_name = () => {
    let name = contact_name_input.value.trim();
    return ((3 <= name.length) && (name.length <= 200)) 
    ? "" 
    : "Debe ingresar un nombre de largo mínimo 3 y máximo 200.";
};

const verify_contact_email = () => {
    let email_reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let email = contact_email_input.value.trim();
    if (email.length > 100) return "Debe ingresar un correo electronico de largo máximo 100."

    return email_reg.test(email)
    ? "" 
    : "Debe ingresar un correo electronico con formato valido.";
};

const verify_contact_phone = () => {
    if (contact_phone_input.value === '') return '';

    let phone_reg = /^\+[0-9]{3}\.[0-9]{8}$/;
    return phone_reg.test(contact_phone_input.value) 
      ? "" 
      : "Formato de teléfono inválido.";
  };

const verify_contact_channels = () => {
    for (let i = 0; i < contact_channels['inputs'].length; i++) {
        if (contact_channels['inputs'][i].value !== '') {
            let len = contact_channels['inputs'][i].value.trim().length;
            if (!(len >= 4 && len <= 50)) {
                return "Debe ingresar una ID o URL de largo mínimo 4 y máximo 50.";
            }
        }
    }
    return "";
};

const verify_pet_type = () => {
    return pet_type_select.value != "None" 
    ? "" 
    : "Debe elegir un tipo de mascota.";
};

const verify_pet_qty = () => {
    return parseFloat(pet_qty_input.value) >= 1 && parseFloat(pet_qty_input.value) % 1 == 0 
    ? "" 
    : "Debe ingresar una cantidad de mascotas mayor o igual a 1.";
};

const verify_pet_age = () => {
    return parseFloat(pet_age_input.value) >= 1 && parseFloat(pet_age_input.value) % 1 == 0 
    ? "" 
    : "Debe ingresar la edad de la mascota.";
};

const verify_pet_age_dimension = () => {
    return pet_age_dimension_select.value != "None" 
    ? ""
    : "Debe elegir una dimension para la edad de la mascota.";
};

const verify_pet_delivery_date = () => {
    // UTC is 4 hours behind Chile time
    return pet_delivery_date_input.valueAsNumber >= (Date.now() - 4 * 60 * 60 * 1000) 
    ? "" 
    : "Debe ingresar una fecha de entrega valida."; 
};

const verify_pet_description = () => {
    return "";
};

const verify_pet_images = () => {
    let images_type_valid = true;
    let image_uploaded = false;
    for (let i = 0; i < pet_image_inputs.length; i++) {
        if (pet_image_inputs[i].value != "") {
            image_uploaded = true;
        }
    }

    return images_type_valid && image_uploaded
    ? "" 
    : "Debe subir una imagen de su mascota.";
};

const verify_form = () => {
    post_confirmation_box.style.display = 'none';
    post_confirmed_box.style.display = 'none';
    let found_errors = false;
    const validations = [
        verify_region(), 
        verify_commune(), 
        verify_sector(), 
        verify_contact_name(),
        verify_contact_email(),
        verify_contact_phone(),
        verify_contact_channels(),
        verify_pet_type(),
        verify_pet_qty(),
        verify_pet_age(),
        verify_pet_age_dimension(),
        verify_pet_delivery_date(),
        verify_pet_description(),
        verify_pet_images(),
    ]

    errors_list.innerHTML = '';
    for (const validation of validations) {
     if (validation) {
        found_errors = true;
        error_element = document.createElement('li');
        error_element.innerText = validation;
        errors_list.appendChild(error_element);
     }
    }

    if (found_errors) {
        error_box.style.display = 'block';
        return;
    };

    error_box.style.display = 'none';
    post_form.style.display = 'none';
    post_confirmation_box.style.display = 'block';
};

const close_error_box = () => {
  error_box.style.display = 'none';  
};

// set up
set_timestamp()

// events
add_contact_channel_btn.addEventListener('click', add_contact_channel);
contact_channels['select'][0].addEventListener("change", show_id_or_url_input);
add_pet_image_btn.addEventListener('click', add_image_inputs);
submit_form_btm.addEventListener("click", verify_form);
confirm_submit_post_btn.addEventListener('click', confirm_post);
cancel_submit_post_btn.addEventListener('click', cancel_post);
close_error_box_btn.addEventListener('click', close_error_box);