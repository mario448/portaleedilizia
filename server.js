const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function loadEnvFromFile() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      return;
    }

    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      if (!line || !line.trim() || line.trim().startsWith('#')) {
        return;
      }

      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.warn('Impossibile caricare il file .env:', error);
  }
}

loadEnvFromFile();

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || '';
const FIREBASE_DATABASE_URL = (process.env.FIREBASE_DATABASE_URL || '').replace(/\/?$/, '');
const FIREBASE_SERVICE_EMAIL = process.env.FIREBASE_SERVICE_EMAIL || '';
const FIREBASE_SERVICE_PASSWORD = process.env.FIREBASE_SERVICE_PASSWORD || '';

const SERVICE_TOKEN_EXPIRY_GUARD_SECONDS = 60;
const SUPPORTED_ROLES = ['user', 'company', 'admin'];

let serviceSession = null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

class ApiError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

class FirebaseError extends ApiError {
  constructor(message, status = 400, code = 'FIREBASE_ERROR') {
    super(message, status, code);
    this.name = 'FirebaseError';
  }
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function isEmptyObject(value) {
  return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('File non trovato');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Errore interno del server');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  });
}

function ensureFirebaseConfigured() {
  if (!FIREBASE_API_KEY || !FIREBASE_DATABASE_URL) {
    throw new ApiError(
      'Configurazione Firebase mancante. Verifica le variabili FIREBASE_API_KEY e FIREBASE_DATABASE_URL.',
      500,
      'FIREBASE_CONFIG_MISSING'
    );
  }
}

async function parseJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch (error) {
    throw new ApiError('Corpo della richiesta non valido. Atteso JSON.', 400, 'INVALID_JSON');
  }
}

async function firebaseAuthRequest(endpoint, payload) {
  ensureFirebaseConfigured();

  const url = `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Errore nella comunicazione con Firebase Authentication';
    throw new FirebaseError(message, response.status, data?.error?.message || 'FIREBASE_AUTH_ERROR');
  }

  return data;
}

async function refreshServiceIdToken(refreshToken) {
  ensureFirebaseConfigured();

  const url = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Impossibile rinnovare il token di servizio Firebase';
    throw new FirebaseError(message, response.status, data?.error?.message || 'FIREBASE_REFRESH_ERROR');
  }

  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in
  };
}

function buildServiceSession(tokens) {
  const expiresInSeconds = Number(tokens.expiresIn || tokens.expires_in || 3600);
  const safeExpiresIn = Number.isFinite(expiresInSeconds) ? expiresInSeconds : 3600;
  const expiresAt = Date.now() + Math.max(safeExpiresIn - SERVICE_TOKEN_EXPIRY_GUARD_SECONDS, 30) * 1000;

  return {
    idToken: tokens.idToken || tokens.id_token || '',
    refreshToken: tokens.refreshToken || tokens.refresh_token || '',
    expiresAt
  };
}

async function getServiceIdToken() {
  if (!FIREBASE_SERVICE_EMAIL || !FIREBASE_SERVICE_PASSWORD) {
    return null;
  }

  if (serviceSession && serviceSession.idToken && serviceSession.expiresAt > Date.now()) {
    return serviceSession.idToken;
  }

  if (serviceSession && serviceSession.refreshToken) {
    try {
      const refreshed = await refreshServiceIdToken(serviceSession.refreshToken);
      serviceSession = buildServiceSession(refreshed);
      if (serviceSession.idToken) {
        return serviceSession.idToken;
      }
    } catch (error) {
      console.warn('Impossibile aggiornare il token del servizio Firebase, verrà effettuato un nuovo login.', error);
      serviceSession = null;
    }
  }

  const authData = await firebaseAuthRequest('accounts:signInWithPassword', {
    email: FIREBASE_SERVICE_EMAIL,
    password: FIREBASE_SERVICE_PASSWORD,
    returnSecureToken: true
  });

  serviceSession = buildServiceSession(authData);
  return serviceSession.idToken;
}

async function firebaseDatabaseRequest(method, resourcePath, authToken, payload) {
  ensureFirebaseConfigured();
  if (!resourcePath.startsWith('/')) {
    throw new ApiError('Il percorso del database deve iniziare con "/".', 500);
  }

  const url = new URL(`${FIREBASE_DATABASE_URL}${resourcePath}`);
  if (authToken) {
    url.searchParams.set('auth', authToken);
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (payload !== undefined) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error || 'Errore nella comunicazione con Firebase Realtime Database';
    throw new FirebaseError(message, response.status, 'FIREBASE_DB_ERROR');
  }

  return data;
}

function buildUserAccountResponse({ localId, email, displayName, role, idToken, refreshToken, expiresIn }) {
  return {
    uid: localId,
    email,
    displayName,
    role,
    idToken,
    refreshToken,
    expiresIn
  };
}

function normalizeRole(role) {
  if (!role || typeof role !== 'string') {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  return SUPPORTED_ROLES.includes(normalized) ? normalized : null;
}

function getResourcePathForRole(role, localId) {
  if (!localId) {
    return null;
  }

  switch (role) {
    case 'user':
      return `/profiles/${localId}.json`;
    case 'company':
      return `/companies/${localId}.json`;
    case 'admin':
      return `/admins/${localId}.json`;
    default:
      return null;
  }
}

async function tryFetchProfileForRole(role, localId, idToken) {
  const resourcePath = getResourcePathForRole(role, localId);
  if (!resourcePath) {
    return null;
  }

  try {
    const profile = await firebaseDatabaseRequest('GET', resourcePath, idToken);

    if (profile === null || profile === undefined || isEmptyObject(profile)) {
      return null;
    }

    return profile;
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (error.status === 401 || error.status === 403) {
        throw new ApiError('Accesso ai dati non autorizzato per questo account.', error.status, error.code);
      }

      if (error.status === 404) {
        return null;
      }
    }

    throw error;
  }
}

async function resolveAccountProfile(localId, idToken, preferredRole) {
  const normalizedPreferredRole = normalizeRole(preferredRole);
  const rolesToTry = [];

  if (normalizedPreferredRole) {
    rolesToTry.push(normalizedPreferredRole);
  }

  SUPPORTED_ROLES.forEach((role) => {
    if (!rolesToTry.includes(role)) {
      rolesToTry.push(role);
    }
  });

  for (const role of rolesToTry) {
    const profile = await tryFetchProfileForRole(role, localId, idToken);
    if (profile) {
      return { role, profile };
    }
  }

  throw new ApiError('Profilo non trovato per questo account.', 403, 'PROFILE_NOT_FOUND');
}

async function handleRegisterUser(body) {
  const { fullName, email, password } = body;
  if (!fullName || !email || !password) {
    throw new ApiError('Compila tutti i campi obbligatori.', 400, 'MISSING_FIELDS');
  }

  const authData = await firebaseAuthRequest('accounts:signUp', {
    email,
    password,
    returnSecureToken: true
  });

  const profile = {
    role: 'user',
    email,
    fullName,
    createdAt: new Date().toISOString()
  };

  await firebaseDatabaseRequest('PUT', `/profiles/${authData.localId}.json`, authData.idToken, profile);

  return {
    success: true,
    user: {
      uid: authData.localId,
      email,
      displayName: fullName,
      role: 'user'
    }
  };
}

async function handleRegisterCompany(body) {
  const required = ['companyName', 'vatNumber', 'region', 'province', 'contactName', 'email', 'password'];
  const missing = required.filter((key) => !body[key]);
  if (missing.length > 0) {
    throw new ApiError('Compila tutti i campi obbligatori.', 400, 'MISSING_FIELDS');
  }

  const authData = await firebaseAuthRequest('accounts:signUp', {
    email: body.email,
    password: body.password,
    returnSecureToken: true
  });

  const companyProfile = {
    role: 'company',
    email: body.email,
    companyName: body.companyName,
    vatNumber: body.vatNumber,
    region: body.region,
    province: body.province,
    contactName: body.contactName,
    phone: body.phone || '',
    description: body.description || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  await firebaseDatabaseRequest('PUT', `/companies/${authData.localId}.json`, authData.idToken, companyProfile);

  return {
    success: true,
    company: {
      id: authData.localId,
      ...companyProfile
    }
  };
}

async function handleLogin(body) {
  const { email, password, role } = body;
  if (!email || !password) {
    throw new ApiError('Compila tutti i campi obbligatori.', 400, 'MISSING_FIELDS');
  }

  const authData = await firebaseAuthRequest('accounts:signInWithPassword', {
    email,
    password,
    returnSecureToken: true
  });

  const { role: resolvedRole, profile } = await resolveAccountProfile(authData.localId, authData.idToken, role);

  const displayName =
    profile.fullName || profile.companyName || profile.displayName || authData.displayName || email;

  return {
    success: true,
    account: buildUserAccountResponse({
      localId: authData.localId,
      email: profile.email || email,
      displayName,
      role: resolvedRole,
      idToken: authData.idToken,
      refreshToken: authData.refreshToken,
      expiresIn: authData.expiresIn
    }),
    profile: { ...profile, role: resolvedRole }
  };
}

function mapCompaniesFromFirebase(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return [];
  }

  return Object.entries(snapshot).map(([firebaseId, rawValue]) => {
    const value = rawValue && typeof rawValue === 'object' ? rawValue : {};
    const ratingValue = Number.parseFloat(value.rating);
    const reviewsValue = Number.parseInt(value.reviews, 10);
  const portfolioItems = Array.isArray(value.portfolio)
    ? value.portfolio
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
          const rawGallery = Array.isArray(item.images)
            ? item.images
            : Array.isArray(item.photos)
            ? item.photos
            : Array.isArray(item.gallery)
            ? item.gallery
            : [];

          const normalizedGallery = rawGallery
            .map((entry) => {
              if (typeof entry === 'string') {
                return entry;
              }

              if (entry && typeof entry === 'object') {
                return entry.url || entry.src || entry.image || entry.img || '';
              }

              return '';
            })
            .map((url) => url && url.toString().trim())
            .filter((url) => Boolean(url));

          const coverImage =
            item.coverImage ||
            item.cover ||
            item.img ||
            item.image ||
            (normalizedGallery.length ? normalizedGallery[0] : '');

          if (coverImage && !normalizedGallery.includes(coverImage)) {
            normalizedGallery.unshift(coverImage);
          }

          return {
            title: item.title || item.name || 'Progetto',
            year: item.year || item.date || '',
            img: coverImage || '',
            description: item.description || item.details || item.text || '',
            images: normalizedGallery
          };
        })
    : [];

    const categories = Array.isArray(value.categories)
      ? value.categories.map((category) => category && category.toString()).filter(Boolean)
      : [];

    const verified =
      value.status === 'verified' ||
      value.verified === true ||
      value.badge === 'verified' ||
      value.isVerified === true;

    return {
      id: firebaseId,
      firebaseId,
      name: value.companyName || value.name || 'Impresa registrata',
      companyName: value.companyName || value.name || 'Impresa registrata',
      role: 'company',
      region: value.region || '',
      province: value.province || '',
      rating: Number.isFinite(ratingValue) ? Number(ratingValue.toFixed(1)) : 0,
      reviews: Number.isFinite(reviewsValue) ? reviewsValue : 0,
      verified,
      status: value.status || (verified ? 'verified' : 'pending'),
      categories,
      description: value.description || '',
      contactName: value.contactName || '',
      email: value.email || '',
      vatNumber: value.vatNumber || value.vat || '',
      createdAt: value.createdAt || value.created_at || '',
      portfolio: portfolioItems
    };
  });
}

function mapReviewsFromFirebase(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return [];
  }

  return Object.entries(snapshot).map(([firebaseId, rawValue]) => {
    const value = rawValue && typeof rawValue === 'object' ? rawValue : {};
    const ratingValue = Number.parseInt(value.rating, 10);
    const referencedCompany = value.companyFirebaseId || value.companyId || value.company || null;
    const numericCompany = Number.parseInt(value.companyLocalId ?? value.companyNumericId ?? referencedCompany, 10);

    return {
      id: firebaseId,
      firebaseId,
      companyId: Number.isFinite(numericCompany) ? numericCompany : referencedCompany,
      companyFirebaseId: referencedCompany,
      user: value.user || value.author || 'Utente',
      rating: Number.isFinite(ratingValue) ? ratingValue : 0,
      text: value.text || value.comment || '',
      status: value.status || 'pending',
      requiresInspection: Boolean(value.requiresInspection || value.requires_inspection)
    };
  });
}

async function handleBootstrapRequest() {
  let serviceToken = null;

  if (FIREBASE_SERVICE_EMAIL && FIREBASE_SERVICE_PASSWORD) {
    try {
      serviceToken = await getServiceIdToken();
    } catch (error) {
      throw new ApiError(
        "Autenticazione dell'utente di servizio Firebase non riuscita. Verifica email e password configurate.",
        503,
        'FIREBASE_SERVICE_AUTH_FAILED'
      );
    }
  }

  try {
    const [companiesSnapshot, reviewsSnapshot] = await Promise.all([
      firebaseDatabaseRequest('GET', '/companies.json', serviceToken),
      firebaseDatabaseRequest('GET', '/reviews.json', serviceToken)
    ]);

    return {
      success: true,
      companies: mapCompaniesFromFirebase(companiesSnapshot),
      reviews: mapReviewsFromFirebase(reviewsSnapshot)
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      if (!serviceToken && (!FIREBASE_SERVICE_EMAIL || !FIREBASE_SERVICE_PASSWORD)) {
        throw new ApiError(
          'Impossibile recuperare i dati pubblici da Firebase senza credenziali di servizio o regole di lettura pubblica.',
          503,
          error.code || 'FIREBASE_PUBLIC_DATA_UNAVAILABLE'
        );
      }

      throw new ApiError(error.message, error.status, error.code || 'FIREBASE_DB_ERROR');
    }

    throw error;
  }
}

async function handleApiRequest(req, res, url) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (url.pathname === '/api/public/bootstrap') {
    if (req.method !== 'GET') {
      throw new ApiError('Metodo non supportato.', 405, 'METHOD_NOT_ALLOWED');
    }

    const payload = await handleBootstrapRequest();
    sendJson(res, 200, payload);
    return;
  }

  if (req.method !== 'POST') {
    throw new ApiError('Metodo non supportato.', 405, 'METHOD_NOT_ALLOWED');
  }

  const body = await parseJsonBody(req);

  if (url.pathname === '/api/auth/register-user') {
    const result = await handleRegisterUser(body);
    sendJson(res, 200, result);
    return;
  }

  if (url.pathname === '/api/auth/register-company') {
    const result = await handleRegisterCompany(body);
    sendJson(res, 200, result);
    return;
  }

  if (url.pathname === '/api/auth/login') {
    const result = await handleLogin(body);
    sendJson(res, 200, result);
    return;
  }

  throw new ApiError('Endpoint non trovato.', 404, 'NOT_FOUND');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname.startsWith('/api/')) {
    try {
      await handleApiRequest(req, res, url);
    } catch (error) {
      if (error instanceof ApiError) {
        sendJson(res, error.status, { success: false, error: error.code, message: error.message });
      } else {
        console.error('Errore inatteso:', error);
        sendJson(res, 500, { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Errore interno del server.' });
      }
    }
    return;
  }

  let filePath = path.join(PUBLIC_DIR, url.pathname);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        if (!url.pathname || url.pathname === '/' || url.pathname === '/index.html') {
          sendFile(res, path.join(PUBLIC_DIR, 'index.html'));
          return;
        }
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Risorsa non trovata');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Errore interno del server');
      }
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    sendFile(res, filePath);
  });
});

server.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
