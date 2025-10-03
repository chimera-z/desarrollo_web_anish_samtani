from sqlalchemy import select, insert
from datetime import datetime
from .db import SessionLocal as Session
import os
from .tables import Region, Commune, AdoptionPost, Photo, ContactBy, init_db
from sqlalchemy.exc import SQLAlchemyError

UPLOAD_FOLDER = os.path.join(os.getcwd(), "static/imgs/uploads")
init_db()

def post_to_dict(post: AdoptionPost) -> dict:
    if post is None: return {}
    return {
        "id": post.id,
        "region": post.commune.region.nombre,
        "commune": post.commune.nombre,
        "sector": post.sector if post.sector is not None else "",
        "name": post.nombre,
        "email": post.email,
        "phone": post.celular if post.celular is not None else "",
        "contact": [(i, cc.nombre.capitalize(), cc.identificador)
            for i, cc in enumerate(post.contacts)],
        "type": post.tipo.capitalize(),
        "qty": post.cantidad,
        "age": post.edad,
        "dimension": "Años" if post.unidad_medida == 'a' else "Meses",
        "description": post.descripcion if post.descripcion is not None else "",
        "delivery_date": post.fecha_entrega.strftime("%Y-%m-%d %H:%M:%S"), 
        "publication_date": post.fecha_ingreso.strftime("%Y-%m-%d %H:%M:%S"),
        "img_filenames": [(i, p.nombre_archivo)
            for i, p in enumerate(post.photos)]
        }

def get_regions():
    with Session() as session:
        result = session.query(Region).all()
        return [reg.id for reg in result]

# (id, nombre, region_id)
def get_communes():
    with Session() as session:
        result = session.query(Commune).all()
        return [(comm.region_id, comm.id) for comm in result]

def get_last_posts(n=5):
    sess = Session()
    posts_data = []
    try:
        results = sess.query(AdoptionPost).order_by(AdoptionPost.fecha_ingreso.desc()).limit(n).all()
        for result in results:
            posts_data.append(post_to_dict(result))
    except SQLAlchemyError as e:
        print(f"Database error in get_posts: {e}")
        return []
    finally:
        sess.close()
        
    return posts_data

def add_post(data: dict) -> bool:
    session = Session()
    try:
        new_post = AdoptionPost(
            fecha_ingreso = datetime.now(),
            comuna_id = data["comm_id"],
            sector = data["sector"] or None,
            nombre = data["c_name"],
            email = data["c_email"],
            celular = data["c_phone"] or None,
            tipo = data["p_type"],
            cantidad = data["p_qty"],
            edad = data["p_age"],
            unidad_medida = data["p_age_dim"],
            fecha_entrega = data["p_del_date"],
            descripcion = data["p_desc"] or None,
        )

        session.add(new_post)
        session.commit()
            
        for img in data['img_filename']:
            new_img = Photo(
                ruta_archivo = "static/imgs",
                nombre_archivo = img,
                aviso_id = new_post.id
            )
            session.add(new_img)

        for contact_channel, contact_ident in zip(data['c_channels'], data['c_id_or_url']):
            contact_channel = 'X' if contact_channel.lower() == 'x' else contact_channel.lower()
            new_contact = ContactBy(
                nombre = contact_channel,
                identificador = contact_ident,
                aviso_id = new_post.id
            )
            session.add(new_contact)

        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Database error in get_post: {e}")
        return False
    finally:
        session.close()

    return True

def get_number_of_posts():
    with Session() as sess:
        return sess.query(AdoptionPost).count()
    
def get_post(id):
    sess = Session()
    try:
        result = sess.get(AdoptionPost, id)
        if result is None:
            return {}
        return post_to_dict(result)
    except SQLAlchemyError as e:
        print(f"Database error in get_post: {e}")
        return {}
    finally:
        sess.close()

def get_posts(n, offset):
    sess = Session()
    posts_data = []
    try:
        results = sess.query(AdoptionPost).order_by(AdoptionPost.fecha_ingreso.desc()).limit(n).offset(offset).all()
        for result in results:
            posts_data.append(post_to_dict(result))
    except SQLAlchemyError as e:
        print(f"Database error in get_posts: {e}")
        return []
    finally:
        sess.close()
        
    return posts_data

if __name__ == "__main__":
    print(get_post(8))