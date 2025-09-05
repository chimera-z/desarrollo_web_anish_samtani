posts_data = [
    {
        "region": "Región de Antofagasta",
        "contact-email": "abcd@gmail.com",
        "contact-phone": "+569.12345678",
        "contact-channel": [
            {"channel": "Facebook", "id-or-url": "abcd"},
            {"channel": "X", "id-or-url": "efgh"}
        ],
        "description": "Lote de perros de múltiples tipos y colores.",
        "contact-name": "Anish",
        "publication-date": "2025-08-10 16:30",
        "delivery-date": "YYYY-YY-YY YY:YY",
        "commune": "Antofagasta",
        "sector": "Colegio",
        "qty": 4,
        "type": "Perro",
        "age": 10,
        "age_metric": "meses",
        "all-photos": ["../imgs/Perro1_320x240.webp", "../imgs/Perro2_320x240.webp", "../imgs/Perro3_320x240.webp", "../imgs/Perro4_320x240.webp"]
    },

    {
        "region": "Región Metropolitana de Santiago",
        "contact-email": "person1@hotmail.com",
        "contact-phone": "",
        "contact-channel": [{"channel": "", "id-or-url": ""}],
        "description": "",
        "publication-date": "2016-10-05",
        "delivery-date": "2016-15-05 14:20",
        "commune": "Santiago Centro",
        "sector": "Beauchef",
        "qty": 2,
        "type": "Perro",
        "age": 10,
        "age_metric": "meses",
        "contact-name": "Anish",
        "all-photos": ["../imgs/Perro3_320x240.webp", "../imgs/Perro4_320x240.webp"]
    },

    {
        "region": "Región de Tarapacá",
        "contact-email": "person1@hotmail.com",
        "contact-phone": "",
        "contact-channel": [{"channel": "", "id-or-url": ""}],
        "description": "",
        "publication-date": "2025-08-08 00:01",
        "delivery-date": "2025-08-08 05:01",
        "commune": "Iquique",
        "sector": "Centro",
        "qty": 2,
        "type": "Perro",
        "age": 10,
        "age_metric": "meses",
        "contact-name": "Anish",
        "all-photos": ["../imgs/Perro4_320x240.webp", "../imgs/Perro1_320x240.webp"]
    },

    {
        "region": "Región Metropolitana de Santiago",
        "contact-email": "person1@hotmail.com",
        "contact-phone": "",
        "contact-channel": [{"channel": "", "id-or-url": ""}],
        "description": "",
        "publication-date": "2025-01-05 12:00",
        "delivery-date": "2026-01-05 11:00",
        "commune": "Maipu",
        "sector": "Mall",
        "qty": 1,
        "type": "Gato",
        "age": 10,
        "age_metric": "meses",
        "contact-name": "Anish",
        "all-photos": ["../imgs/Gato1_320x240.webp"]
    },

    {
        "region": "Región Metropolitana de Santiago",
        "contact-email": "person1@hotmail.com",
        "contact-phone": "",
        "contact-channel": [{"channel": "", "id-or-url": ""}],
        "description": "",
        "publication-date": "XXXX-XX-XX XX:XX",
        "delivery-date": "YYYY-YY-YY YY:YY",
        "commune": "None",
        "sector": "None",
        "qty": 2,
        "type": "Perro",
        "age": 10,
        "age_metric": "meses",
        "contact-name": "Anish",
        "all-photos": ["../imgs/Perro2_320x240.webp", "../imgs/Perro1_320x240.webp"]
    },

];

let posts_container = document.getElementsByClassName('posts')[0];

let post_page = document.getElementById('post-page');
let post_page_imgs_container = document.getElementsByClassName('post-page-imgs')[0];

let region_p = document.getElementById('post-page-region');
let commune_p = document.getElementById('post-page-commune');
let sector_p = document.getElementById('post-page-sector');

let name_p = document.getElementById('post-page-contact-name');
let email_p = document.getElementById('post-page-contact-email');
let phone_number_p = document.getElementById('post-page-phone-number');
let channels_p = document.getElementById('post-page-contact-channels');

let publication_date_p = document.getElementById('post-page-publication-date');
let type_p = document.getElementById('post-page-type');
let qty_p = document.getElementById('post-page-qty');
let age_p = document.getElementById('post-page-age');
let delivery_date_p = document.getElementById('post-page-due-date');
let description_p = document.getElementById('post-page-description');

let post_imgs = [];
let img_viewer = document.getElementById('img-viewer');
let post_zoomed_img = null;
let close_zoomed_img_span = document.getElementById('close-img');

const list_all_posts = () => {
    for (post_data of posts_data) {

        let post_container_div = document.createElement('div')
        post_container_div.className = 'post-container';

        let post_image_img = document.createElement('img');
        post_image_img.className = 'post-img';
        post_image_img.src = post_data["all-photos"][0];
        post_container_div.append(post_image_img);

        let post_title_header = document.createElement('h3');
        post_title_header.className = 'post-title';
        post_title_header.innerHTML = post_data["qty"] + " " + post_data["type"] + " de " + post_data["age"] + " " + post_data["age_metric"];
        post_container_div.append(post_title_header);

        let post_date_time = document.createElement('time');
        post_date_time.className = 'post-date';
        post_date_time.innerHTML = post_data["publication-date"];
        post_container_div.append(post_date_time);

        let post_info_p = document.createElement('p');
        post_info_p.className = 'post-info';
        post_info_p.innerHTML = 'Comuna: ' + post_data['commune'] + ' - Sector: ' + post_data["sector"];
        post_container_div.append(post_info_p);

        posts_container.append(post_container_div);
    }
};

const open_post = (idx) => {
    console.log('Opening post.');
    posts_container.style.display = 'none';
    post_page.style.display = 'flex';

    for (let i = 0; i < posts_data[idx]["all-photos"].length; i++) {
        let post_img = document.createElement('img');
        post_img.src = posts_data[idx]["all-photos"][i];
        post_page_imgs_container.append(post_img);
        post_imgs.push(post_img);
        post_img.addEventListener('click', () => {
            close_zoomed_img_span.hidden = false;
            open_img(posts_data[idx]["all-photos"][i]);
        });
    }

    publication_date_p.innerHTML += posts_data[idx]["publication-date"];
    region_p.innerHTML += posts_data[idx]["region"];
    commune_p.innerHTML += posts_data[idx]["commune"];
    sector_p.innerHTML += posts_data[idx]["sector"];

    name_p.innerHTML += posts_data[idx]["contact-name"];
    email_p.innerHTML += posts_data[idx]["contact-email"];
    phone_number_p.innerHTML += posts_data[idx]["contact-phone"];

    for (i of posts_data[idx]["contact-channel"]) {
        if (i["channel"] && i['id-or-url'])
        channels_p.innerHTML += "Red: " + i["channel"] + " -> ID o URL: " + i['id-or-url'] + '<br>';
    }
    qty_p.innerHTML += posts_data[idx]["qty"];
    type_p.innerHTML += posts_data[idx]["type"];
    age_p.innerHTML += posts_data[idx]["age"] + " " + posts_data[idx]["age_metric"];
    delivery_date_p.innerHTML += posts_data[idx]["delivery-date"];
    description_p.innerHTML += posts_data[idx]["description"];

};

const open_img = (img_src) => {
    if (post_zoomed_img == null) {
        post_zoomed_img = document.createElement('img');
        post_zoomed_img.id = 'post-zoomed-img';
        post_zoomed_img.alt = 'Imagen de la mascota con zoom.'
        img_viewer.appendChild(post_zoomed_img);
    }
    post_zoomed_img.src = img_src.replace("320x240", "800x600");
    post_zoomed_img.hidden = false;
    img_viewer.style.display = "flex"; 
};

const close_img = () => {
    img_viewer.style.display = "none";
    post_zoomed_img.hidden = true;
};


// initiate
list_all_posts();

let post_container_divs = document.getElementsByClassName('post-container');

for (let i = 0; i < post_container_divs.length; i++) {
    post_container_divs[i].addEventListener('click', () => {
        open_post(i);
    });
}

posts_container.style.display = 'flex';
post_page.style.display = 'none';

close_zoomed_img_span.addEventListener('click', close_img);
