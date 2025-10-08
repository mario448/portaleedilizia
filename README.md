# Edilizia Verificata

Applicazione web dimostrativa che permette di scoprire imprese edili verificate, consultare i loro profili e gestire l'accesso di utenti, imprese e amministratori tramite Firebase.

## Come avviare il progetto

L'applicazione è una single page application servita da un server Node.js che espone le API necessarie per interagire con Firebase Authentication e Realtime Database.

```bash
npm install
npm start
```

Il server risponderà all'indirizzo [http://localhost:3000](http://localhost:3000).

### Configurazione Firebase

Prima di avviare il server crea un file `.env` partendo da `.env.example` e valorizza le variabili richieste:

```bash
cp .env.example .env
```

- `FIREBASE_API_KEY`: la chiave Web di Firebase (utilizza quella fornita in fase di setup, evitando di pubblicarla nel repository).
- `FIREBASE_DATABASE_URL`: URL del Realtime Database, ad esempio `https://<tuo-progetto>.firebaseio.com`.
- `FIREBASE_SERVICE_EMAIL` e `FIREBASE_SERVICE_PASSWORD` (opzionali): credenziali di un utente di servizio creato in Firebase Authentication. Il server le utilizza per ottenere un token valido con cui leggere in sicurezza le collezioni pubbliche (ad esempio `companies` e `reviews`) e popolare l'interfaccia.

Assicurati inoltre di creare nel Realtime Database le collezioni `profiles`, `companies`, `reviews` e, se desideri usare un account amministratore, `admins`. Se vuoi che i visitatori possano vedere l'elenco aggiornato delle imprese direttamente dal database, crea un utente di servizio con privilegi di sola lettura (ad esempio aggiungendolo al nodo `admins` o definendo regole dedicate) e configura le variabili opzionali indicate sopra.

### Sincronizzazione dei dati pubblici

All'avvio l'interfaccia richiede al server il contenuto della route `GET /api/public/bootstrap`. Se sono state configurate le credenziali del servizio, il backend recupera da Firebase gli elenchi aggiornati di imprese e recensioni e li fonde con i contenuti demo presenti lato client. In assenza delle credenziali o se il recupero fallisce, la web app continua a funzionare con i dati dimostrativi già inclusi nel progetto.

## Funzionalità principali

- Navigazione tra homepage, risultati di ricerca, profilo impresa e sezioni informative.
- Ricerca filtrabile per regione, categoria e valutazione minima.
- Visualizzazione del profilo impresa con tab per informazioni, portfolio e recensioni.
- Sezione amministratore con elenco di imprese e recensioni da moderare (demo statica lato client).
- Form per lasciare una recensione con interazione sulle stelle (demo, non salva i dati).
- Registrazione e accesso per utenti, imprese e amministratori mediante Firebase Authentication con salvataggio dei profili nel Realtime Database.

## Account demo

- Gli account creati tramite i form di registrazione vengono memorizzati in Firebase e possono essere utilizzati per accedere dalla schermata "Accedi". Il ruolo viene rilevato automaticamente durante il login, quindi non è necessario selezionarlo manualmente a meno che tu non voglia forzare un contesto specifico.
- Per l'accesso amministratore crea manualmente un utente in Firebase Authentication, aggiungilo al nodo `admins` del Realtime Database e utilizza le credenziali corrispondenti nel form di login.
