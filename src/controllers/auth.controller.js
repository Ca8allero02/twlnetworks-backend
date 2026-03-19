const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── REGISTRO ──────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }

  try {
    // Verificar si el email ya está registrado
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar usuario con rol 'user' (role_id = 1)
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, 1)',
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.insertId
    });

  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Buscar usuario con su rol
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.password, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = rows[0];

    // Comparar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// ── PERFIL (usuario autenticado) ──────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.created_at
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json(rows[0]);

  } catch (err) {
    console.error('Error en getProfile:', err);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

module.exports = { register, login, getProfile };
