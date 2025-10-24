from sqlalchemy.orm import relationship
from sqlalchemy import Integer, String, DateTime, Enum, Text, ForeignKey, Column
from .db import Base, engine


class Region(Base):
    __tablename__ = 'region'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200))

class Commune(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200))
    region_id = Column(Integer, ForeignKey('region.id'))

    region = relationship("Region")

class Photo(Base):
    __tablename__ = "foto"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300))
    nombre_archivo = Column(String(300))
    aviso_id = Column(ForeignKey("aviso_adopcion.id"))

class ContactBy(Base):
    __tablename__ = "contactar_por"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Enum('whatsapp','telegram','X','instagram','tiktok','otra'))
    identificador = Column(String(150))
    aviso_id = Column(ForeignKey("aviso_adopcion.id"))

class Comment(Base):
    __tablename__ = "comentario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(80))
    texto = Column(String(300))
    fecha = Column(DateTime)
    aviso_id = Column(ForeignKey("aviso_adopcion.id"))

class AdoptionPost(Base):
    __tablename__ = "aviso_adopcion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime)
    comuna_id = Column(ForeignKey("comuna.id"))
    sector = Column(String(100))
    nombre = Column(String(200))
    email = Column(String(100))
    celular = Column(String(15))
    tipo = Column(Enum("gato", "perro"))
    cantidad = Column(Integer)
    edad = Column(Integer)
    unidad_medida = Column(Enum("a", "m"))
    fecha_entrega = Column(DateTime)
    descripcion = Column(Text)

    commune = relationship("Commune")
    photos = relationship("Photo")     
    contacts = relationship("ContactBy") 
    comments = relationship("Comment")

def init_db():
    Base.metadata.create_all(engine)