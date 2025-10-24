INSERT INTO aviso_adopcion (
  fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad,
  edad, unidad_medida, fecha_entrega, descripcion
) VALUES
('2025-01-15 10:30:01', 130208, 'Centro', 'Juan Pérez', 'juan.perez@example.com', '+569.99827637', 'perro', 2, 6, 'm', '2025-01-20 14:00:00', 'Dos gatitos rescatados del centro, muy juguetones.'),
('2024-08-03 09:00:01', 130208, 'Parque Inés de Suárez', 'María González', 'maria.g@example.com', '+569.99827637', 'gato', 1, 3, 'a', '2024-08-10 10:00:00', 'Perrito mestizo en adopción, muy cariñoso.'),
('2023-12-25 18:00:01', 130208, 'Reñaca', 'Carlos Rojas', 'carlosr@example.com', '+569.99827637', 'perro', 3, 2, 'm', '2024-01-05 15:00:00', 'Tres gatitos recién nacidos, buscan hogar.'),
('2022-05-10 12:00:01', 130208, 'Centro', 'Ana López', 'ana.lopez@example.com', '+569.99827637', 'perro', 1, 5, 'a', '2022-05-20 11:00:00', 'Perrito adulto bien educado, busca adopción.'),
('2025-10-05 16:45:01', 130208, 'Las Condes', 'Pedro Morales', 'pedrom@example.com', '+569.99827637', 'perro', 1, 10, 'm', '2025-10-10 17:30:00', 'Gato adulto rescatado, tranquilo y limpio.');

INSERT INTO foto (ruta_archivo, nombre_archivo, aviso_id) VALUES 
('static/imgs', '6343b6206b4c8f9c631dee7fccf151f5100e20fb5858cb281645866cabdf398c.png', 79),
('static/imgs', '6343b6206b4c8f9c631dee7fccf151f5100e20fb5858cb281645866cabdf398c.png', 80),
('static/imgs', '6343b6206b4c8f9c631dee7fccf151f5100e20fb5858cb281645866cabdf398c.png', 81),
('static/imgs', '6343b6206b4c8f9c631dee7fccf151f5100e20fb5858cb281645866cabdf398c.png', 82),
('static/imgs', '6343b6206b4c8f9c631dee7fccf151f5100e20fb5858cb281645866cabdf398c.png', 83)