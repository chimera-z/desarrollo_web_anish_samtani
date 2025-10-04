import werkzeug.utils
from werkzeug.datastructures.structures import ImmutableMultiDict
from werkzeug.datastructures.file_storage import FileStorage
from database.queries import get_regions, get_communes
from datetime import datetime
import re
import filetype
import werkzeug
import os
import hashlib

valid_regions = get_regions()
valid_communes = get_communes()
valid_cc = ['Whatsapp', 'Telegram', 'X', 'Instagram', 'TikTok', 'Otra']
valid_p_type = ['Perro', 'Gato']
valid_p_age_dim = ['Años', 'Meses']
email_reg = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
phone_reg = r'^\+[0-9]{3}\.[0-9]{8}$'
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/gif"}
UPLOAD_FOLDER = os.path.join(os.getcwd(), "static/imgs/uploads")
IMAGER_ERR = ["Debe subir imagenes válidas."]

def verify_fields(form: dict) -> tuple[list[str], dict]:
    errors = []
    
    # verify region and commune
    reg_code: int = int(form['region'])
    comm_code: int = int(form['commune'])
    if (reg_code, comm_code) not in valid_communes:
        errors.append("Debe seleciconar una región y comuna válida.")

    # verify sector
    sector: str = form['sector'].strip()
    if len(sector) > 100:
        errors.append("Debe ingresar un sector de largo máximo 100.")

    # verify name
    c_name: str = form['contact-name'].strip()
    if not (3 <= len(c_name) <= 200):
        errors.append("Debe ingresar un nombre con largo mínimo 3 y máximo 200.")
    
    # verify email
    c_email: str = form['contact-email'].strip()
    if not re.match(email_reg, c_email):
        errors.append("Debe ingresar un email válido.")

    # verify phone number
    c_phone: str = form['contact-telephone'].strip()
    if c_phone != '' and not re.match(phone_reg, c_phone):
        errors.append("Debe ingresar un número de teléfono válido.")

    # verify contact channels
    contact_channels = []
    contact_id_or_url = []
    for i in range(1, 6):
        channel = form.get(f"contact-channels-{i}")
        contact = form.get(f"contact-id-or-url-{i}", "").strip()

        if not channel:
            continue  

        if channel not in valid_cc:
            errors.append("Debe seleccionar un medio válido.")
            break

        if not contact:
            continue 

        if not (4 <= len(contact) <= 50):
            errors.append("Debe ingresar una ID o URL válida.")
            break

        contact_channels.append(channel)
        contact_id_or_url.append(contact)
    
    # verify pet type
    p_type: str = form['pet-type']
    if p_type not in valid_p_type:
        errors.append("Debe seleccionar un tipo de mascota válido.")
    p_type = p_type.lower()

    # verify pet qty
    try:
        p_qty: float = float(form['pet-qty'])
        if not (p_qty % 1 == 0) or p_qty < 1:
            errors.append("Debe ingresar una cantidad válida de mascotas.")
    except ValueError:
        errors.append("Debe ingresar una cantidad válida de mascotas.")

    # verify pet age
    try:
        p_age: float = float(form['pet-age'])
        if not (p_age % 1 == 0) or p_age < 1:
            errors.append("Debe ingresar una cantidad válida de mascotas.")
    except ValueError:
        errors.append("Debe ingresar una cantidad válida de mascotas.")

    # verify pet age dimension
    p_age_dim: str = form['pet-age-dimension']
    if p_age_dim not in valid_p_age_dim:
        errors.append("Debe seleccionar una dimensión.")
    p_age_dim = p_age_dim.lower()[0]

    # verify pet delivery date
    try:
        p_del_date = datetime.fromisoformat(form['pet-delivery-date'])
        now = datetime.now()
        if now > p_del_date:
            errors.append("Debe seleccionar una fecha de entrega válida.")
    except ValueError:
        errors.append("Debe ingresar una fecha válida.")

    # verify pet description
    p_description: str = form['pet-description'].strip()
    if len(p_description) > 500:
        errors.append("Debe ingresar una descrición con largo máximo de 500 caracteres.")
    
    fields = {}
    if not errors:
        fields['region'] = reg_code
        fields['comm_id'] = comm_code
        fields['sector'] = sector
        fields['c_name'] = c_name
        fields['c_email'] = c_email
        fields['c_phone'] = c_phone
        fields['c_channels'] = contact_channels
        fields['c_id_or_url'] = contact_id_or_url
        fields['p_type'] = p_type
        fields['p_qty'] = p_qty
        fields['p_age'] = p_age
        fields['p_age_dim'] = p_age_dim
        fields['p_del_date'] = p_del_date
        fields['p_desc'] = p_description

    return errors, fields

def validate_img(img: FileStorage) -> bool:
    ftype_guess = filetype.guess(img)
    if ftype_guess.extension not in ALLOWED_EXTENSIONS:
        return False

    if ftype_guess.mime not in ALLOWED_MIMETYPES:
        return False
    
    return True

def verify_and_save_files(files: ImmutableMultiDict) -> tuple[list[str], list[str]]:
    # Check there is at least one pic
    imgs = [files.get(f"pet-image-{i}") for i in range(1, 6) if files.get(f"pet-image-{i}")]
    
    if not imgs or not all(validate_img(img) for img in imgs):
        return IMAGER_ERR, []

    filenames = []
    for file in imgs:
        _filename = hashlib.sha256(werkzeug.utils.secure_filename(file.filename).encode("utf-8")).hexdigest()
        _extension = filetype.guess(file).extension
        img_filename = f"{_filename}.{_extension}"

        filenames.append(img_filename)
        file.save(os.path.join(UPLOAD_FOLDER, img_filename))
    
    return [], filenames

def verify_form(form_data: dict, form_files: ImmutableMultiDict) -> list[str]:

    try:
        errors, fields = verify_fields(form_data)
        if not errors:
            errors2, img_filename = verify_and_save_files(form_files)
            errors.extend(errors2)
            fields['img_filename'] = img_filename

        return errors, fields
    
    except Exception as e:
        print(f"Error: {e}")
        return ["Datos ingresados en formato incorrecto."], {}