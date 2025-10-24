from flask import Flask, render_template, request, redirect, url_for, jsonify
from utils.form import verify_form
from database.queries import *
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
def home():
    message = request.args.get("message")
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
                return redirect(url_for('home', message="¡Aviso agregado exitosamente!"))
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

@app.route("/post/<int:post_id>", methods=["GET"])
def show_post(post_id):
    post_data = get_post(post_id)
    return render_template("post.html", pdata = post_data)

@app.route("/api/stats/", methods=["GET"])
def get_stats():
    return jsonify({
        'data': {
            "byDate": get_number_of_posts_per_date(),
            "byType": get_number_of_posts_by_type(),
            "byMonthAndType": get_posts_type_per_month()
        },
        "status": "ok",
        "error": None
    }), 200

@app.post("/api/comment")
def add_comment():
    post_id = request.form.get('pid')
    cname = request.form.get('name')
    ctext = request.form.get('comment')
    print(f"Adding comment {ctext} from {cname} to post {post_id}")

    if not (post_id and cname and ctext and 3 <= len(cname) <= 80 and 5 <= len(ctext) <= 300):
        return jsonify({"status": "error", "data": None, "error": "Entrada inválida."}), 400
    
    if add_comment_to_post(post_id, cname, ctext):
        return jsonify({"status": "ok", "data": {"post_id": post_id, "name": cname}, "error": None}), 200
            
    return jsonify({"status": "error", "data": None, "error": "No se pudo guardar el comentario."}), 400

@app.get("/api/comment/<int:post_id>")
def get_comments(post_id):
    return jsonify({"status": "ok", "data": get_post_comments(post_id), "error": None}), 200