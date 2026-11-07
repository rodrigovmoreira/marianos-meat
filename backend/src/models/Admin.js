import mongoose from 'mongoose';

import { env } from '../config/env.js';

const adminSchema = new mongoose.Schema(
  {
    // Isolamento multi-tenant: todo registro pertence a um tenant da aplicação.
    tenantId: {
      type: String,
      required: true,
      default: () => env.defaultTenantId,
      index: true,
    },
    // Identidade canônica no Squamata-Login (claim `sub`).
    loginSubject: { type: String, default: null },
    email: { type: String, lowercase: true, trim: true, default: null },
    nome: { type: String, default: null },
    status: {
      type: String,
      enum: ['pendente', 'aprovado', 'rejeitado'],
      default: 'pendente',
    },
    role: {
      type: String,
      enum: ['super_admin', 'editor'],
      default: 'editor',
    },
    // Kill-switch: false bloqueia o acesso imediatamente (HTTP 403).
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Um Admin por identidade e por e-mail dentro do mesmo tenant.
adminSchema.index(
  { tenantId: 1, loginSubject: 1 },
  { unique: true, partialFilterExpression: { loginSubject: { $type: 'string' } } }
);
adminSchema.index(
  { tenantId: 1, email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;