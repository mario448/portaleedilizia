const MOCK_DATA = {
  companies: [
    {
      id: 1,
      name: 'Costruzioni Futura S.R.L.',
      region: 'Lombardia',
      province: 'Milano',
      rating: 4.8,
      reviews: 32,
      verified: true,
      status: 'verified',
      categories: ['Costruzioni', 'Ristrutturazioni'],
      description:
        'Leader nelle costruzioni residenziali e commerciali a Milano. Da oltre 20 anni realizziamo i sogni dei nostri clienti con professionalità e materiali di altissima qualità.',
      portfolio: [
        {
          title: 'Villa di Lusso, Como',
          year: 2023,
          img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
          description:
            'Realizzazione di una villa contemporanea in classe energetica A4 con finiture su misura e gestione completa del cantiere.',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607687920-4e2a68cba9fe?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1600&auto=format&fit=crop'
          ]
        },
        {
          title: 'Ristrutturazione Attico, Milano',
          year: 2022,
          img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
          description:
            'Riprogettazione totale di un attico con ampliamento delle superfici vetrate e impianto domotico integrato.',
          images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512914890250-353c83f2586d?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop'
          ]
        },
        {
          title: 'Condominio Eco-sostenibile',
          year: 2021,
          img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop',
          description:
            'Costruzione di un condominio NZEB con sistemi di recupero energia e rivestimento ventilato in legno.',
          images: [
            'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1529429617124-aee9552634fe?q=80&w=1600&auto=format&fit=crop'
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Ristruttura Facile di Rossi",
      region: 'Lazio',
      province: 'Roma',
      rating: 4.5,
      reviews: 18,
      verified: true,
      status: 'verified',
      categories: ['Ristrutturazioni', 'Finiture', 'Impianti'],
      description:
        "Specialisti in ristrutturazioni d'interni a Roma. Offriamo soluzioni chiavi in mano per bagni, cucine e interi appartamenti. Preventivi chiari e tempi certi.",
      portfolio: [
        {
          title: 'Rifacimento Bagno, Prati',
          year: 2023,
          img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
          description:
            'Trasformazione completa di un bagno di 6mq con nuova distribuzione degli spazi, illuminazione LED e finiture in gres effetto pietra.',
          images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560185008-5f0bb1866cab?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552324190-9e58650a1b1d?q=80&w=1600&auto=format&fit=crop'
          ]
        },
        {
          title: 'Open Space Moderno, EUR',
          year: 2022,
          img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
          description:
            'Rinnovo di un appartamento open space con cucina a isola, pavimento continuo in resina e illuminazione scenografica.',
          images: [
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1600&auto=format&fit=crop'
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Edil Vesuvio S.p.A.',
      region: 'Campania',
      province: 'Napoli',
      rating: 4.9,
      reviews: 51,
      verified: true,
      status: 'verified',
      categories: ['Costruzioni', 'Cappotto Termico'],
      description:
        'Costruzioni e grandi opere in Campania. Specializzati in efficientamento energetico e cappotti termici con materiali innovativi. La solidità di una grande impresa.',
      portfolio: [
        {
          title: 'Cappotto Termico, Vomero',
          year: 2023,
          img: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop',
          description:
            'Intervento di riqualificazione energetica con cappotto in lana di roccia e rifacimento dei frontalini dei balconi.',
          images: [
            'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop'
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Nuova Edilizia SRLS',
      region: 'Lombardia',
      province: 'Bergamo',
      rating: 0,
      reviews: 0,
      verified: false,
      status: 'pending',
      categories: ['Costruzioni'],
      description: 'Siamo una nuova impresa edile pronta a dimostrare il nostro valore.',
      portfolio: []
    }
  ],
  reviews: [
    {
      id: 1,
      companyId: 1,
      user: 'Marco B.',
      rating: 5,
      text:
        'Lavoro eccezionale per la nostra nuova casa. Precisi, puntuali e sempre disponibili. Il capocantiere è stato un vero professionista. Consigliatissimi!',
      status: 'approved'
    },
    {
      id: 2,
      companyId: 1,
      user: 'Giulia P.',
      rating: 4,
      text:
        "Buona esperienza complessiva. C'è stato un piccolo ritardo sulla consegna ma la qualità del lavoro finito è ineccepibile. Li contatterei di nuovo.",
      status: 'approved'
    },
    {
      id: 3,
      companyId: 2,
      user: 'Luca F.',
      rating: 5,
      text:
        'Hanno trasformato il mio vecchio bagno in una spa. Incredibile attenzione ai dettagli. Grazie a tutto il team!',
      status: 'approved'
    },
    {
      id: 4,
      companyId: 3,
      user: 'Anna G.',
      rating: 1,
      text:
        'Pessima esperienza. Il lavoro sul cappotto presenta delle crepe dopo pochi mesi e non rispondono più al telefono. Sconsigliato.',
      status: 'pending',
      requiresInspection: true
    }
  ]
};

const ROLE_LABELS = {
  user: 'Utente',
  company: 'Impresa',
  admin: 'Admin'
};

class AuthManager {
  constructor(storage = window.localStorage) {
    this.storage = storage;
    this.sessionKey = 'ev_current_user';
  }

  async post(endpoint, payload) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data && data.error ? data.error : 'REQUEST_FAILED',
          message: data && data.message ? data.message : undefined
        };
      }

      return data;
    } catch (error) {
      console.error('Errore di rete durante la chiamata API:', error);
      return { success: false, error: 'NETWORK_ERROR' };
    }
  }

  async registerUser(payload) {
    return this.post('/api/auth/register-user', payload);
  }

  async registerCompany(payload) {
    return this.post('/api/auth/register-company', payload);
  }

  async login(payload) {
    const result = await this.post('/api/auth/login', payload);
    if (result && result.success && result.account) {
      this.setCurrentUser(result.account);
    }
    return result;
  }

  getCurrentUser() {
    if (!this.storage) return null;
    const stored = this.storage.getItem(this.sessionKey);
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.email) {
        return parsed;
      }
    } catch (error) {
      console.warn('Sessione non valida, verrà azzerata:', error);
      this.logout();
    }
    return null;
  }

  setCurrentUser(account) {
    if (!this.storage) return;
    this.storage.setItem(this.sessionKey, JSON.stringify(account));
  }

  logout() {
    if (!this.storage) return;
    this.storage.removeItem(this.sessionKey);
  }
}

class App {
  constructor(data) {
    const safeData = data && typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : {};

    this.data = {
      companies: Array.isArray(safeData.companies) ? safeData.companies : [],
      reviews: Array.isArray(safeData.reviews) ? safeData.reviews : []
    };
    this.pages = Array.from(document.querySelectorAll('.page'));
    this.currentFilters = {
      term: '',
      region: '',
      category: '',
      rating: 0
    };
    this.auth = new AuthManager();
    this.currentUser = this.auth.getCurrentUser();
    this.notificationTimeout = null;
    this.currentPage = 'home';
    this.activeCompanyId = null;
    this.activeCompany = null;
    this.activeModalOverlay = null;
    this.companyIdByFirebaseId = new Map(
      (this.data.companies || [])
        .filter((company) => company && company.firebaseId)
        .map((company) => [company.firebaseId, company.id])
    );
    this.remoteCompanyIds = new Set(
      (this.data.companies || [])
        .map((company) => company && company.firebaseId)
        .filter(Boolean)
    );
    this.remoteReviewIds = new Set(
      (this.data.reviews || [])
        .map((review) => review && review.firebaseId)
        .filter(Boolean)
    );
    this.pendingRegisterType = null;
  }

  generateCompanyId() {
    const ids = this.data.companies.map((company) => Number(company.id) || 0);
    const maxId = ids.length ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  generateReviewId() {
    const ids = this.data.reviews.map((review) => Number(review.id) || 0);
    const maxId = ids.length ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  normalizeRemoteCompany(remoteCompany, fallback = {}) {
    const descriptionText = (remoteCompany.description || fallback.description || '')
      .toString()
      .trim();

    const ratingValue = Number.parseFloat(
      remoteCompany.rating !== undefined ? remoteCompany.rating : fallback.rating
    );
    const reviewsValue = Number.parseInt(
      remoteCompany.reviews !== undefined ? remoteCompany.reviews : fallback.reviews,
      10
    );

    const categories = Array.isArray(remoteCompany.categories) && remoteCompany.categories.length
      ? remoteCompany.categories.map((category) => category && category.toString()).filter(Boolean)
      : Array.isArray(fallback.categories)
        ? fallback.categories
        : [];

    const portfolio = Array.isArray(remoteCompany.portfolio) && remoteCompany.portfolio.length
      ? remoteCompany.portfolio
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
      : Array.isArray(fallback.portfolio)
        ? fallback.portfolio
        : [];

    const verifiedStatus = Boolean(
      remoteCompany.verified ||
        remoteCompany.status === 'verified' ||
        fallback.verified ||
        fallback.status === 'verified'
    );

    return {
      name: remoteCompany.companyName || remoteCompany.name || fallback.name || fallback.companyName || 'Impresa registrata',
      companyName:
        remoteCompany.companyName || fallback.companyName || remoteCompany.name || fallback.name || 'Impresa registrata',
      region: remoteCompany.region || fallback.region || '',
      province: remoteCompany.province || fallback.province || '',
      rating: Number.isFinite(ratingValue) ? Number(ratingValue.toFixed(1)) : Number(fallback.rating) || 0,
      reviews: Number.isFinite(reviewsValue) ? reviewsValue : Number(fallback.reviews) || 0,
      verified: verifiedStatus,
      status: remoteCompany.status || fallback.status || (verifiedStatus ? 'verified' : 'pending'),
      categories,
      description:
        descriptionText ||
        fallback.description ||
        'In attesa di descrizione dettagliata fornita dall\'impresa.',
      contactName: remoteCompany.contactName || fallback.contactName || '',
      phone: remoteCompany.phone || fallback.phone || '',
      email: remoteCompany.email || fallback.email || '',
      vatNumber: remoteCompany.vatNumber || fallback.vatNumber || '',
      createdAt: remoteCompany.createdAt || fallback.createdAt || new Date().toISOString(),
      firebaseId: remoteCompany.firebaseId || remoteCompany.id || fallback.firebaseId || null,
      portfolio
    };
  }

  addPendingCompanyFromRemote(remoteCompany, fallbackValues = {}) {
    if (!remoteCompany || typeof remoteCompany !== 'object') return;

    const firebaseId = remoteCompany.firebaseId || remoteCompany.id;
    if (!firebaseId) {
      return;
    }

    const existing = this.data.companies.find((company) => company.firebaseId === firebaseId);
    const normalized = this.normalizeRemoteCompany(remoteCompany, existing || fallbackValues);

    if (existing) {
      const preservedId = existing.id;
      Object.assign(existing, normalized, { id: preservedId, firebaseId });
    } else {
      const newId = this.generateCompanyId();
      const companyToAdd = { id: newId, ...normalized, firebaseId };
      this.data.companies.push(companyToAdd);
      this.companyIdByFirebaseId.set(firebaseId, newId);
    }

    if (existing) {
      this.companyIdByFirebaseId.set(firebaseId, existing.id);
    }

    this.remoteCompanyIds.add(firebaseId);
  }

  resolveCompanyId(firebaseId) {
    if (!firebaseId) {
      return null;
    }

    if (this.companyIdByFirebaseId.has(firebaseId)) {
      return this.companyIdByFirebaseId.get(firebaseId);
    }

    const numericId = Number.parseInt(firebaseId, 10);
    if (Number.isFinite(numericId)) {
      return numericId;
    }

    return null;
  }

  normalizeRemoteReview(remoteReview, existingReview) {
    const firebaseId = remoteReview.firebaseId || remoteReview.id || (existingReview && existingReview.firebaseId);
    const ratingSource =
      remoteReview.rating !== undefined
        ? remoteReview.rating
        : existingReview
          ? existingReview.rating
          : 0;
    const ratingValue = Number.parseInt(ratingSource, 10);
    const companyFirebaseId =
      remoteReview.companyFirebaseId || remoteReview.companyId || remoteReview.company || (existingReview && existingReview.companyFirebaseId);

    let resolvedCompanyId = this.resolveCompanyId(companyFirebaseId);
    if (resolvedCompanyId === null || resolvedCompanyId === undefined) {
      const numericCompanyId = Number.parseInt(remoteReview.companyId, 10);
      if (Number.isFinite(numericCompanyId)) {
        resolvedCompanyId = numericCompanyId;
      } else if (existingReview && existingReview.companyId !== undefined) {
        resolvedCompanyId = existingReview.companyId;
      } else {
        resolvedCompanyId = null;
      }
    }

    const requiresInspectionSource =
      remoteReview.requiresInspection !== undefined
        ? remoteReview.requiresInspection
        : remoteReview.requires_inspection !== undefined
          ? remoteReview.requires_inspection
          : existingReview
            ? existingReview.requiresInspection
            : false;

    return {
      id: existingReview ? existingReview.id : this.generateReviewId(),
      firebaseId: firebaseId || null,
      companyId: resolvedCompanyId,
      companyFirebaseId,
      user: remoteReview.user || remoteReview.author || (existingReview ? existingReview.user : 'Utente'),
      rating: Number.isFinite(ratingValue) ? ratingValue : existingReview ? existingReview.rating : 0,
      text: (remoteReview.text || remoteReview.comment || (existingReview ? existingReview.text : '')).toString(),
      status: remoteReview.status || (existingReview ? existingReview.status : 'pending'),
      requiresInspection: Boolean(requiresInspectionSource)
    };
  }

  syncRemoteReviews(remoteReviews = []) {
    if (!Array.isArray(remoteReviews) || remoteReviews.length === 0) {
      return;
    }

    let updated = false;

    remoteReviews.forEach((remoteReview) => {
      if (!remoteReview || typeof remoteReview !== 'object') {
        return;
      }

      const firebaseId = remoteReview.firebaseId || remoteReview.id;
      if (!firebaseId) {
        return;
      }

      const existing = this.data.reviews.find((review) => review.firebaseId === firebaseId);
      const normalized = this.normalizeRemoteReview(remoteReview, existing);

      if (existing) {
        Object.assign(existing, normalized);
      } else {
        this.data.reviews.push(normalized);
      }

      this.remoteReviewIds.add(firebaseId);
      updated = true;
    });

    if (!updated) {
      return;
    }

    this.renderAdminDashboard();

    if (this.currentPage === 'company-profile' && this.activeCompanyId) {
      const activeCompany = this.data.companies.find((company) => company.id === this.activeCompanyId);
      if (activeCompany) {
        this.renderCompanyProfile(activeCompany);
      }
    }
  }

  syncRemoteCompanies(remoteCompanies = []) {
    if (!Array.isArray(remoteCompanies) || remoteCompanies.length === 0) {
      return;
    }

    let hasUpdates = false;

    remoteCompanies.forEach((remoteCompany) => {
      if (!remoteCompany || typeof remoteCompany !== 'object') {
        return;
      }

      const firebaseId = remoteCompany.firebaseId || remoteCompany.id;
      if (!firebaseId) {
        return;
      }

      const existing = this.data.companies.find((company) => company.firebaseId === firebaseId);
      const previousSnapshot = existing ? { ...existing } : null;

      this.addPendingCompanyFromRemote(remoteCompany, existing || {});

      if (!existing) {
        hasUpdates = true;
        return;
      }

      if (previousSnapshot) {
        const keysToCompare = [
          'name',
          'region',
          'province',
          'rating',
          'reviews',
          'verified',
          'status',
          'description',
          'contactName',
          'email',
          'vatNumber'
        ];

        const hasChanged = keysToCompare.some((key) => previousSnapshot[key] !== existing[key]);
        if (hasChanged) {
          hasUpdates = true;
        }
      }
    });

    if (!hasUpdates) {
      return;
    }

    this.renderFeaturedCompanies();
    this.renderAdminDashboard();

    if (this.currentPage === 'search-results') {
      this.renderSearchResults(this.filterCompanies());
    }

    if (this.currentPage === 'company-profile' && this.activeCompanyId) {
      const activeCompany = this.data.companies.find((company) => company.id === this.activeCompanyId);
      if (activeCompany) {
        this.renderCompanyProfile(activeCompany);
      }
    }
  }

  async loadRemoteData() {
    try {
      const response = await fetch('/api/public/bootstrap', {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      if (!payload || !payload.success) {
        return;
      }

      if (Array.isArray(payload.companies)) {
        this.syncRemoteCompanies(payload.companies);
      }

      if (Array.isArray(payload.reviews)) {
        this.syncRemoteReviews(payload.reviews);
      }
    } catch (error) {
      console.warn('Dati remoti non disponibili, verranno usati quelli dimostrativi.', error);
    }
  }

  init() {
    this.bindNavigation();
    this.bindSearchForm();
    this.bindCategoryCards();
    this.setupFilters();
    this.bindAuthForms();
    this.bindLogout();

    this.navigate('home');
    this.renderFeaturedCompanies();
    this.renderAdminDashboard();
    this.updateAuthUI();
    this.loadRemoteData();
  }

  bindNavigation() {
    const navigableElements = document.querySelectorAll('[data-page]');
    navigableElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const targetPage = element.getAttribute('data-page');
        if (!targetPage) {
          return;
        }
        event.preventDefault();
        if (targetPage === 'login' && this.currentUser) {
          return;
        }
        if (targetPage === 'register') {
          const desiredType = element.getAttribute('data-register-type');
          this.pendingRegisterType = desiredType || 'user';
        }
        this.navigate(targetPage);
      });
    });
  }

  bindAuthForms() {
    const registerForm = document.getElementById('register-account-form');
    if (registerForm) {
      const typeInputs = registerForm.querySelectorAll('input[name="accountType"]');
      typeInputs.forEach((input) => {
        input.addEventListener('change', () => {
          this.setRegisterFormType(input.value);
        });
      });

      const initialType =
        registerForm.querySelector('input[name="accountType"]:checked')?.value || 'user';
      this.setRegisterFormType(initialType);

      registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        this.clearFormFeedback(registerForm);

        const formData = new FormData(registerForm);
        const accountType = formData.get('accountType') === 'company' ? 'company' : 'user';

        if (accountType === 'company') {
          const values = {
            companyName: (formData.get('companyName') || '').toString().trim(),
            vatNumber: (formData.get('vatNumber') || '').toString().trim(),
            region: (formData.get('region') || '').toString(),
            province: (formData.get('province') || '').toString().trim(),
            contactName: (formData.get('contactName') || '').toString().trim(),
            email: (formData.get('email') || '').toString().trim(),
            password: (formData.get('password') || '').toString(),
            confirmPassword: (formData.get('confirmPassword') || '').toString(),
            description: (formData.get('description') || '').toString().trim(),
            phone: (formData.get('phone') || '').toString().trim()
          };

          if (
            !values.companyName ||
            !values.vatNumber ||
            !values.region ||
            !values.province ||
            !values.contactName ||
            !values.email
          ) {
            this.showFormFeedback(registerForm, 'error', 'Compila tutti i campi obbligatori.');
            return;
          }

          if (values.password.length < 6) {
            this.showFormFeedback(registerForm, 'error', 'La password deve contenere almeno 6 caratteri.');
            return;
          }

          if (values.password !== values.confirmPassword) {
            this.showFormFeedback(registerForm, 'error', 'Le password non coincidono.');
            return;
          }

          const registration = await this.auth.registerCompany(values);

          if (!registration.success) {
            this.showFormFeedback(
              registerForm,
              'error',
              this.getAuthErrorMessage(registration.error, registration.message)
            );
            return;
          }

          this.addPendingCompanyFromRemote(registration.company, values);
          this.renderAdminDashboard();

          registerForm.reset();
          this.setRegisterFormType('company');
          this.showFormFeedback(
            registerForm,
            'success',
            'Richiesta inviata! Ti contatteremo appena la verifica documentale sarà completata.'
          );
          return;
        }

        const fullName = (formData.get('fullName') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();

        if (!fullName || !email || !password) {
          this.showFormFeedback(registerForm, 'error', 'Compila tutti i campi obbligatori.');
          return;
        }

        if (password.length < 6) {
          this.showFormFeedback(registerForm, 'error', 'La password deve contenere almeno 6 caratteri.');
          return;
        }

        if (password !== confirmPassword) {
          this.showFormFeedback(registerForm, 'error', 'Le password non coincidono.');
          return;
        }

        const result = await this.auth.registerUser({
          fullName,
          email,
          password
        });

        if (!result.success) {
          this.showFormFeedback(registerForm, 'error', this.getAuthErrorMessage(result.error, result.message));
          return;
        }

        registerForm.reset();
        this.setRegisterFormType('user');
        this.showFormFeedback(registerForm, 'success', 'Registrazione completata! Ora puoi accedere con le tue credenziali.');
        window.setTimeout(() => {
          this.clearFormFeedback(registerForm);
          this.navigate('login');
        }, 1000);
      });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        this.clearFormFeedback(loginForm);

        const formData = new FormData(loginForm);
        const email = (formData.get('email') || '').toString().trim();
        const password = (formData.get('password') || '').toString();

        if (!email || !password) {
          this.showFormFeedback(loginForm, 'error', 'Inserisci email e password per continuare.');
          return;
        }

        const loginResult = await this.auth.login({ email, password });
        if (!loginResult.success) {
          this.showFormFeedback(loginForm, 'error', this.getAuthErrorMessage(loginResult.error, loginResult.message));
          return;
        }

        this.currentUser = loginResult.account;
        this.updateAuthUI();
        loginForm.reset();
        this.showFormFeedback(loginForm, 'success', 'Accesso riuscito! Stiamo preparando il tuo spazio.');
        this.showNotification(
          `Benvenuto ${this.currentUser.displayName}! Accesso come ${this.getRoleLabel(this.currentUser.role)} effettuato.`,
          'success',
          4000
        );

        const destination = this.currentUser.role === 'admin' ? 'admin-dashboard' : 'home';
        window.setTimeout(() => {
          this.clearFormFeedback(loginForm);
          this.navigate(destination);
        }, 800);
      });
    }
  }

  setRegisterFormType(type) {
    const registerForm = document.getElementById('register-account-form');
    if (!registerForm) return;

    const normalizedType = type === 'company' ? 'company' : 'user';
    registerForm.dataset.selectedType = normalizedType;

    const options = registerForm.querySelectorAll('.register-type-option');
    options.forEach((option) => {
      const input = option.querySelector('input[name="accountType"]');
      const isActive = input && input.value === normalizedType;
      if (input) {
        input.checked = Boolean(isActive);
      }
      option.classList.toggle('register-type-option--active', Boolean(isActive));
    });

    const fieldGroups = registerForm.querySelectorAll('[data-register-fields]');
    fieldGroups.forEach((group) => {
      const groupType = group.getAttribute('data-register-fields');
      const isActive = groupType === normalizedType;
      group.classList.toggle('hidden', !isActive);
      const inputs = group.querySelectorAll('input, select, textarea');
      inputs.forEach((field) => {
        field.disabled = !isActive;
      });
    });
  }

  bindLogout() {
    const logoutButton = document.getElementById('logout-btn');
    if (!logoutButton) return;
    logoutButton.addEventListener('click', () => {
      this.auth.logout();
      this.currentUser = null;
      this.updateAuthUI();
      this.showNotification('Hai effettuato il logout. A presto!', 'info', 4000);
      this.navigate('home');
    });
  }

  updateAuthUI() {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-user-button');
    const userMenu = document.getElementById('user-menu');
    const userNameLabel = document.getElementById('user-menu-name');
    const userRoleLabel = document.getElementById('user-menu-role');
    const adminButton = document.getElementById('admin-btn');

    if (this.currentUser) {
      if (loginButton) loginButton.classList.add('hidden');
      if (registerButton) registerButton.classList.add('hidden');
      if (userMenu) {
        userMenu.classList.remove('hidden');
        userMenu.classList.add('flex');
      }
      if (userNameLabel) userNameLabel.textContent = this.currentUser.displayName;
      if (userRoleLabel) userRoleLabel.textContent = this.getRoleLabel(this.currentUser.role);
      if (adminButton) {
        if (this.currentUser.role === 'admin') {
          adminButton.classList.remove('hidden');
        } else {
          adminButton.classList.add('hidden');
        }
      }
    } else {
      if (loginButton) loginButton.classList.remove('hidden');
      if (registerButton) registerButton.classList.remove('hidden');
      if (userMenu) {
        userMenu.classList.add('hidden');
        userMenu.classList.remove('flex');
      }
      if (adminButton) {
        adminButton.classList.add('hidden');
      }
    }

    this.updateSessionBanner();
  }

  updateSessionBanner() {
    const banner = document.getElementById('session-banner');
    const text = document.getElementById('session-banner-text');
    if (!banner || !text) return;

    banner.classList.remove('bg-emerald-50', 'border-emerald-200', 'bg-rose-50', 'border-rose-100');
    text.classList.remove('text-emerald-700', 'text-rose-700');
    banner.classList.add('bg-blue-50', 'border-blue-100');
    text.classList.add('text-blue-700');

    if (this.currentUser) {
      text.textContent = `Accesso effettuato come ${this.currentUser.displayName} (${this.getRoleLabel(
        this.currentUser.role
      )}).`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
      text.textContent = '';
    }
  }

  showNotification(message, type = 'info', duration = 5000) {
    const banner = document.getElementById('session-banner');
    const text = document.getElementById('session-banner-text');
    if (!banner || !text) return;

    const palettes = {
      info: { background: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
      success: { background: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
      error: { background: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' }
    };

    const palette = palettes[type] || palettes.info;

    banner.classList.remove('bg-blue-50', 'border-blue-100', 'bg-emerald-50', 'border-emerald-200', 'bg-rose-50', 'border-rose-100');
    text.classList.remove('text-blue-700', 'text-emerald-700', 'text-rose-700');

    banner.classList.add(palette.background, palette.border);
    text.classList.add(palette.text);
    text.textContent = message;
    banner.classList.remove('hidden');

    if (this.notificationTimeout) {
      window.clearTimeout(this.notificationTimeout);
      this.notificationTimeout = null;
    }

    if (duration) {
      this.notificationTimeout = window.setTimeout(() => {
        this.notificationTimeout = null;
        this.updateSessionBanner();
      }, duration);
    }
  }

  showFormFeedback(form, type, message) {
    const feedback = form.querySelector('.form-feedback');
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('hidden', 'form-feedback--error', 'form-feedback--success');
    feedback.classList.add(type === 'success' ? 'form-feedback--success' : 'form-feedback--error');
  }

  clearFormFeedback(form) {
    const feedback = form.querySelector('.form-feedback');
    if (!feedback) return;
    feedback.textContent = '';
    feedback.classList.add('hidden');
    feedback.classList.remove('form-feedback--error', 'form-feedback--success');
  }

  getAuthErrorMessage(code, fallbackMessage) {
    switch (code) {
      case 'EMAIL_EXISTS':
        return 'Esiste già un account registrato con questa email.';
      case 'WEAK_PASSWORD':
      case 'WEAK_PASSWORD : Password should be at least 6 characters':
        return 'La password deve contenere almeno 6 caratteri.';
      case 'INVALID_PASSWORD':
      case 'INVALID_LOGIN_CREDENTIALS':
      case 'INVALID_CREDENTIALS':
      case 'EMAIL_NOT_FOUND':
        return 'Credenziali non valide. Verifica email e password.';
      case 'USER_DISABLED':
        return 'Questo account è stato disabilitato. Contatta il supporto per maggiori informazioni.';
      case 'MISSING_FIELDS':
        return 'Compila tutti i campi obbligatori.';
      case 'NETWORK_ERROR':
        return 'Connessione assente o instabile. Controlla la rete e riprova.';
      case 'FIREBASE_CONFIG_MISSING':
        return 'Configurazione Firebase assente. Verifica le variabili d\'ambiente del server.';
      case 'PROFILE_NOT_FOUND':
        return 'Non è stato possibile individuare un profilo associato a queste credenziali.';
      case 'REQUEST_FAILED':
        return fallbackMessage || 'Impossibile completare la richiesta. Riprova più tardi.';
      default:
        return fallbackMessage || 'Si è verificato un errore inatteso. Riprova più tardi.';
    }
  }

  getRoleLabel(role) {
    return ROLE_LABELS[role] || role;
  }

  bindSearchForm() {
    const form = document.getElementById('hero-search-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const termInput = document.getElementById('search-job-input');
      const regionSelect = document.getElementById('search-region-select');
      this.searchCompanies({
        term: termInput ? termInput.value : '',
        region: regionSelect ? regionSelect.value : ''
      });
    });
  }

  bindCategoryCards() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const category = card.getAttribute('data-category') || '';
        this.searchCompanies({ category });
      });
    });
  }

  setupFilters() {
    const regionSelect = document.getElementById('filter-region');
    const categorySelect = document.getElementById('filter-category');
    const ratingButtons = document.querySelectorAll('.rating-filter');
    const resetButton = document.getElementById('reset-filters');

    if (regionSelect) {
      regionSelect.addEventListener('change', () => {
        this.searchCompanies({ region: regionSelect.value });
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener('change', () => {
        this.searchCompanies({ category: categorySelect.value });
      });
    }

    ratingButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const rating = Number(button.dataset.rating || 0);
        this.searchCompanies({ rating });
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        this.currentFilters = { term: '', region: '', category: '', rating: 0 };
        this.updateFilterControls();
        this.searchCompanies({});
      });
    }
  }

  navigate(pageId) {
    this.closeActiveModal();
    this.pages.forEach((page) => page.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.currentPage = pageId;
      if (pageId !== 'company-profile') {
        this.activeCompanyId = null;
      }
      if (pageId === 'register') {
        const desiredType = this.pendingRegisterType || 'user';
        this.setRegisterFormType(desiredType);
        this.pendingRegisterType = null;
      }
    } else {
      console.error(`Page with id 'page-${pageId}' not found.`);
    }
  }

  renderStars(rating) {
    const numericRating = Number.parseFloat(rating);
    const safeRating = Number.isFinite(numericRating) ? numericRating : 0;
    let stars = '';
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i += 1) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = Math.ceil(safeRating); i < 5; i += 1) {
      stars += '<i class="far fa-star"></i>';
    }
    return `<div class="stars flex items-center">${stars}</div>`;
  }

  renderCompanyCard(company) {
    const fallbackImage = 'https://placehold.co/400x250/e2e8f0/94a3b8?text=Foto+non+disponibile';
    const firstPortfolioItem =
      Array.isArray(company.portfolio) && company.portfolio.length ? company.portfolio[0] : null;
    const imageUrl = (firstPortfolioItem && firstPortfolioItem.img) || fallbackImage;
    const location = [company.province, company.region].filter(Boolean).join(', ') || 'Località da definire';

    const categoriesArray = Array.isArray(company.categories) ? company.categories : [];
    const categories = categoriesArray
      .map((category) => `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">${category}</span>`)
      .join('');

    return `
      <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer" data-company-id="${company.id}">
        <div class="overflow-hidden h-48">
          <img src="${imageUrl}" alt="Foto lavoro di ${company.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-2 gap-2">
            <h3 class="text-lg font-bold truncate">${company.name}</h3>
            ${company.verified ? '<span class="badge-verified flex-shrink-0"><i class="fas fa-check-circle"></i>Verificata</span>' : ''}
          </div>
          <p class="text-sm text-gray-500 mb-3">${location}</p>
          <div class="flex items-center space-x-2 mb-4">
            ${this.renderStars(company.rating)}
            <span class="text-sm text-gray-600">(${company.reviews} recensioni)</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${categories}
          </div>
        </div>
      </article>
    `;
  }

  renderFeaturedCompanies() {
    const container = document.getElementById('featured-companies');
    if (!container) return;

    const featured = this.data.companies.filter((company) => company.verified).slice(0, 3);
    container.innerHTML = featured.map((company) => this.renderCompanyCard(company)).join('');
    this.bindCompanyCards(container);
  }

  bindCompanyCards(container) {
    const cards = container.querySelectorAll('[data-company-id]');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const companyId = Number(card.getAttribute('data-company-id'));
        this.showCompanyProfile(companyId);
      });
    });
  }

  filterCompanies() {
    const { term, region, category, rating } = this.currentFilters;
    const normalizedTerm = term.trim().toLowerCase();

    return this.data.companies.filter((company) => {
      if (!company.verified) return false;

      const companyCategories = Array.isArray(company.categories) ? company.categories : [];
      const companyDescription = (company.description || '').toString();
      const matchesTerm =
        !normalizedTerm ||
        company.name.toLowerCase().includes(normalizedTerm) ||
        companyDescription.toLowerCase().includes(normalizedTerm) ||
        companyCategories.some((cat) => cat.toLowerCase().includes(normalizedTerm));

      const matchesRegion = !region || company.region === region;
      const matchesCategory = !category || companyCategories.includes(category);
      const numericRating = Number.parseFloat(company.rating);
      const ratingValue = Number.isFinite(numericRating) ? numericRating : 0;
      const matchesRating = !rating || ratingValue >= rating;

      return matchesTerm && matchesRegion && matchesCategory && matchesRating;
    });
  }

  searchCompanies(partialFilters) {
    this.currentFilters = {
      ...this.currentFilters,
      ...partialFilters
    };

    if (typeof this.currentFilters.rating !== 'number') {
      this.currentFilters.rating = Number(this.currentFilters.rating) || 0;
    }

    this.updateFilterControls();
    const results = this.filterCompanies();
    this.renderSearchResults(results);
    this.navigate('search-results');
  }

  updateFilterControls() {
    const regionSelect = document.getElementById('filter-region');
    const categorySelect = document.getElementById('filter-category');
    const ratingButtons = document.querySelectorAll('.rating-filter');

    if (regionSelect) {
      regionSelect.value = this.currentFilters.region || '';
    }

    if (categorySelect) {
      categorySelect.value = this.currentFilters.category || '';
    }

    ratingButtons.forEach((button) => {
      const ratingValue = Number(button.dataset.rating || 0);
      if (ratingValue === this.currentFilters.rating) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  renderSearchResults(companies) {
    const container = document.getElementById('search-results-list');
    const summary = document.getElementById('search-results-summary');

    if (!container || !summary) return;

    if (companies.length === 0) {
      container.innerHTML = '<div class="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Nessuna impresa trovata. Prova a modificare i filtri di ricerca.</div>';
      summary.textContent = this.buildSummaryText(0);
      return;
    }

    container.innerHTML = companies.map((company) => this.renderCompanyCard(company)).join('');
    summary.textContent = this.buildSummaryText(companies.length);
    this.bindCompanyCards(container);
  }

  buildSummaryText(count) {
    const parts = [];
    if (this.currentFilters.term) {
      parts.push(`per "${this.currentFilters.term}"`);
    }
    if (this.currentFilters.region) {
      parts.push(`in ${this.currentFilters.region}`);
    }
    if (this.currentFilters.category) {
      parts.push(`categoria ${this.currentFilters.category}`);
    }
    if (this.currentFilters.rating) {
      parts.push(`valutazione minima ${this.currentFilters.rating} stelle`);
    }

    const filtersSummary = parts.length > 0 ? ` ${parts.join(', ')}` : '';
    return `${count} impresa${count === 1 ? '' : 'e'} trovata${count === 1 ? '' : 'e'}${filtersSummary}.`;
  }

  renderCompanyProfile(company) {
    const container = document.getElementById('page-company-profile');
    if (!container) return;

    const companyReviews = this.data.reviews.filter((review) => {
      if (!review || review.status !== 'approved') {
        return false;
      }

      const matchesLocalId = review.companyId === company.id;
      const matchesFirebaseId =
        company.firebaseId &&
        (review.companyFirebaseId === company.firebaseId || review.companyId === company.firebaseId);

      return matchesLocalId || matchesFirebaseId;
    });

    container.innerHTML = `
      <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <div class="flex flex-col md:flex-row gap-6 items-start border-b pb-6 mb-6">
          <div class="w-full">
            <div class="flex flex-col sm:flex-row justify-between items-start mb-2 gap-3">
              <h1 class="text-3xl md:text-4xl font-bold">${company.name}</h1>
              ${company.verified ? '<span class="badge-verified text-base px-3 py-1 flex-shrink-0"><i class="fas fa-check-circle"></i>Impresa Verificata</span>' : ''}
            </div>
            <p class="text-gray-500 mb-4">${company.province}, ${company.region}</p>
            <div class="flex items-center space-x-2">
              ${this.renderStars(company.rating)}
              <span class="text-gray-600"><strong>${Number(company.rating || 0).toFixed(1)}</strong> su 5 (${Number(company.reviews || 0)} recensioni)</span>
            </div>
          </div>
          <div class="flex-shrink-0 w-full md:w-auto">
            <button class="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition" type="button">
              <i class="fas fa-envelope mr-2"></i>Contatta l'Impresa
            </button>
          </div>
        </div>

        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <a href="#" class="company-tab active-tab" data-tab="info">Informazioni</a>
              <a href="#" class="company-tab" data-tab="portfolio">Portfolio Lavori</a>
              <a href="#" class="company-tab" data-tab="reviews">Recensioni</a>
            </nav>
          </div>
        </div>

        <div id="company-tab-content">
          <section class="company-tab-pane" data-tab-content="info">
            <h2 class="text-2xl font-bold mb-4">Chi Siamo</h2>
            <p class="text-gray-700 leading-relaxed">${company.description}</p>
            ${
              company.contactName || company.email || company.vatNumber
                ? `
                  <div class="mt-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    ${company.contactName ? `<p><i class="fas fa-user-tie mr-2 text-blue-500"></i>Referente: ${company.contactName}</p>` : ''}
                    ${company.email ? `<p><i class="fas fa-envelope mr-2 text-blue-500"></i>Email: <a href="mailto:${company.email}" class="text-blue-600 hover:underline">${company.email}</a></p>` : ''}
                    ${company.vatNumber ? `<p><i class="fas fa-file-invoice mr-2 text-blue-500"></i>P.IVA: ${company.vatNumber}</p>` : ''}
                    ${company.region ? `<p><i class="fas fa-map-marker-alt mr-2 text-blue-500"></i>Operatività: ${[company.province, company.region].filter(Boolean).join(', ')}</p>` : ''}
                  </div>
                `
                : ''
            }
          </section>

          <section class="company-tab-pane hidden" data-tab-content="portfolio">
            <h2 class="text-2xl font-bold mb-4">I nostri Lavori</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${
                Array.isArray(company.portfolio) && company.portfolio.length
                  ? company.portfolio
                      .map(
                        (project, index) => `
                    <article class="rounded-lg overflow-hidden border group portfolio-card" role="button" tabindex="0" data-portfolio-project="${index}">
                      <div class="overflow-hidden">
                        <img src="${project.img}" alt="${project.title}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform">
                      </div>
                      <div class="bg-gray-50 p-3 flex items-start justify-between gap-3">
                        <div>
                          <p class="font-semibold">${project.title}</p>
                          <p class="text-sm text-gray-500">${project.year || ''}</p>
                        </div>
                        <span class="text-sm font-semibold text-blue-600 flex items-center gap-1 whitespace-nowrap">
                          Dettagli
                          <i class="fas fa-arrow-right text-xs"></i>
                        </span>
                      </div>
                    </article>
                        `
                      )
                      .join('')
                  : '<p class="text-gray-500">Nessun lavoro nel portfolio.</p>'
              }
            </div>
          </section>

          <section class="company-tab-pane hidden" data-tab-content="reviews">
            <div class="flex justify-between items-center mb-4 gap-4 flex-wrap">
              <h2 class="text-2xl font-bold">Recensioni (${companyReviews.length})</h2>
              <button class="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700" type="button" data-company-review="${company.id}">
                <i class="fas fa-plus mr-2"></i>Lascia una recensione
              </button>
            </div>
            <div class="space-y-6">
              ${companyReviews
                .map(
                  (review) => `
                    <article class="p-4 border rounded-lg bg-gray-50/50">
                      <div class="flex items-center mb-2 gap-4">
                        <span class="font-semibold">${review.user}</span>
                        <div>${this.renderStars(review.rating)}</div>
                      </div>
                      <p class="text-gray-700">${review.text}</p>
                    </article>
                  `
                )
                .join('') || '<p class="text-gray-500">Questa impresa non ha ancora recensioni.</p>'}
            </div>
          </section>
        </div>
      </div>
    `;

    this.activeCompany = company;
    this.setupCompanyTabs();
    this.setupPortfolioProjects(company);
    const reviewButton = container.querySelector('[data-company-review]');
    if (reviewButton) {
      reviewButton.addEventListener('click', () => {
        const companyId = Number(reviewButton.getAttribute('data-company-review'));
        this.showLeaveReviewPage(companyId);
      });
    }
  }

  setupCompanyTabs() {
    const tabs = document.querySelectorAll('.company-tab');
    const panes = document.querySelectorAll('[data-tab-content]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        const target = tab.getAttribute('data-tab');
        if (!target) return;

        tabs.forEach((t) => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');

        panes.forEach((pane) => {
          if (pane.getAttribute('data-tab-content') === target) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        });
      });
    });
  }

  setupPortfolioProjects(company) {
    const container = document.getElementById('page-company-profile');
    if (!container) return;

    const cards = container.querySelectorAll('[data-portfolio-project]');
    if (!cards.length) return;

    cards.forEach((card) => {
      const projectIndex = Number.parseInt(card.getAttribute('data-portfolio-project'), 10);
      if (!Number.isFinite(projectIndex)) {
        return;
      }

      const openDetails = (event) => {
        if (event) {
          event.preventDefault();
        }
        this.openProjectDetails(company, projectIndex);
      };

      card.addEventListener('click', openDetails);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetails();
        }
      });
    });
  }

  openProjectDetails(company, projectIndex) {
    if (!company || !Array.isArray(company.portfolio)) {
      return;
    }

    const project = company.portfolio[projectIndex];
    if (!project) {
      return;
    }

    this.showProjectModal(company, project);
  }

  showProjectModal(company, project) {
    if (this.activeModalOverlay) {
      this.closeActiveModal();
    }

    const galleryImages = Array.isArray(project.images) && project.images.length
      ? project.images
      : [project.img].filter(Boolean);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-label="Dettagli progetto ${project.title}">
        <button type="button" class="modal-close" aria-label="Chiudi" data-modal-close>
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-header">
          <p class="text-sm uppercase tracking-wide text-blue-600 font-semibold mb-1">${company.name}</p>
          <h3 class="text-2xl font-bold text-slate-900">${project.title}</h3>
          ${project.year ? `<p class="text-sm text-slate-500">${project.year}</p>` : ''}
        </div>
        ${
          project.description
            ? `<p class="mt-4 text-slate-700 leading-relaxed">${project.description}</p>`
            : ''
        }
        ${
          galleryImages.length
            ? `
              <div class="project-gallery mt-6">
                ${galleryImages
                  .map(
                    (imageUrl, index) => `
                      <figure class="project-gallery__item">
                        <img src="${imageUrl}" alt="${project.title} - immagine ${index + 1}" loading="lazy">
                      </figure>
                    `
                  )
                  .join('')}
              </div>
            `
            : ''
        }
      </div>
    `;

    const closeModal = () => {
      overlay.classList.remove('modal-overlay--visible');
      window.setTimeout(() => {
        overlay.remove();
      }, 200);
      document.removeEventListener('keydown', onKeyDown);
      this.activeModalOverlay = null;
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeModal();
      }
    });

    const closeButton = overlay.querySelector('[data-modal-close]');
    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.classList.add('modal-overlay--visible');
    });

    document.addEventListener('keydown', onKeyDown);
    this.activeModalOverlay = overlay;
  }

  closeActiveModal() {
    if (!this.activeModalOverlay) {
      return;
    }

    this.activeModalOverlay.classList.remove('modal-overlay--visible');
    window.setTimeout(() => {
      this.activeModalOverlay?.remove();
      this.activeModalOverlay = null;
    }, 200);
  }

  renderLeaveReviewPage(companyId) {
    const company = this.data.companies.find((item) => item.id === companyId);
    const container = document.getElementById('page-leave-review');
    if (!company || !container) return;

    container.innerHTML = `
      <h1 class="text-3xl font-bold mb-2 text-center">Lascia una recensione per</h1>
      <p class="text-xl text-gray-600 mb-6 text-center">${company.name}</p>
      <form class="space-y-4" id="review-form">
        <div>
          <label class="block text-sm font-medium">La tua valutazione</label>
          <div class="flex text-3xl text-gray-300 cursor-pointer star-rating" aria-label="Valutazione da 1 a 5 stelle">
            <i class="far fa-star" data-value="1"></i>
            <i class="far fa-star" data-value="2"></i>
            <i class="far fa-star" data-value="3"></i>
            <i class="far fa-star" data-value="4"></i>
            <i class="far fa-star" data-value="5"></i>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">La tua recensione</label>
          <textarea class="mt-1 w-full p-2 border rounded-md" rows="5" placeholder="Descrivi la tua esperienza..."></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">Allega foto del lavoro (opzionale)</label>
          <input type="file" class="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
        </div>
        <button type="submit" class="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Invia Recensione</button>
      </form>
    `;

    const stars = container.querySelectorAll('.star-rating i');
    stars.forEach((star) => {
      star.addEventListener('mouseover', (event) => this.handleStarHover(event, stars));
      star.addEventListener('click', (event) => this.handleStarClick(event, stars));
      star.addEventListener('mouseout', () => this.handleStarMouseOut(stars));
    });

    const form = document.getElementById('review-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Grazie per la tua recensione! In questa demo la recensione non viene salvata.');
        this.navigate('company-profile');
      });
    }
  }

  renderAdminDashboard() {
    const pendingCompaniesContainer = document.getElementById('admin-pending-companies');
    const pendingReviewsContainer = document.getElementById('admin-pending-reviews');

    const pendingCompanies = this.data.companies.filter((company) => company.status === 'pending');
    const pendingReviews = this.data.reviews.filter((review) => review.status === 'pending');

    if (pendingCompaniesContainer) {
      pendingCompaniesContainer.innerHTML = pendingCompanies.length
        ? pendingCompanies
            .map((company) => {
              const location = [company.province, company.region].filter(Boolean).join(', ');
              const contactInfo = [
                company.contactName ? `Referente: ${company.contactName}` : '',
                company.email ? `Email: ${company.email}` : '',
                company.vatNumber ? `P.IVA: ${company.vatNumber}` : ''
              ]
                .filter(Boolean)
                .join(' • ');

              return `
                <article class="p-3 border rounded-md bg-yellow-50 space-y-2">
                  <div class="flex justify-between items-start gap-4">
                    <div>
                      <p class="font-semibold">${company.name}</p>
                      <p class="text-sm text-gray-500">${location || 'Località da definire'}</p>
                    </div>
                    <div class="flex gap-2">
                      <button class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600" type="button">Approva</button>
                      <button class="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600" type="button">Rifiuta</button>
                    </div>
                  </div>
                  ${
                    contactInfo
                      ? `<p class="text-xs text-gray-600">${contactInfo}</p>`
                      : ''
                  }
                </article>
              `;
            })
            .join('')
        : '<p class="text-sm text-gray-500">Nessuna impresa da verificare.</p>';
    }

    if (pendingReviewsContainer) {
      pendingReviewsContainer.innerHTML = pendingReviews.length
        ? pendingReviews
            .map((review) => {
              const company = this.data.companies.find(
                (companyItem) =>
                  companyItem.id === review.companyId ||
                  (review.companyFirebaseId && companyItem.firebaseId === review.companyFirebaseId)
              );
              return `
                <article class="p-3 border rounded-md ${review.requiresInspection ? 'bg-red-50' : 'bg-gray-50'}">
                  <div class="flex justify-between items-start gap-3">
                    <div>
                      <p class="font-semibold">Recensione di ${review.user} (${review.rating} <i class="fas fa-star text-xs text-amber-400"></i>)</p>
                      <p class="text-sm text-gray-500">Per: ${company ? company.name : 'Impresa sconosciuta'}</p>
                      <p class="text-sm mt-1 italic">"${review.text}"</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      ${
                        review.requiresInspection
                          ? '<button class="px-3 py-1 text-xs text-white bg-yellow-500 rounded hover:bg-yellow-600" type="button">Avvia Sopralluogo</button>'
                          : ''
                      }
                      <div class="flex gap-2">
                        <button class="px-3 py-1 text-xs text-white bg-green-500 rounded hover:bg-green-600" type="button">Approva</button>
                        <button class="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600" type="button">Rifiuta</button>
                      </div>
                    </div>
                  </div>
                </article>
              `;
            })
            .join('')
        : '<p class="text-sm text-gray-500">Nessuna recensione da moderare.</p>';
    }
  }

  showCompanyProfile(companyId) {
    const company = this.data.companies.find((item) => item.id === companyId);
    if (!company) return;

    this.activeCompanyId = company.id;
    this.renderCompanyProfile(company);
    this.navigate('company-profile');
  }

  showLeaveReviewPage(companyId) {
    this.renderLeaveReviewPage(companyId);
    this.navigate('leave-review');
  }

  handleStarHover(event, stars) {
    const rating = Number(event.target.dataset.value || 0);
    stars.forEach((star) => {
      if (Number(star.dataset.value || 0) <= rating) {
        star.classList.remove('far');
        star.classList.add('fas', 'text-amber-400');
      } else {
        star.classList.add('far');
        star.classList.remove('fas', 'text-amber-400');
      }
    });
  }

  handleStarClick(event, stars) {
    const rating = Number(event.target.dataset.value || 0);
    stars.forEach((star) => {
      star.dataset.selected = Number(star.dataset.value || 0) <= rating ? 'true' : 'false';
    });
    this.handleStarMouseOut(stars);
  }

  handleStarMouseOut(stars) {
    stars.forEach((star) => {
      if (star.dataset.selected === 'true') {
        star.classList.remove('far');
        star.classList.add('fas', 'text-amber-400');
      } else {
        star.classList.add('far');
        star.classList.remove('fas', 'text-amber-400');
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App(MOCK_DATA);
  app.init();
  window.app = app;
});
