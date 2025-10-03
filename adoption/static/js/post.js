let post_page_imgs = document.getElementsByClassName('post-img');

let img_viewer = document.getElementById('img-viewer');
let zoomed_imgs = document.getElementsByClassName('zoomed-img');
let close_zoomed_img_span = document.getElementById('close-img');

const close_img = () => {
    img_viewer.style.display = "none";
    for (zoomed_img of zoomed_imgs) {
        zoomed_img.hidden = true;
    }
};

let post_container_divs = document.getElementsByClassName('post-container');

for (post_img of post_page_imgs) {
    post_img.addEventListener('click', function() {
        let idx = this.id.split('-').pop();
        console.log(idx);
        close_zoomed_img_span.hidden = false;
        img_viewer.style.display = "flex";
        document.getElementById('zoomed-img-'+idx).hidden = false;
    });
}

close_zoomed_img_span.addEventListener('click', close_img);
