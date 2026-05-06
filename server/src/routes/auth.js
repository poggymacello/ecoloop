// server/src/routes/auth.js
import { Router } from 'express';
import { supabaseAdmin } from '../db/supabase.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, full_name, role = 'user' } = req.body || {};
  if (!email || !password || !full_name) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (!['user', 'aggregator', 'recycler'].includes(role)) {
    return res.status(400).json({ error: 'invalid_role' });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  });
  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({
    user: { id: data.user.id, email: data.user.email, role },
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing_fields' });

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  return res.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    user: { id: data.user.id, email: data.user.email },
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

export default router;