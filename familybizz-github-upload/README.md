# QR-panel — regningoutbounn.dk

> **cPanel-hosting:** den komplette, trin-for-trin guide ligger i
> **[CPANEL-DEPLOY.md](CPANEL-DEPLOY.md)** — upload `qr-panel-cpanel.zip`,
> følg den, og app'en kører på dit cPanel (Passenger/Node 20+).

Et lille, selvstændigt system med:
- `/admin` — dit interne panel (kræver adgangskode)
- `/display` — den offentlige skærm-visning kunderne ser (ingen login)

De to er koblet sammen live via websockets (Socket.io) — så snart du gemmer noget i `/admin`, opdaterer `/display` med det samme, uden at nogen skal genindlæse siden.

## Hold app'en kørende (nedetid = 0)

App'en er bygget til at **ikke** gå ned — men hosting skal holde processen i live:

### cPanel (Passenger) — allerede dækket
Passenger genstarter app-processen automatisk hvis den dør. De indbyggede crash-guards sørger for:
- Ingen route-fejl crashe processen (global handler + 404/500 JSON)
- Atomisk `data.json`-skrivning — strøm-afbrydelser kan ikke korruptere data
- Rate-limit på login/2FA (10 forsøg/10 min pr. IP) — brute-force blokeres
- Ufangede async-fejl logges i stedet for at dræbe processen

### VPS (anbefalet: pm2)
```bash
npm install -g pm2
pm2 start server.js --name familybizz-qr
pm2 save
pm2 startup        # koer ved boot
```
pm2 genstarter automatisk ved crash og ved server-reboot.

## Sådan virker det

- `server.js` er en lille Node.js-server (Express + Socket.io)
- Data gemmes i `data.json` på serveren (session, besked, QR-mål, kundeliste)
- Kun `/admin` er beskyttet af en adgangskode (sat i `.env`)
- `/display` er offentlig med vilje — det er den, der skal stå på en skærm ude i butikken eller linkes fra jeres domæne

## Kør lokalt (for at teste)

```bash
npm install
cp .env.example .env
# ret ADMIN_PASSWORD i .env til noget rigtigt
npm start
```

Åbn `http://localhost:3000/admin` og `http://localhost:3000/display` i hver sin fane.

## Sådan får I det live på jeres rigtige domæne

Jeg kan ikke selv sætte det op på jeres server — det kræver adgang til jeres hosting/DNS, som jeg ikke har. Men her er den korteste vej:

### Mulighed A — simpel VPS (anbefalet hvis I vil eje det selv)
1. Køb en lille VPS (Hetzner, DigitalOcean eller lignende — ca. 30-50 kr/md er rigeligt til dette)
2. Installer Node.js på serveren
3. Upload denne mappe (fx via `git` eller `scp`)
4. Sæt en rigtig adgangskode i `.env`
5. Kør serveren med en proces-manager, så den bliver ved med at køre:
   ```bash
   npm install -g pm2
   pm2 start server.js --name qr-panel
   pm2 save
   ```
6. Sæt en reverse proxy op (nginx) så jeres domæne eller et underdomæne (fx `qr.regningoutbounn.dk`) peger på serveren, og slå HTTPS til med Let's Encrypt (gratis, `certbot`)

### Mulighed B — hurtigere, mindre vedligehold
Platforme som Railway, Render eller Fly.io kan køre denne slags Node-app direkte fra en git-repo, med adgangskode/miljøvariabler sat i deres UI, og giver jer en URL I kan pege jeres domæne på med en CNAME. Kræver ikke selv server-administration.

### Uanset hvad
- Peg fx `qr.regningoutbounn.dk` på serveren, eller læg `/display` ind som en side på jeres eksisterende site
- Skift `ADMIN_PASSWORD` til noget rigtigt sikkert — den styrer adgangen til hele panelet
- `data.json` bør ligge på et vedvarende filsystem (ikke nulstilles ved deploy), ellers mistes session-data ved genstart af serveren

Sig til hvis du vil have hjælp med at skrive nginx-config eller sætte det op på en specifik platform (Railway/Render/VPS) — jeg kan skrive konfigurationen, jeg kan bare ikke selv logge ind og trykke deploy for jer.
