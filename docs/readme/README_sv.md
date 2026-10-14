<div align="center">

<details>
<summary>Välj språk</summary>

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](README_fr.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md) · [Ελληνικά](README_el.md) · [Nederlands](README_nl.md) · **Svenska** · [Čeština](README_cs.md) · [Română](README_ro.md)

</details>

# REA: Reverse Engineer Anything

<a id="one-mcp-for-reverse-engineering-across-binaries-applications-and-runtime-behavior"></a>

### En MCP för reverse engineering av binärer, applikationer och beteende under körning.

**Hittat en intressant funktion? Förstå hur den fungerar, ända ner till maskinkoden.**

[![npm-version](https://img.shields.io/npm/v/rea-agents?style=flat-square&color=cb3837)](https://www.npmjs.com/package/rea-agents)
[![MCP-verktygskatalog](https://img.shields.io/badge/MCP-tool_catalog-5c4ee5?style=flat-square)](../mcp-contracts.md#generated-catalog)
[![Node.js-krav](https://img.shields.io/badge/Node.js-requirements-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#what-you-can-analyze)
[![skills.sh](https://skills.sh/b/morluto/rea?style=flat-square)](https://skills.sh/morluto/rea/reverse-engineer-anything)
[![MIT-licens](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)
[![Discord](https://img.shields.io/discord/1556595354999332884?logo=discord&logoColor=white&label=Discord&color=5865F2)](https://discord.gg/GkcryMnJDM)

<a href="https://trendshift.io/repositories/82054?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-82054" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/82054" alt="morluto%2Frea | Trendshift" width="250" height="55"/></a>

**[Webbplats](https://rea.tools/) · [Guider](https://rea.tools/guides/) · [Exempel](https://rea.tools/showcase/)**

[Kom igång](#quick-start) · [Så fungerar REA](#how-rea-works) · [Vad du kan analysera](#what-you-can-analyze) · [Exempel](#showcases) · [Vanliga frågor](#faq) · [Dokumentation](#documentation)

<code>npx rea-agents setup</code>

</div>

> [!IMPORTANT]
> Hämta REA från [morluto/rea](https://github.com/morluto/rea), [rea.tools](https://rea.tools/) eller [npm-paketet rea-agents](https://www.npmjs.com/package/rea-agents). Följ installations- och releaselänkarna från dessa officiella källor. Ett liknande arkivnamn eller en kopierad README visar inte att en nedladdning är officiell.

---

Vill du förstå hur en funktion i en app fungerar? Be din agent undersöka den med REA. Agenten kan inspektera appen utan källkod, redovisa beläggen och använda resultaten för att skriva och testa en implementation för ditt projekt.

REA ansluter din agent till verktyg för att inspektera native-binärer, JavaScript- och Electron-appar, .NET-assemblies och webbplatser. Samma arbetsflöden finns i terminalen. Analysen körs lokalt och resultaten innehåller belägg och begränsningar för varje slutsats.

Installationen registrerar REA hos din agent och installerar tillhörande arbetsinstruktioner. Native-analys kan använda en befintlig installation av Hopper, Ghidra eller IDA. Installationen kan även installera Hopper med ditt godkännande. Statisk JavaScript-analys kräver ingen native-analysmotor.

> **[Besök REA:s webbplats](https://rea.tools/)** för installationsanvisningar, illustrerade guider och verkliga fallstudier.

<a id="quick-start"></a>

## Kom igång

| Jag vill…                                              | Börja här                                                               |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| Låta min agent undersöka en app                        | [Konfigurera agenten](#set-up-your-agent) och ange en konkret fråga.    |
| Inspektera JavaScript eller Electron utan native-motor | [Använd terminalen](#use-the-terminal) med en lokal katalog eller ASAR. |
| Välja en leverantör för ett annat mål                  | Se [mål och förutsättningar](#what-you-can-analyze).                    |
| Se en färdig rekonstruktion                            | Läs [exemplen](#showcases).                                             |

**Förutsättningar:** Node.js 22.x (>=22.19), 24.x (>=24.11) eller 26+, samt npm.

På Linux kräver Ghidra, JADX, start av firmwareverktyg och statisk JavaScript/Electron-analys ett procps-kompatibelt `ps` i REA:s `PATH` för kontroll av processägarskap. Åtgärder beskrivs i `docs/installation.md` under "Linux owned-process prerequisite".

<a id="set-up-your-agent"></a>

### Konfigurera din agent

Installera Node.js och npm och kör:

```bash
npx rea-agents setup
```

Välj dina agenter, granska de föreslagna ändringarna och godkänn dem. Installationen lägger till REA:s MCP-server och tillhörande arbetsinstruktioner samt säkerhetskopierar befintlig konfiguration. Starta sedan om agenten.

Installationen stöder Claude Code, Codex, Cursor, Gemini CLI, Grok Build och [andra agenter](../installation.md#supported-agents). Se [installation och konfiguration](../installation.md) för leverantörsinställningar och manuell MCP-registrering.

<a id="ask-your-agent"></a>

### Fråga din agent

```text
Undersök hur sökningen fungerar i Notes-appen, visa beläggen och bygg en
liknande funktion för mitt projekt.
```

Ersätt Notes med din målapp och ange funktionen du vill förstå.

<a id="use-the-terminal"></a>

### Använd terminalen

Inspektera en uppackad JavaScript/Electron-appkatalog eller en ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

Resultatet innehåller moduler, importer, Electron-gränser och tillhörande belägg. Ersätt sökvägen med ditt mål, exempelvis `"D:/apps/example"` på Windows.

Installera kommandot `rea` för regelbunden användning:

```bash
npm install --global rea-agents
rea --help
```

Konfigurera först en analysleverantör för native-analys. Se [guiden för CLI och Evidence](../cli.md) för native-kommandon, leverantörsval, ögonblicksbilder och skript.

### Läs ditt första resultat

Kontrollera mål, källpositioner och täckning innan du drar en slutsats. Resultat kan innehålla olösta importer, otillgängliga fakta eller begränsningar även när kommandot avslutas utan fel. Statiska relationer beskriver vad som hittades i de angivna filerna. Bekräfta påståenden om beteende med en relevant runtime-observation eller ett fokuserat test.

<a id="update-rea"></a>

### Uppdatera REA

REA utvecklas snabbt och nya utgåvor innehåller ofta felrättningar. Håll installationen uppdaterad.

För en CLI installerad med `npm install --global` eller `bun add --global`:

```bash
rea update
```

Globala uppdateringar via Bun kräver Bun 1.2.17 eller senare. Uppgradera äldre Bun-versioner manuellt innan du kör `rea update`.

Förnya agentregistreringarna och din skill genom att köra installationskommandot som uppdateringen visar.

Om du använder `npx`, uppdatera agentkonfigurationen med:

```bash
npx rea-agents@latest setup
```

Granska ändringarna och starta om agenten. Använd `npx rea-agents@latest` följt av kommandot för enstaka CLI-anrop. Med Bun ersätter du `npx rea-agents@latest` med `bunx rea-agents@latest`.

<div align="center">

<br />

<img src="../assets/rea-hopper-analysis.png" alt="REA startar sin analysbrygga i Hopper för att inspektera en native-binär" width="1200" />

<br /><br />

<table aria-label="REA-gemenskapen">
<tr>
<td align="center" width="360">
  <a href="https://discord.gg/GkcryMnJDM">
    <img src="../assets/discord.svg" height="42" alt="Discord" /><br />
    <strong>Gå med i gemenskapen för reverse engineering</strong>
  </a><br />
  <sub>Discord · Frågor och svar · Visa dina projekt</sub>
</td>
</tr>
</table>

<br />

</div>

<a id="how-rea-works"></a>

## Så fungerar REA

Agenten anropar REA via MCP för att inspektera målet och följa relevant kod. REA returnerar fynd med belägg. Agenten använder dem för följdfrågor, förklaringar eller för att skriva och testa en implementation. CLI-kommandon använder samma arbetsflöden.

![Undersökningsflöde: agenten frågar om ett lokalt mål, REA inspekterar och spårar det med analysverktyg och agenten använder kod, referenser och okända fakta för att förklara, implementera och testa.](../../website/public/assets/figures/rea-investigation-flow.svg)

[Öppna bilden i full storlek](../../website/public/assets/figures/rea-investigation-flow.svg).

<a id="current-status"></a>

<a id="what-you-can-analyze"></a>

## Vad du kan analysera

REA kräver Node.js 22.x (>=22.19), 24.x (>=24.11) eller 26+, samt npm. Ytterligare verktyg och värdplattformar beror på målet:

| Mål                          | Vad REA returnerar                                                                              | Krav och guide                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Native-binärer               | Pseudokod, assembly, strängar, symboler, anrop och referenser                                   | Hopper, Ghidra eller IDA; [native-analys](../native-investigation.md)                                                              |
| ELF-layout offline           | Sektioner, segment, ursprungliga symboler/relokeringar och möjliga statiska skyddsmekanismer    | Egen pwntools-installation på Linux x64; [binärdiagnostik](../binary-diagnostics.md)                                               |
| Go-binärer                   | Inbäddad kompilatorversion, moduler, ersättningar och bygginställningar                         | Inbyggd statisk ELF/PE/thin Mach-O-inspektion; Go behöver inte installeras                                                         |
| Rust-binärer                 | Inbäddade cargo-auditable crate-namn, versioner, källor och beroenden                           | Inbyggd statisk ELF/PE/thin Mach-O-inspektion; [Rust-binärer](../rust-binaries.md)                                                 |
| WASM-artefakt                | Validering, sektioner, exakta WAT-former för import/export och avkodad WAT                      | Egen WABT 1.0.42-installation; `inspect_wasm_artifact`                                                                             |
| EVM-bytekod                  | Dispatch-selektorer, bytepositioner, härledda argument och mutabilitet                          | Lokal rå-/hexindata på Linux x64; [EVM offline](../evm-bytecode.md)                                                                |
| SQLite-databaser             | Tabeller, kolumner, index, vyer, triggers och valda rader från vanliga tabeller                 | Lokal databas-/WAL-ögonblicksbild; Node.js 24.x >=24.15 eller 26+ med nativa SQLite-gränser                                        |
| Inspelade Linux-krascher     | Råa notes, register/signaler från alla inspelade trådar och möjliga minnesmappningar            | Egen pwntools-installation på Linux x64; valfritt GDB/pwndbg; [krascher](../recorded-crashes.md)                                   |
| JavaScript / Electron        | Moduler, importer, source maps, rutter, IPC och relationer till native-tillägg                  | Node.js och npm; Linux: procps-kompatibelt `ps`; [appanalys](../javascript-application-workflows.md)                               |
| Webbplatser                  | Sidstruktur, skript, nätverksobservationer och begärda skärmbilder                              | En webbläsare i Chrome-familjen; [webbläsaranalys](../browser-observation.md)                                                      |
| Sparade nätverksinspelningar | Förfrågningar, svar, tillgängliga nyttolaster och källpositioner                                | HAR eller Fiddler Everywhere SAZ; mitmdump på Linux för mitmproxys eget format; [nätverksinspelningar](../web-network-captures.md) |
| .NET-assemblies              | Metadata, CIL-instruktioner, deklarerade native-beroenden och byggjämförelser                   | Inga extra verktyg (endast statiskt); [.NET-guide](../managed-code-analysis.md)                                                    |
| Android-APK:er               | Manifestdeklarationer, klasser, dekompilerade metoder och referenser                            | Headless JADX och fullständig JDK på Linux/macOS/Windows x64; [Android](../android-analysis.md)                                    |
| Android-enheter              | Enheter, paket, processer, loggar, dumpar, skärmbilder samt APK-/filöverföringar                | Egen adb-installation, emulator eller hårdvara; [ADB](../adb-device-analysis.md)                                                   |
| JEB-projekt                  | Motorns projektenheter, artefaktdigests och pseudokod för typer/metoder                         | Egen startad JEB-klient som tillhandahåller MCP, vald med REA_JEB_MCP_URL; [JEB](../jeb-analysis.md)                               |
| Android-resurser             | Avkodat manifest, strängtabeller, språk och versionsuppgifter                                   | Egen Apktool-startare; [resurser](../apktool-resource-analysis.md)                                                                 |
| Flutter-appar                | Dart-ögonblicksbildens hash, biblioteksdigests per ABI och motorbyggets ursprung                | Inga extra verktyg (statisk APK-tolkning); [Flutter](../flutter-analysis.md)                                                       |
| Firmware                     | Regioner, extraktionsresultat och överlämningar till native-analys                              | Binwalk / Unblob på Linux; [firmware](../firmware-analysis.md)                                                                     |
| Inspelade paket              | Valda fält, upprepade värden, filter och decode-as-regler                                       | Linux: TShark 4.x + prlimit; [paketinspelningar](../packet-captures.md)                                                            |
| Paketsammanfattningar        | Endpoints, DNS, TLS SNI, protokollfördelning och HTTP-förfrågningar                             | Egen tshark och capinfos (verifierat på Linux); [pcap](../pcap-analysis.md)                                                        |
| Inspelade logiska signaler   | Avkodarannoteringar, samplingsintervall och diagnostik                                          | Linux: sigrok-cli 0.7.2 + prlimit; [signalinspelningar](../signal-recordings.md)                                                   |
| Paket och resurser           | Filinventeringar, digests, plists, Apple-paketstruktur och extraherade resurser                 | [Artefakter och JavaScript](../javascript-artifact-reconstruction.md), [Apple-appar](../apple-application-analysis.md)             |
| Processbeteende              | Terminalutdata, interaktioner, avslut och filsystemsändringar samt jämförelser mellan körningar | Linux/macOS med native PTY; [processinspelning](../process-capture.md)                                                             |

Statisk JavaScript- och .NET-inspektion läser filerna utan att köra appen. Runtime-inspelning kör eller interagerar med det valda målet med dina användarbehörigheter. Respektive guide beskriver effekterna.

För offlineinspektion av native-binärer stöder REA även egna installationer av GNU objdump och Rizin. Se [guiden för reverse-engineeringverktyg](../reverse-engineering-tools.md) för konfiguration, CLI-kommandon och begränsningar i Evidence. REA installerar eller uppdaterar inte dessa leverantörer.

<a id="choosing-a-deep-analysis-provider"></a>

Native-format och värdplattformar varierar mellan leverantörer. Se [Hopper och Ghidra](../installation.md#hopper), [IDA-guiden](../ida-provider.md), inklusive valfri native MCP-brygga, och [experimentellt Ghidra-stöd på Windows](../windows-ghidra-p0.md). Ghidra stöder även [16-bitars DOS-analys](../ghidra-dos.md). Höj starttidsgränsen för stora binärer med `REA_GHIDRA_STARTUP_TIMEOUT_MS` eller `REA_HOPPER_STARTUP_TIMEOUT_MS`. Se [CLI-guiden](../cli.md#choose-a-provider) för leverantörsval och [tillgänglighet per utgåva](../installation.md#released-package-and-main) för funktioner tillagda efter senaste npm-utgåvan.

<a id="showcases"></a>

## Exempel

[![Illustrationer av DX-Balls ljudpanorering, Notions urklippsbrygga och TH04:s projektilring](../assets/rea-showcases.png)](https://rea.tools/showcase/)

<a id="dx-ball-reconstruct-a-sound-pan-calculation"></a>

### DX-Ball: rekonstruera en beräkning av ljudpanorering

Följ ett ljudanrop till hjälpfunktionen som omvandlar position till panorering, inspektera instruktionerna och skriv C från ofullständig pseudokod. Rekonstruktionen klarar 3 205 fall mot den ursprungliga x86-koden och återskapar funktionens samtliga 63 kompilerade byte.

[Läs fallstudien](https://rea.tools/showcase/dx-ball/) · [Rekonstruktionsarkiv](https://github.com/N0zoM1z0/dx-ball)

<a id="notion-trace-the-electron-clipboard-bridge"></a>

### Notion: spåra Electrons urklippsbrygga

Hitta renderarens urklipps-API, följ det genom preload och IPC till huvudprocessen och inspektera urklippsformatet med formatering.

[Läs fallstudien](https://rea.tools/showcase/notion/)

<a id="th04-recover-a-dos-bullet-ring-calculation"></a>

### TH04: återskapa en DOS-beräkning för en projektilring

Inspektera det ursprungliga PC-98-spelets 16-bitarsinstruktioner, återskapa beräkningarna för fasta och riktade vinklar och jämför rekonstruerad C++ med den historiska kompilatorns utdata.

[Läs fallstudien](https://rea.tools/showcase/th04/) · [Rekonstruktionsarkiv](https://github.com/N0zoM1z0/th04)

Har du använt REA för något intressant? Dela det i ett [ärende](https://github.com/morluto/rea/issues) eller en [pull request](https://github.com/morluto/rea/pulls). Ange målet, frågan, hur REA hjälpte och vad du kom fram till.

<a id="faq"></a>

## Vanliga frågor

<details>
<summary><strong>Vilka agenter kan använda REA?</strong></summary>

Alla agenter som stöder lokala MCP-servrar. Setup konfigurerar [agenter som stöds](../installation.md#supported-agents); andra klienter kan använda [manuell MCP-registrering](../installation.md#mcp-registry).

</details>

<details>
<summary><strong>Behöver jag Hopper, Ghidra eller IDA?</strong></summary>

Djup native-analys använder en av dessa motorer. Statisk JavaScript- och .NET-inspektion fungerar utan native-analysmotor. Setup kan installera Hopper efter godkännande; Ghidra och IDA använder befintliga installationer. Se [leverantörsinställningar](../installation.md#hopper).

</details>

<details>
<summary><strong>Måste jag starta Hopper först?</strong></summary>

REA startar Hopper när en operation behöver det. På macOS kan en förstagångsdialog be dig välja demoläge eller aktivera licensen. Slutför dialogen i samma användarsession före första CLI/MCP-operationen eller en obevakad körning. Öppna Hopper manuellt vid behov. Se [Hopper-start och felsökning](../installation.md#launcher-paths-and-troubleshooting).

</details>

<details>
<summary><strong>Vad gör installation av en skill från skills.sh?</strong></summary>

Din skill ger agenten undersökningsinstruktioner. Använd `npx rea-agents setup` för att registrera REA:s MCP-server och installera tillhörande instruktioner. Starta sedan om agenten. Se [installation av enbart skill](../installation.md#skill-only-installation).

</details>

<details>
<summary><strong>Vilken kod returnerar REA?</strong></summary>

Native-analys returnerar pseudokod och assembly. JavaScript/Electron-analys kartlägger moduler och relationer. Agenten använder fynden för att skriva och testa en implementation. Se [exemplen](#showcases).

</details>

<details>
<summary><strong>Laddar REA upp min app?</strong></summary>

REA analyserar mål lokalt. Agenten tar emot verktygsresultaten och modellleverantören har sin egen datapolicy.

</details>

<details>
<summary><strong>Vad gör jag om jag hittar ett fel?</strong></summary>

Uppdatera först; en nyare utgåva kan redan ha rättat felet.

För en CLI installerad med `npm install --global` eller `bun add --global`:

```bash
rea update
```

För agentkonfiguration via `npx`:

```bash
npx rea-agents@latest setup
```

Slutför [konfigurationsuppdateringen](#update-rea) och starta om agenten om du använder en. Försök med samma uppgift igen. Om problemet kvarstår, [öppna ett ärende](https://github.com/morluto/rea/issues) med REA-version, måltyp, steg för att återskapa felet och felutdata.

</details>

<a id="documentation"></a>

## Dokumentation

Börja med webbplatsens [praktiska guider](https://rea.tools/guides/). För exakta alternativ, förutsättningar och resultatkontrakt:

- [Installation och konfiguration](../installation.md): agentregistrering, leverantörer, uppdatering och avinstallation.
- [Beredskap och felsökning](../installation.md#check-readiness-for-your-task): diagnostisera en agent eller analysmotor.
- [CLI och Evidence](../cli.md): kommandon, leverantörsval, ögonblicksbilder, import/export och avslutstatus.
- [MCP-kontrakt](../mcp-contracts.md) och [agentprompter](../mcp-prompts.md): verktygsresultat, sessioner och vägledda undersökningar.
- [Verktygskatalog](../mcp-contracts.md#generated-catalog): genererad inventering av verktyg, leverantörer och CLI-kommandon.
- [Färdplan](../roadmap.md): planerat arbete och utveckling av funktioner.

Rapportera sårbarheter enligt [SECURITY.md](../../SECURITY.md).

<a id="star-history"></a>

## Stjärnhistorik

**200 000 GitHub-stjärnor. Tack!**

Tack till alla som använder REA, rapporterar fel, föreslår funktioner, testar byggen och bidrar med rättningar.

<a href="https://www.star-history.com/?repos=morluto%2Frea&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date&amp;theme=dark&amp;legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
    <img alt="REA:s stjärnhistorik på GitHub" src="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
  </picture>
</a>

<a id="disclaimer"></a>

## Ansvarsfriskrivning

Se [DISCLAIMER.md](../../DISCLAIMER.md) för riktlinjer om ansvarsfull användning.

Projektets hållning till olaglig eller obehörig användning gäller alla REA-versioner, distributionskanaler och plattformar. Varje exemplar behåller sina tillämpliga licenser.

REA är avsett för laglig forskning, utbildning, interoperabilitet, mjukvarubevarande och analys av programvara som du äger eller har rätt att undersöka.

<a id="contributing"></a>

## Bidra

Din hjälp är välkommen! [Öppna ett ärende](https://github.com/morluto/rea/issues) för att rapportera fel eller föreslå funktioner, eller [skicka en pull request](https://github.com/morluto/rea/pulls) för att förbättra kod eller dokumentation.

Se [CONTRIBUTING.md](../../CONTRIBUTING.md) för utvecklingsmiljö och kontroller, [testning](../testing.md) för verifieringsflöden och [arkitekturkartan](../architecture.mermaid) för projektstrukturen.

<a id="license"></a>

## Licens

[MIT](../../LICENSE)

Kod skriven för REA licensieras under MIT. Material från tredje part behåller sina egna licenser och upphovsrättsmeddelanden. Se [tredjepartsmeddelanden](../../THIRD_PARTY_NOTICES.md) för beroenden, bevarade licenstexter och externa verktygs villkor.

**Du måste lagligt skaffa kommersiella verktyg och ha rätt att använda dem**, däribland IDA Pro / Hex-Rays-dekompilatorer, Hopper och JEB, enligt deras licenser. REA ger ingen verktygslicens, nyckel eller aktiveringsrätt. Prov- och demoversioner omfattas fortfarande av leverantörens villkor, inklusive begränsningar för användare, funktioner, automatisering och delning av utdata. Crackade kopior, stulna nycklar, obehörig nyckeldelning och kringgående av licensbegränsningar är inte tillåtna. Vägledningen ändrar inte MIT eller tredjepartslicenser.
