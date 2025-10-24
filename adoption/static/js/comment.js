let comment_name = document.getElementById('add-comment-name');
let comment_text = document.getElementById('add-comment-text');
let add_comment_btn = document.getElementById('add-comment');

let error_box = document.getElementById('post-errors');
let errors_list = document.getElementById('errors-list');
let close_error_box_btn = document.getElementById('close-errors');

let prev_comment_section = document.getElementById('prev-comments');


let post_id = window.location.href.split('/').at(-1);

const show_errors = (messages) => {
    errors_list.innerHTML = '';
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.innerText = msg;
        errors_list.appendChild(li);
    });
    error_box.style.display = 'block';
};


const validate_comment = () => {
    let cname = comment_name.value.trim();
    let ctext = comment_text.value.trim();

    error_box.style.display = 'none';
    errors_list.innerHTML = '';

    let val_errs = [];
    if (cname.length < 3 || 80 < cname.length) val_errs.push('Debe ingresar un nombre de largo mínimo 3 y máximo 80.');
    if (ctext.length < 5 || 300 < ctext.length) val_errs.push('Debe ingresar un comentario de largo mínimo 5 y máximo 300.');

    if (val_errs.length > 0) {
        show_errors(val_errs);
        return false;
    }

    console.log(`Adding comment ${ctext} from ${cname} on the post ${post_id}`);
    const formData = new FormData();
    formData.append('name', cname);
    formData.append('comment', ctext);
    formData.append('pid', post_id);

    fetch('/api/comment', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('No se pudo agregar el comentario.');
        return res.json();
    })
    .then(data => {
        console.log('Comment added successfully:', data);
        comment_name.value = '';
        comment_text.value = '';
        error_box.style.display = 'none';
        load_comments();
        return true;
    }).catch(err => {
        show_errors([err.message || 'Ocurrió un error inesperado.']);
    });
};

const close_error_box = () => {
    error_box.style.display = 'none';  
  };

async function load_comments () {
    try {
        const response = await fetch(`/api/comment/${post_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const comms = await response.json();
        prev_comment_section.innerHTML = '';
        if (comms.data.length == 0) {
            console.log("No comments found for this post.")
            mess = document.createElement('p');
            mess.innerHTML = 'No hay comentarios en este aviso.';
            prev_comment_section.appendChild(mess);
            return;
        }

        comms.data.forEach(comm => {
            comment = document.createElement('div');
            comment.className = 'comment'

            comm_author = document.createElement('p');
            comm_author.className = 'comment-author';
            comm_author.innerHTML = comm['name'];
            comment.appendChild(comm_author);

            comm_date = document.createElement('span');
            comm_date.className = 'comment-date';
            comm_date.innerHTML = comm['date'];
            comment.appendChild(comm_date);

            comm_text = document.createElement('p');
            comm_text.className = 'comment-text'
            comm_text.innerHTML = comm['text'];
            comment.appendChild(comm_text);

            prev_comment_section.appendChild(comment);
        });
    } catch (error) {
        console.error('Error:', error); 
        mess = document.createElement('p');
        mess.innerHTML = 'No se pudieron cargar los comentarios.';
        prev_comment_section.appendChild(mess);
    }
};


window.onload = load_comments();
close_error_box_btn.addEventListener('click', close_error_box);
add_comment_btn.addEventListener("click", validate_comment);