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
    const rawMessage = data?.error || 'Errore nella comunicazione con Firebase Realtime Database';

    if (response.status === 401 || response.status === 403 || /permission/i.test(rawMessage || '')) {
      throw new FirebaseError(
        'Accesso al database Firebase negato. Controlla le regole di sicurezza e i token utilizzati.',
        response.status,
        'FIREBASE_PERMISSION_DENIED'
      );
    }

    if (response.status === 404) {
      throw new FirebaseError(
        'Risorsa non trovata nel Realtime Database Firebase.',
        response.status,
        'FIREBASE_RESOURCE_NOT_FOUND'
      );
    }

    throw new FirebaseError(rawMessage, response.status, 'FIREBASE_DB_ERROR');
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

function normalizeStringId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = value.toString().trim();
  return stringValue.length > 0 ? stringValue : null;
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

async function lookupAccountByIdToken(idToken) {
  if (!idToken) {
    throw new ApiError('ID token mancante. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  const lookup = await firebaseAuthRequest('accounts:lookup', { idToken });
  const user = lookup?.users?.[0];

  if (!user || !user.localId) {
    throw new ApiError('Sessione non valida o scaduta. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  return {
    localId: user.localId,
    email: user.email || '',
    displayName: user.displayName || ''
  };
}

async function resolveAccountFromToken(idToken, preferredRole) {
  const baseAccount = await lookupAccountByIdToken(idToken);
  const { role, profile } = await resolveAccountProfile(baseAccount.localId, idToken, preferredRole);

  const displayName =
    profile.fullName ||
    profile.companyName ||
    profile.displayName ||
    baseAccount.displayName ||
    profile.email ||
    baseAccount.email;

  return {
    localId: baseAccount.localId,
    email: profile.email || baseAccount.email,
    role,
    displayName,
    profile
  };
}

async function getDatabaseWriteToken(fallbackToken) {
  if (FIREBASE_SERVICE_EMAIL && FIREBASE_SERVICE_PASSWORD) {
    try {
      return await getServiceIdToken();
    } catch (error) {
      console.warn('Impossibile ottenere un token di servizio Firebase. Verrà utilizzato il token dell\'utente.', error);
    }
  }

  return fallbackToken;
}

function buildChatThreadId(userId, companyId) {
  return `chat_${userId}_${companyId}`;
}

function isParticipantOfThread(threadData, localId) {
  if (!threadData || !localId) {
    return false;
  }

  const participants = threadData.participants || {};
  const profiles = threadData.participantProfiles || {};

  return (
    participants.user === localId ||
    participants.company === localId ||
    profiles.user?.id === localId ||
    profiles.company?.id === localId
  );
}

function trimMessagePreview(text, maxLength = 220) {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}

function parseUnreadCount(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function isFirebasePermissionError(error) {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

  if (error.code === 'FIREBASE_PERMISSION_DENIED') {
    return true;
  }

  return error.status === 401 || error.status === 403 || /permission/i.test(error.message || '');
}

function isFirebaseNotFoundError(error) {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

  if (error.code === 'FIREBASE_RESOURCE_NOT_FOUND') {
    return true;
  }

  return error.status === 404;
}

function getMembershipPath(role, participantId, threadId) {
  if (!participantId || !threadId) {
    return null;
  }

  if (role === 'company') {
    return `/companyChats/${participantId}/${threadId}.json`;
  }

  if (role === 'user') {
    return `/userChats/${participantId}/${threadId}.json`;
  }

  return null;
}

async function getMembershipMetadata(role, participantId, threadId, dbToken) {
  const path = getMembershipPath(role, participantId, threadId);
  if (!path) {
    return null;
  }

  try {
    const snapshot = await firebaseDatabaseRequest('GET', path, dbToken);
    if (!snapshot || typeof snapshot !== 'object') {
      return null;
    }
    return snapshot;
  } catch (error) {
    if (isFirebasePermissionError(error)) {
      throw new ApiError(
        'Non hai i permessi necessari per accedere a questa conversazione. Aggiorna le regole di Firebase se necessario.',
        403,
        'CHAT_PERMISSION_DENIED'
      );
    }

    if (isFirebaseNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

async function patchMembershipMetadata(role, participantId, threadId, dbToken, updates) {
  const path = getMembershipPath(role, participantId, threadId);
  if (!path || !updates || typeof updates !== 'object') {
    return;
  }

  try {
    await firebaseDatabaseRequest('PATCH', path, dbToken, updates);
  } catch (error) {
    if (isFirebasePermissionError(error)) {
      throw new ApiError(
        'Aggiornamento della conversazione non consentito per questo account. Controlla i permessi Firebase.',
        403,
        'CHAT_PERMISSION_DENIED'
      );
    }

    throw error;
  }
}

async function markThreadAsReadForAccount(account, threadId, dbToken, lastMessageAt) {
  if (!account || !account.localId || !threadId) {
    return null;
  }

  const participantRole = account.role === 'company' ? 'company' : 'user';
  const updates = {
    lastReadAt: lastMessageAt || new Date().toISOString(),
    unreadCount: 0
  };

  await patchMembershipMetadata(participantRole, account.localId, threadId, dbToken, updates);
  return updates;
}

async function syncMembershipAfterMessage({
  role,
  participantId,
  threadId,
  dbToken,
  preview,
  messageTimestamp,
  senderRole,
  isSender
}) {
  if (!participantId || !threadId) {
    return 0;
  }

  const updates = {
    updatedAt: messageTimestamp,
    lastMessageAt: messageTimestamp,
    lastMessagePreview: preview,
    lastMessageAuthorRole: senderRole
  };

  if (isSender) {
    updates.unreadCount = 0;
    updates.lastReadAt = messageTimestamp;
  } else {
    const metadata = await getMembershipMetadata(role, participantId, threadId, dbToken);
    const currentUnread = parseUnreadCount(metadata?.unreadCount);
    updates.unreadCount = currentUnread + 1;
  }

  await patchMembershipMetadata(role, participantId, threadId, dbToken, updates);
  return updates.unreadCount || 0;
}

function mapThreadForResponse(threadData) {
  if (!threadData || typeof threadData !== 'object') {
    return null;
  }

  const participants = threadData.participants || {};
  const profiles = threadData.participantProfiles || {};

  return {
    id: threadData.id || null,
    createdAt: threadData.createdAt || null,
    updatedAt: threadData.updatedAt || threadData.lastMessageAt || threadData.createdAt || null,
    lastMessageAt: threadData.lastMessageAt || threadData.updatedAt || threadData.createdAt || null,
    lastMessagePreview: threadData.lastMessagePreview || '',
    lastMessageAuthorRole: threadData.lastMessageAuthorRole || null,
    lastReadAt: threadData.lastReadAt || null,
    participants: {
      userId: participants.user || profiles.user?.id || null,
      companyId: participants.company || profiles.company?.id || null
    },
    user: {
      id: profiles.user?.id || participants.user || null,
      name: profiles.user?.name || '',
      email: profiles.user?.email || ''
    },
    company: {
      id: profiles.company?.id || participants.company || null,
      name: profiles.company?.name || '',
      email: profiles.company?.email || ''
    }
  };
}

function mapMessagesSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') {
    return [];
  }

  const messages = Object.entries(snapshot).map(([key, value]) => ({
    id: key,
    senderId: value?.senderId || null,
    senderRole: value?.senderRole || null,
    text: value?.text || '',
    createdAt: value?.createdAt || null
  }));

  return messages.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });
}

async function ensureChatThread({
  account,
  idToken,
  threadId,
  userId,
  companyId,
  allowCreate
}) {
  const normalizedThreadId = normalizeStringId(threadId);
  const normalizedUserId = normalizeStringId(userId) || (account.role === 'user' ? account.localId : null);
  const normalizedCompanyId = normalizeStringId(companyId) || (account.role === 'company' ? account.localId : null);

  const dbToken = await getDatabaseWriteToken(idToken);

  if (normalizedThreadId) {
    const existingThread = await firebaseDatabaseRequest('GET', `/chats/${normalizedThreadId}.json`, dbToken);

    if (!existingThread || isEmptyObject(existingThread)) {
      throw new ApiError('Conversazione non trovata.', 404, 'CHAT_NOT_FOUND');
    }

    existingThread.id = normalizedThreadId;

    if (!isParticipantOfThread(existingThread, account.localId)) {
      throw new ApiError('Accesso alla conversazione non consentito.', 403, 'CHAT_FORBIDDEN');
    }

    return { id: normalizedThreadId, data: existingThread, token: dbToken };
  }

  if (!allowCreate) {
    throw new ApiError('Conversazione non trovata.', 404, 'CHAT_NOT_FOUND');
  }

  if (!normalizedUserId || !normalizedCompanyId) {
    throw new ApiError('Impossibile avviare la chat: partecipanti mancanti.', 400, 'CHAT_PARTICIPANTS_MISSING');
  }

  const computedThreadId = buildChatThreadId(normalizedUserId, normalizedCompanyId);
  let threadSnapshot = await firebaseDatabaseRequest('GET', `/chats/${computedThreadId}.json`, dbToken);

  if (!threadSnapshot || isEmptyObject(threadSnapshot)) {
    const companyProfile = await firebaseDatabaseRequest('GET', `/companies/${normalizedCompanyId}.json`, dbToken);

    if (!companyProfile || isEmptyObject(companyProfile)) {
      throw new ApiError('Impresa non trovata o non abilitata alla chat.', 404, 'COMPANY_NOT_FOUND');
    }

    const now = new Date().toISOString();
    const userProfile = account.role === 'user' ? account.profile : await firebaseDatabaseRequest('GET', `/profiles/${normalizedUserId}.json`, dbToken);

    const threadPayload = {
      id: computedThreadId,
      createdAt: now,
      updatedAt: now,
      participants: { user: normalizedUserId, company: normalizedCompanyId },
      participantProfiles: {
        user: {
          id: normalizedUserId,
          name:
            userProfile?.fullName ||
            userProfile?.displayName ||
            account.displayName ||
            userProfile?.email ||
            account.email,
          email: userProfile?.email || account.email || ''
        },
        company: {
          id: normalizedCompanyId,
          name: companyProfile.companyName || companyProfile.name || 'Impresa registrata',
          email: companyProfile.email || ''
        }
      },
      lastMessagePreview: '',
      lastMessageAt: null,
      lastMessageAuthorRole: null
    };

    await firebaseDatabaseRequest('PUT', `/chats/${computedThreadId}.json`, dbToken, threadPayload);

    const userEntry = {
      threadId: computedThreadId,
      companyId: normalizedCompanyId,
      companyName: threadPayload.participantProfiles.company.name,
      createdAt: now,
      updatedAt: now,
      lastReadAt: now,
      unreadCount: 0
    };

    await firebaseDatabaseRequest('PUT', `/userChats/${normalizedUserId}/${computedThreadId}.json`, dbToken, userEntry);

    const companyEntry = {
      threadId: computedThreadId,
      userId: normalizedUserId,
      userName: threadPayload.participantProfiles.user.name,
      createdAt: now,
      updatedAt: now,
      lastReadAt: null,
      unreadCount: 0
    };

    await firebaseDatabaseRequest('PUT', `/companyChats/${normalizedCompanyId}/${computedThreadId}.json`, dbToken, companyEntry);

    threadSnapshot = threadPayload;
  } else {
    threadSnapshot.id = computedThreadId;
  }

  if (!isParticipantOfThread(threadSnapshot, account.localId)) {
    throw new ApiError('Accesso alla conversazione non consentito.', 403, 'CHAT_FORBIDDEN');
  }

  return { id: computedThreadId, data: threadSnapshot, token: dbToken };
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

async function handleChatOpen(body) {
  const { idToken, threadId, companyId, role } = body;

  if (!idToken) {
    throw new ApiError('ID token mancante. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  const account = await resolveAccountFromToken(idToken, role);

  if (account.role === 'admin') {
    throw new ApiError('Gli amministratori non possono avviare chat con le imprese.', 403, 'CHAT_FORBIDDEN');
  }

  const ensureResult = await ensureChatThread({
    account,
    idToken,
    threadId,
    userId: account.role === 'user' ? account.localId : null,
    companyId,
    allowCreate: account.role === 'user'
  });

  let messagesSnapshot = null;
  try {
    messagesSnapshot = await firebaseDatabaseRequest('GET', `/chats/${ensureResult.id}/messages.json`, ensureResult.token);
  } catch (error) {
    if (isFirebasePermissionError(error)) {
      throw new ApiError(
        'Non hai i permessi per leggere i messaggi di questa conversazione. Controlla le regole Firebase.',
        403,
        'CHAT_PERMISSION_DENIED'
      );
    }

    if (!isFirebaseNotFoundError(error)) {
      throw error;
    }
  }

  const threadResponse = mapThreadForResponse(ensureResult.data);
  const messages = mapMessagesSnapshot(messagesSnapshot);
  const lastMessageTimestamp =
    threadResponse?.lastMessageAt ||
    (messages.length ? messages[messages.length - 1].createdAt : threadResponse?.createdAt) ||
    new Date().toISOString();

  const participantRole = account.role === 'company' ? 'company' : 'user';
  const membershipMetadata = await getMembershipMetadata(
    participantRole,
    account.localId,
    ensureResult.id,
    ensureResult.token
  );

  if (threadResponse && membershipMetadata) {
    threadResponse.unreadCount = parseUnreadCount(membershipMetadata.unreadCount);
    threadResponse.lastReadAt = membershipMetadata.lastReadAt || threadResponse.lastReadAt || null;
  }

  await markThreadAsReadForAccount(account, ensureResult.id, ensureResult.token, lastMessageTimestamp);

  if (threadResponse) {
    threadResponse.unreadCount = 0;
    threadResponse.lastReadAt = lastMessageTimestamp;
  }

  return {
    success: true,
    thread: threadResponse,
    messages
  };
}

async function handleChatList(body) {
  const { idToken, role } = body;

  if (!idToken) {
    throw new ApiError('ID token mancante. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  const account = await resolveAccountFromToken(idToken, role);

  if (account.role === 'admin') {
    return { success: true, threads: [] };
  }

  const dbToken = await getDatabaseWriteToken(idToken);
  const membershipPath =
    account.role === 'company'
      ? `/companyChats/${account.localId}.json`
      : `/userChats/${account.localId}.json`;

  let membershipSnapshot = null;
  try {
    membershipSnapshot = await firebaseDatabaseRequest('GET', membershipPath, dbToken);
  } catch (error) {
    if (isFirebasePermissionError(error)) {
      throw new ApiError(
        'Non hai i permessi per consultare l\'elenco delle conversazioni. Verifica le regole di sicurezza Firebase.',
        403,
        'CHAT_PERMISSION_DENIED'
      );
    }

    if (isFirebaseNotFoundError(error)) {
      return { success: true, threads: [] };
    }

    throw error;
  }

  if (!membershipSnapshot || isEmptyObject(membershipSnapshot)) {
    return { success: true, threads: [] };
  }

  const threads = [];

  await Promise.all(
    Object.keys(membershipSnapshot).map(async (threadId) => {
      try {
        const threadData = await firebaseDatabaseRequest('GET', `/chats/${threadId}.json`, dbToken);
        if (!threadData || isEmptyObject(threadData)) {
          return;
        }

        threadData.id = threadId;

        if (!isParticipantOfThread(threadData, account.localId)) {
          return;
        }

        const responseThread = mapThreadForResponse(threadData);
        const metadata = membershipSnapshot[threadId];

        if (metadata && typeof metadata === 'object') {
          responseThread.updatedAt = metadata.updatedAt || responseThread.updatedAt;
          responseThread.lastMessageAt = metadata.lastMessageAt || responseThread.lastMessageAt;
          responseThread.lastReadAt = metadata.lastReadAt || responseThread.lastReadAt || null;
          responseThread.unreadCount = parseUnreadCount(metadata.unreadCount);
          if (!responseThread.lastMessagePreview && metadata.lastMessagePreview) {
            responseThread.lastMessagePreview = metadata.lastMessagePreview;
          }
        } else {
          responseThread.unreadCount = 0;
        }

        threads.push(responseThread);
      } catch (error) {
        console.warn(`Impossibile recuperare la chat ${threadId}:`, error);
      }
    })
  );

  threads.sort((a, b) => {
    const dateA = a.updatedAt || a.lastMessageAt || a.createdAt || null;
    const dateB = b.updatedAt || b.lastMessageAt || b.createdAt || null;
    const timeA = dateA ? new Date(dateA).getTime() : 0;
    const timeB = dateB ? new Date(dateB).getTime() : 0;
    return timeB - timeA;
  });

  return { success: true, threads };
}

async function handleChatMessages(body) {
  const { idToken, threadId, role } = body;

  if (!idToken) {
    throw new ApiError('ID token mancante. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  const normalizedThreadId = normalizeStringId(threadId);
  if (!normalizedThreadId) {
    throw new ApiError('Conversazione non specificata.', 400, 'CHAT_REQUIRED');
  }

  const account = await resolveAccountFromToken(idToken, role);

  if (account.role === 'admin') {
    throw new ApiError('Gli amministratori non possono accedere alle chat delle imprese.', 403, 'CHAT_FORBIDDEN');
  }

  const dbToken = await getDatabaseWriteToken(idToken);
  const threadData = await firebaseDatabaseRequest('GET', `/chats/${normalizedThreadId}.json`, dbToken);

  if (!threadData || isEmptyObject(threadData)) {
    throw new ApiError('Conversazione non trovata.', 404, 'CHAT_NOT_FOUND');
  }

  threadData.id = normalizedThreadId;

  if (!isParticipantOfThread(threadData, account.localId)) {
    throw new ApiError('Accesso alla conversazione non consentito.', 403, 'CHAT_FORBIDDEN');
  }

  let messagesSnapshot = null;
  try {
    messagesSnapshot = await firebaseDatabaseRequest('GET', `/chats/${normalizedThreadId}/messages.json`, dbToken);
  } catch (error) {
    if (isFirebasePermissionError(error)) {
      throw new ApiError(
        'Non hai i permessi per leggere i messaggi di questa conversazione. Controlla le regole Firebase.',
        403,
        'CHAT_PERMISSION_DENIED'
      );
    }

    if (!isFirebaseNotFoundError(error)) {
      throw error;
    }
  }

  const threadResponse = mapThreadForResponse(threadData);
  const messages = mapMessagesSnapshot(messagesSnapshot);
  const lastMessageTimestamp =
    threadResponse?.lastMessageAt ||
    (messages.length ? messages[messages.length - 1].createdAt : threadResponse?.createdAt) ||
    new Date().toISOString();

  const participantRole = account.role === 'company' ? 'company' : 'user';
  const membershipMetadata = await getMembershipMetadata(
    participantRole,
    account.localId,
    normalizedThreadId,
    dbToken
  );

  if (threadResponse && membershipMetadata) {
    threadResponse.unreadCount = parseUnreadCount(membershipMetadata.unreadCount);
    threadResponse.lastReadAt = membershipMetadata.lastReadAt || threadResponse.lastReadAt || null;
  }

  await markThreadAsReadForAccount(account, normalizedThreadId, dbToken, lastMessageTimestamp);

  if (threadResponse) {
    threadResponse.unreadCount = 0;
    threadResponse.lastReadAt = lastMessageTimestamp;
  }

  return {
    success: true,
    thread: threadResponse,
    messages
  };
}

async function handleChatSend(body) {
  const { idToken, text, threadId, companyId, role } = body;

  if (!idToken) {
    throw new ApiError('ID token mancante. Effettua nuovamente il login.', 401, 'UNAUTHENTICATED');
  }

  const trimmedText = typeof text === 'string' ? text.trim() : '';
  if (!trimmedText) {
    throw new ApiError('Il messaggio non può essere vuoto.', 400, 'CHAT_MESSAGE_EMPTY');
  }

  if (trimmedText.length > 2000) {
    throw new ApiError('Il messaggio è troppo lungo (max 2000 caratteri).', 400, 'CHAT_MESSAGE_TOO_LONG');
  }

  const account = await resolveAccountFromToken(idToken, role);

  if (account.role === 'admin') {
    throw new ApiError('Gli amministratori non possono inviare messaggi nelle chat delle imprese.', 403, 'CHAT_FORBIDDEN');
  }

  const ensureResult = await ensureChatThread({
    account,
    idToken,
    threadId,
    userId: account.role === 'user' ? account.localId : null,
    companyId,
    allowCreate: account.role === 'user'
  });

  const dbToken = ensureResult.token;
  const now = new Date().toISOString();

  const messagePayload = {
    senderId: account.localId,
    senderRole: account.role,
    text: trimmedText,
    createdAt: now
  };

  const writeResult = await firebaseDatabaseRequest(
    'POST',
    `/chats/${ensureResult.id}/messages.json`,
    dbToken,
    messagePayload
  );

  const messageId = writeResult?.name || null;

  const preview = trimMessagePreview(trimmedText);
  const threadUpdate = {
    updatedAt: now,
    lastMessageAt: now,
    lastMessagePreview: preview,
    lastMessageAuthorRole: account.role
  };

  await firebaseDatabaseRequest('PATCH', `/chats/${ensureResult.id}.json`, dbToken, threadUpdate);

  const userParticipant = ensureResult.data.participants?.user;
  const companyParticipant = ensureResult.data.participants?.company;

  const senderIsUser = account.role === 'user';
  const senderIsCompany = account.role === 'company';

  let senderUnreadCount = 0;

  if (userParticipant) {
    const unread = await syncMembershipAfterMessage({
      role: 'user',
      participantId: userParticipant,
      threadId: ensureResult.id,
      dbToken,
      preview,
      messageTimestamp: now,
      senderRole: account.role,
      isSender: senderIsUser
    });

    if (senderIsUser) {
      senderUnreadCount = unread;
    }
  }

  if (companyParticipant) {
    const unread = await syncMembershipAfterMessage({
      role: 'company',
      participantId: companyParticipant,
      threadId: ensureResult.id,
      dbToken,
      preview,
      messageTimestamp: now,
      senderRole: account.role,
      isSender: senderIsCompany
    });

    if (senderIsCompany) {
      senderUnreadCount = unread;
    }
  }

  const refreshedThread = await firebaseDatabaseRequest(
    'GET',
    `/chats/${ensureResult.id}.json`,
    dbToken
  );

  let responseThread = refreshedThread ? mapThreadForResponse({ ...refreshedThread, id: ensureResult.id }) : null;
  if (!responseThread) {
    if (refreshedThread) {
      refreshedThread.id = ensureResult.id;
    }
    responseThread = mapThreadForResponse(refreshedThread || ensureResult.data);
  }

  if (responseThread) {
    responseThread.unreadCount = senderUnreadCount;
    if (senderUnreadCount === 0) {
      responseThread.lastReadAt = now;
    }
  }

  return {
    success: true,
    thread: responseThread,
    message: {
      id: messageId,
      ...messagePayload
    }
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
      requiresInspection: Boolean(value.requiresInspection || value.requires_inspection),
      createdAt: value.createdAt || value.created_at || value.timestamp || value.date || ''
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

  if (url.pathname === '/api/chat/open') {
    const result = await handleChatOpen(body);
    sendJson(res, 200, result);
    return;
  }

  if (url.pathname === '/api/chat/list') {
    const result = await handleChatList(body);
    sendJson(res, 200, result);
    return;
  }

  if (url.pathname === '/api/chat/messages') {
    const result = await handleChatMessages(body);
    sendJson(res, 200, result);
    return;
  }

  if (url.pathname === '/api/chat/send') {
    const result = await handleChatSend(body);
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
