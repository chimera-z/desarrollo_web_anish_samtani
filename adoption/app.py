from flask import Flask, render_template, request, redirect, url_for
from utils.form import verify_form
from database.queries import add_post, get_last_posts, get_number_of_posts, get_post, get_posts
import os
import flask_resize
import math

POSTS_PER_PAGE = 5

app = Flask(__name__)

app.config['RESIZE_URL'] = 'http://127.0.0.1:5000/static/imgs/uploads/'
app.config['RESIZE_ROOT'] = os.path.join(os.path.dirname(__file__), 'static', 'imgs', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

resize = flask_resize.Resize(app)

@app.route("/", methods=["GET"])
def home(message = None):
    last_posts = get_last_posts(5)
    return render_template("index.html", posts=last_posts, message = message)

@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        form_data = request.form.to_dict()
        form_files = request.files

        ver_errors, data = verify_form(form_data, form_files)

        if not ver_errors:
            added_post = add_post(data)

            if added_post:
                return redirect(url_for('home', message="¡Aviso agregado correctamente!"))
            else:
                return render_template("add.html", errors=["No se pudo agregar el aviso. Vuelva a intentarlo."])
        
        app.logger.error(ver_errors)
        return render_template("add.html", errors = ver_errors)
        
    return render_template("add.html")

@app.route("/list-posts", methods=["GET"])
def list_posts():
    curr_page =  1 if request.args.get("page") is None else int(request.args.get("page"))
    total_post = get_number_of_posts()
    number_of_pages = max(math.ceil(total_post / POSTS_PER_PAGE), 1) 

    posts = get_posts(n=POSTS_PER_PAGE, offset=(curr_page-1)*POSTS_PER_PAGE)
    app.logger.info(f"Requested page: {curr_page}; Total pages: {number_of_pages}; Total posts: {total_post}")
    return render_template("posts_list.html", posts=posts, curr_page=curr_page, number_of_pages=number_of_pages)

@app.route("/statistics", methods=["GET"])
def stats():
    return render_template("statistics.html")

@app.route("/post/<int:post_id>")
def show_post(post_id):
    post_data = get_post(post_id)
    return render_template("post.html", data=post_data)



