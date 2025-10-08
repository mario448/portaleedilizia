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
- Un unico form di registrazione che guida la scelta tra profilo privato e impresa, mostrando i campi necessari per ciascuna tipologia.
- Chat privata tra utenti e imprese con cronologia messaggi sincronizzata su Firebase, accessibile solo ai partecipanti alla conversazione.

### Struttura dati per la chat

Per utilizzare la messaggistica assicurati che nel Realtime Database siano presenti (o che le regole consentano la creazione runtime) i nodi:

- `chats`: contiene i thread con partecipanti, metadati e ultimi messaggi.
- `userChats`: indice delle chat per singolo utente (`userChats/<uid>/<threadId>`).
- `companyChats`: indice delle chat per singola impresa (`companyChats/<companyId>/<threadId>`).

Ogni messaggio viene salvato in `chats/<threadId>/messages` con il ruolo del mittente e il timestamp ISO. Definisci regole di sicurezza Firebase in modo che solo gli utenti coinvolti possano leggere o scrivere nelle rispettive conversazioni.

### Regole di sicurezza consigliate

Un set di regole di esempio per il Realtime Database potrebbe essere:

```json
{
  "rules": {
    "chats": {
      "$threadId": {
        ".read": "auth != null && (auth.uid == data.child('participants/user').val() || auth.uid == data.child('participants/company').val())",
        ".write": "auth != null && (auth.uid == newData.child('participants/user').val() || auth.uid == newData.child('participants/company').val())"
      }
    },
    "userChats": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "companyChats": {
      "$companyId": {
        ".read": "auth != null && auth.uid == $companyId",
        ".write": "auth != null && auth.uid == $companyId"
      }
    }
  }
}
```

Adatta le condizioni alle tue esigenze (ad esempio consentendo l'accesso in lettura agli amministratori) e ricorda di proteggere anche i nodi `profiles` e `companies` in base ai permessi previsti dalla tua applicazione.

## Account demo

- Gli account creati tramite i form di registrazione vengono memorizzati in Firebase e possono essere utilizzati per accedere dalla schermata "Accedi". Il ruolo viene rilevato automaticamente durante il login partendo dalla mail fornita, quindi è sufficiente inserire credenziali corrette senza ulteriori selezioni.
- Per l'accesso amministratore crea manualmente un utente in Firebase Authentication, aggiungilo al nodo `admins` del Realtime Database e utilizza le credenziali corrispondenti nel form di login.
