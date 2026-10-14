<div align="center">

<details>
<summary>Kies je taal</summary>

[🇺🇸&nbsp;English](../../README.md) · [🇨🇳&nbsp;简体中文](README_zh.md) · [🇹🇼&nbsp;繁體中文](README_zh-TW.md) · [🇯🇵&nbsp;日本語](README_ja.md) · [🇰🇷&nbsp;한국어](README_ko.md) · [🇹🇷&nbsp;Türkçe](README_tr.md) · [🇷🇺&nbsp;Русский](README_ru.md) · [🇻🇳&nbsp;Tiếng Việt](README_vi.md) · [🇹🇭&nbsp;ไทย](README_th.md) · [🇩🇪&nbsp;Deutsch](README_de.md) · [🇪🇸&nbsp;Español](README_es.md) · [🇫🇷&nbsp;Français](README_fr.md) · [🇺🇦&nbsp;Українська](README_uk.md) · [🇵🇱&nbsp;Polski](README_pl.md) · [🇧🇷&nbsp;Português (Brasil)](README_pt-BR.md) · [🇸🇦&nbsp;العربية](README_ar.md) · [🇮🇷&nbsp;فارسی](README_fa.md) · [🇮🇩&nbsp;Bahasa Indonesia](README_id.md) · [🇮🇹&nbsp;Italiano](README_it.md) · [🇬🇷&nbsp;Ελληνικά](README_el.md) · **🇳🇱&nbsp;Nederlands** · [🇸🇪&nbsp;Svenska](README_sv.md) · [🇨🇿&nbsp;Čeština](README_cs.md) · [🇷🇴&nbsp;Română](README_ro.md)

</details>

# REA: Reverse Engineer Anything

<a id="one-mcp-for-reverse-engineering-across-binaries-applications-and-runtime-behavior"></a>

### Eén MCP voor reverse-engineering van binaries, applicaties en gedrag tijdens uitvoering.

**Zie je een interessante functie? Ontdek hoe die werkt, tot op het niveau van machinecode.**

[![npm-versie](https://img.shields.io/npm/v/rea-agents?style=flat-square&color=cb3837)](https://www.npmjs.com/package/rea-agents)
[![MCP-toolcatalogus](https://img.shields.io/badge/MCP-tool_catalog-5c4ee5?style=flat-square)](../mcp-contracts.md#generated-catalog)
[![Node.js-vereisten](https://img.shields.io/badge/Node.js-requirements-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#what-you-can-analyze)
[![skills.sh](https://skills.sh/b/morluto/rea?style=flat-square)](https://skills.sh/morluto/rea/reverse-engineer-anything)
[![MIT-licentie](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)
[![Discord](https://img.shields.io/discord/1556595354999332884?logo=discord&logoColor=white&label=Discord&color=5865F2)](https://discord.gg/GkcryMnJDM)

<a href="https://trendshift.io/repositories/82054?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-82054" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/82054" alt="morluto%2Frea | Trendshift" width="250" height="55"/></a>

**[Website](https://rea.tools/) · [Handleidingen](https://rea.tools/guides/) · [Praktijkvoorbeelden](https://rea.tools/showcase/)**

[Snel beginnen](#quick-start) · [Hoe REA werkt](#how-rea-works) · [Wat je kunt analyseren](#what-you-can-analyze) · [Praktijkvoorbeelden](#showcases) · [Veelgestelde vragen](#faq) · [Documentatie](#documentation)

<code>npx rea-agents setup</code>

</div>

> [!IMPORTANT]
> Download REA via [morluto/rea](https://github.com/morluto/rea), [rea.tools](https://rea.tools/) of het [npm-pakket rea-agents](https://www.npmjs.com/package/rea-agents). Volg de installatie- en releaselinks op deze officiële bronnen. Een vergelijkbare repositorynaam of gekopieerde README bewijst niet dat een download officieel is.

---

Wil je begrijpen hoe een functie in een app werkt? Vraag je agent die met REA te onderzoeken. De agent kan de app zonder broncode inspecteren, bevindingen onderbouwen en de resultaten gebruiken om een implementatie voor jouw project te schrijven en te testen.

REA verbindt je agent met tools voor native binaries, JavaScript- en Electron-apps, .NET-assemblies en websites. Dezelfde workflows zijn beschikbaar in de terminal. De analyse gebeurt lokaal; resultaten bevatten bewijs en beperkingen bij elke conclusie.

De installatie registreert REA bij je agent en installeert bijpassende werkinstructies. Native analyse kan een bestaande installatie van Hopper, Ghidra of IDA gebruiken. Met jouw toestemming kan de installatie ook Hopper installeren. Statische JavaScript-analyse heeft geen native analyse-engine nodig.

> **[Bezoek de REA-website](https://rea.tools/)** voor installatie-instructies, geïllustreerde handleidingen en praktijkvoorbeelden.

<a id="quick-start"></a>

## Snel beginnen

| Ik wil…                                                 | Begin hier                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| Mijn agent een app laten onderzoeken                    | [Stel je agent in](#set-up-your-agent) en geef één concrete vraag.   |
| JavaScript of Electron inspecteren zonder native engine | [Gebruik de terminal](#use-the-terminal) met een lokale map of ASAR. |
| Een provider kiezen voor een ander doel                 | Bekijk [ondersteunde doelen en vereisten](#what-you-can-analyze).    |
| Een uitgewerkte reconstructie bekijken                  | Lees de [praktijkvoorbeelden](#showcases).                           |

**Vereisten:** Node.js 22.x (>=22.19), 24.x (>=24.11) of 26+, plus npm.

Op Linux vereisen Ghidra, JADX, het starten van firmwaretools en statische JavaScript/Electron-analyse een procps-compatibele `ps` op het `PATH` van REA om proceseigendom te controleren. Herstelinstructies staan in `docs/installation.md` onder "Linux owned-process prerequisite".

<a id="set-up-your-agent"></a>

### Je agent instellen

Installeer Node.js en npm en voer uit:

```bash
npx rea-agents setup
```

Kies je agents, controleer de voorgestelde wijzigingen en keur ze goed. De installatie voegt de MCP-server van REA en bijpassende werkinstructies toe en maakt back-ups van bestaande configuratie. Start je agent daarna opnieuw.

De installatie ondersteunt Claude Code, Codex, Cursor, Gemini CLI, Grok Build en [andere agents](../installation.md#supported-agents). Zie [installatie en configuratie](../installation.md) voor providers en handmatige MCP-registratie.

<a id="ask-your-agent"></a>

### Stel je agent een vraag

```text
Onderzoek hoe zoeken werkt in de Notes-app, laat het bewijs zien en bouw een
vergelijkbare functie voor mijn project.
```

Vervang Notes door jouw doelapp en noem de functie die je wilt begrijpen.

<a id="use-the-terminal"></a>

### De terminal gebruiken

Inspecteer een uitgepakte JavaScript/Electron-appmap of een ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

Het resultaat bevat modules, imports, Electron-grenzen en het bijbehorende bewijs. Vervang het pad door dat van jouw doel, bijvoorbeeld `"D:/apps/example"` op Windows.

Installeer het commando `rea` voor regelmatig gebruik:

```bash
npm install --global rea-agents
rea --help
```

Configureer voor native analyse eerst een provider. De [CLI- en Evidence-handleiding](../cli.md) beschrijft native commando's, providerkeuze, snapshots en scripts.

### Je eerste resultaat lezen

Controleer het doel, de bronlocaties en de dekking voordat je een conclusie trekt. Resultaten kunnen onopgeloste imports, niet-beschikbare feiten of beperkingen bevatten, ook wanneer het commando succesvol eindigt. Statische relaties beschrijven wat in de aangeleverde bestanden is gevonden. Gebruik een passende runtime-observatie of een gerichte test om een bewering over gedrag te bevestigen.

<a id="update-rea"></a>

### REA bijwerken

REA ontwikkelt zich snel en releases bevatten regelmatig bugfixes. Houd je installatie actueel.

Voor een CLI die met `npm install --global` of `bun add --global` is geïnstalleerd:

```bash
rea update
```

Globale updates via Bun vereisen Bun 1.2.17 of nieuwer. Werk een oudere Bun-versie handmatig bij voordat je `rea update` uitvoert.

Voer het installatiecommando uit dat de update toont om agentregistraties en de skill te vernieuwen.

Gebruik je `npx`, vernieuw dan de agentconfiguratie met:

```bash
npx rea-agents@latest setup
```

Controleer de wijzigingen en herstart je agent. Gebruik voor losse CLI-aanroepen `npx rea-agents@latest` gevolgd door het commando. Met Bun kun je `npx rea-agents@latest` vervangen door `bunx rea-agents@latest`.

<div align="center">

<br />

<img src="../assets/rea-hopper-analysis.png" alt="REA start zijn analysebridge in Hopper om een native binary te inspecteren" width="1200" />

<br /><br />

<table aria-label="REA-gemeenschap">
<tr>
<td align="center" width="360">
  <a href="https://discord.gg/GkcryMnJDM">
    <img src="../assets/discord.svg" height="42" alt="Discord" /><br />
    <strong>Word lid van de reverse-engineeringgemeenschap</strong>
  </a><br />
  <sub>Discord · Vragen en antwoorden · Deel je werk</sub>
</td>
</tr>
</table>

<br />

</div>

<a id="how-rea-works"></a>

## Hoe REA werkt

Je agent roept REA via MCP aan om het doel te inspecteren en relevante code te volgen. REA geeft bevindingen met bewijs terug. De agent gebruikt die om vervolgvragen te stellen, gedrag uit te leggen of een implementatie te schrijven en te testen. CLI-commando's gebruiken dezelfde workflows.

![Onderzoeksstappen: de agent stelt een vraag over een lokaal doel, REA inspecteert en volgt de code, en de agent gebruikt code, verwijzingen en onbekende feiten om gedrag uit te leggen, te implementeren en te testen.](../../website/public/assets/figures/rea-investigation-flow.svg)

[Bekijk de afbeelding op volledige grootte](../../website/public/assets/figures/rea-investigation-flow.svg).

<a id="current-status"></a>

<a id="what-you-can-analyze"></a>

## Wat je kunt analyseren

REA vereist Node.js 22.x (>=22.19), 24.x (>=24.11) of 26+, plus npm. Aanvullende tools en ondersteunde hosts hangen af van het doel:

| Doel                        | Wat REA teruggeeft                                                                                         | Vereisten en handleiding                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Native binaries             | Pseudocode, assembly, strings, symbolen, aanroepen en verwijzingen                                         | Hopper, Ghidra of IDA; [native analyse](../native-investigation.md)                                                         |
| Offline ELF-indeling        | Secties, segmenten, oorspronkelijke symbolen/relocaties en statisch afgeleide beschermingsmechanismen      | Zelf beschikbaar gestelde pwntools op Linux x64; [binarydiagnostiek](../binary-diagnostics.md)                              |
| Go-binaries                 | Ingebedde compilerversie, modules, vervangingen en buildinstellingen                                       | Ingebouwde statische inspectie van ELF/PE/thin Mach-O; geen Go-installatie nodig                                            |
| Rust-binaries               | Ingebedde cargo-auditable cratenamen, versies, bronnen en afhankelijkheden                                 | Ingebouwde statische inspectie van ELF/PE/thin Mach-O; [Rust-binaries](../rust-binaries.md)                                 |
| WASM-artefact               | Validatie, secties, exacte WAT-imports/exports en gedecodeerde WAT                                         | Zelf beschikbaar gestelde WABT 1.0.42; `inspect_wasm_artifact`                                                              |
| EVM-bytecode                | Dispatch-selectors, byte-offsets, afgeleide argumenten en veranderlijkheid                                 | Lokale ruwe/hex-invoer op Linux x64; [offline EVM](../evm-bytecode.md)                                                      |
| SQLite-databases            | Tabellen, kolommen, indexen, views, triggers en geselecteerde rijen uit gewone tabellen                    | Lokale database/WAL-snapshot; Node.js 24.x >=24.15 of 26+ met native SQLite-limieten                                        |
| Opgenomen Linux-crashes     | Ruwe notes, registers/signalen van elke opgenomen thread en mogelijke geheugentoewijzingen                 | Zelf beschikbaar gestelde pwntools op Linux x64; optioneel GDB/pwndbg; [crashes](../recorded-crashes.md)                    |
| JavaScript / Electron       | Modules, imports, source maps, routes, IPC en relaties met native add-ons                                  | Node.js en npm; Linux: procps-compatibele `ps`; [applicatieanalyse](../javascript-application-workflows.md)                 |
| Websites                    | Paginastructuur, scripts, netwerkobservaties en aangevraagde screenshots                                   | Browser uit de Chrome-familie; [browseranalyse](../browser-observation.md)                                                  |
| Opgeslagen netwerkcaptures  | Verzoeken, antwoorden, beschikbare payloads en bronlocaties                                                | HAR of Fiddler Everywhere SAZ; mitmdump op Linux voor native mitmproxy; [captures](../web-network-captures.md)              |
| .NET-assemblies             | Metadata, CIL-instructies, gedeclareerde native afhankelijkheden en buildvergelijkingen                    | Geen extra tools (alleen statisch); [.NET-handleiding](../managed-code-analysis.md)                                         |
| Android-APK's               | Manifestdeclaraties, klassen, gedecompileerde methoden en verwijzingen                                     | Headless JADX en een volledige JDK op Linux/macOS/Windows x64; [Android](../android-analysis.md)                            |
| Android-apparaten           | Apparaten, pakketten, processen, logs, dumps, screenshots en APK-/bestandsoverdracht                       | Zelf beschikbaar gestelde adb, emulator of hardware; [ADB](../adb-device-analysis.md)                                       |
| JEB-projecten               | Projectonderdelen uit de engine, artefactdigests en pseudocode van typen/methoden                          | Zelf gestarte JEB-client met MCP, gekozen via REA_JEB_MCP_URL; [JEB](../jeb-analysis.md)                                    |
| Android-resources           | Gedecodeerd manifest, stringtabellen, talen en versiegegevens                                              | Zelf beschikbaar gestelde Apktool-launcher; [resources](../apktool-resource-analysis.md)                                    |
| Flutter-apps                | Dart-snapshothash, bibliotheekdigests per ABI en herkomst van de enginebuild                               | Geen extra tools (statische APK-parsing); [Flutter](../flutter-analysis.md)                                                 |
| Firmware                    | Gebieden, extractieresultaten en overdracht naar native analyse                                            | Binwalk / Unblob op Linux; [firmware](../firmware-analysis.md)                                                              |
| Opgenomen pakketten         | Geselecteerde velden, herhaalde waarden, filters en decode-as-regels                                       | Linux: TShark 4.x + prlimit; [pakketcaptures](../packet-captures.md)                                                        |
| Pakketsamenvattingen        | Endpoints, DNS, TLS SNI, protocolverdeling en HTTP-verzoeken                                               | Zelf beschikbaar gestelde tshark en capinfos (geverifieerd op Linux); [pcap](../pcap-analysis.md)                           |
| Opgenomen logische signalen | Decoderannotaties, samplebereiken en diagnostiek                                                           | Linux: sigrok-cli 0.7.2 + prlimit; [signaalopnamen](../signal-recordings.md)                                                |
| Pakketten en resources      | Bestandsinventarissen, digests, plists, Apple-bundlestructuur en uitgepakte resources                      | [Artefacten en JavaScript](../javascript-artifact-reconstruction.md), [Apple-applicaties](../apple-application-analysis.md) |
| Procesgedrag                | Terminaluitvoer, interacties, afsluit- en bestandssysteemobservaties en vergelijkingen tussen uitvoeringen | Linux/macOS met native PTY; [procesopnamen](../process-capture.md)                                                          |

Statische JavaScript- en .NET-inspectie leest aangeleverde bestanden zonder de app uit te voeren. Runtime-opnamen starten het geselecteerde doel of communiceren ermee met jouw gebruikersrechten. De betreffende handleiding beschrijft de effecten.

Voor offline inspectie van native binaries ondersteunt REA ook zelf beschikbaar gestelde GNU objdump en Rizin. De [handleiding voor reverse-engineeringtools](../reverse-engineering-tools.md) beschrijft providerconfiguratie, CLI-commando's en Evidence-beperkingen. REA installeert of actualiseert deze providers niet.

<a id="choosing-a-deep-analysis-provider"></a>

Native formaten en ondersteunde hosts verschillen per provider. Zie [Hopper en Ghidra instellen](../installation.md#hopper), de [IDA-handleiding](../ida-provider.md), inclusief de optionele native MCP-bridge, en [experimentele Ghidra-ondersteuning op Windows](../windows-ghidra-p0.md). Ghidra ondersteunt ook [16-bit DOS-analyse](../ghidra-dos.md). Verhoog bij grote binaries de opstartdeadline met `REA_GHIDRA_STARTUP_TIMEOUT_MS` of `REA_HOPPER_STARTUP_TIMEOUT_MS`. Zie de [CLI-handleiding](../cli.md#choose-a-provider) voor providerkeuze en [releasebeschikbaarheid](../installation.md#released-package-and-main) voor functies die na de laatste npm-release zijn toegevoegd.

<a id="showcases"></a>

## Praktijkvoorbeelden

[![Illustraties van de DX-Ball-geluidspositie, de Notion-klembordbridge en de TH04-projectielring](../assets/rea-showcases.png)](https://rea.tools/showcase/)

<a id="dx-ball-reconstruct-a-sound-pan-calculation"></a>

### DX-Ball: een berekening voor stereopositie reconstrueren

Volg een geluidsaanroep naar de functie die positie omzet in stereopositie, inspecteer de instructies en zet onvolledige pseudocode om in C. De reconstructie slaagt voor 3.205 gevallen op de oorspronkelijke x86-code en reproduceert alle 63 gecompileerde functiebytes.

[Lees de casestudy](https://rea.tools/showcase/dx-ball/) · [Reconstructierepository](https://github.com/N0zoM1z0/dx-ball)

<a id="notion-trace-the-electron-clipboard-bridge"></a>

### Notion: de Electron-klembordbridge volgen

Zoek de klembord-API van de renderer, volg deze via preload en IPC naar het hoofdproces en inspecteer het klembordformaat met opmaak.

[Lees de casestudy](https://rea.tools/showcase/notion/)

<a id="th04-recover-a-dos-bullet-ring-calculation"></a>

### TH04: een DOS-projectielring reconstrueren

Inspecteer de oorspronkelijke 16-bit instructies van het PC-98-spel, reconstrueer de vaste en gerichte hoekberekeningen en vergelijk de gereconstrueerde C++ met de uitvoer van de historische compiler.

[Lees de casestudy](https://rea.tools/showcase/th04/) · [Reconstructierepository](https://github.com/N0zoM1z0/th04)

Heb je REA voor een interessant onderzoek gebruikt? Deel het in een [issue](https://github.com/morluto/rea/issues) of [pull request](https://github.com/morluto/rea/pulls). Vermeld het doel, je vraag, hoe REA hielp en wat je ontdekte.

<a id="faq"></a>

## Veelgestelde vragen

<details>
<summary><strong>Welke agents kunnen REA gebruiken?</strong></summary>

Elke agent die lokale MCP-servers ondersteunt. Setup configureert de [ondersteunde agents](../installation.md#supported-agents); andere clients kunnen [handmatige MCP-registratie](../installation.md#mcp-registry) gebruiken.

</details>

<details>
<summary><strong>Heb ik Hopper, Ghidra of IDA nodig?</strong></summary>

Diepgaande native analyse gebruikt een van deze engines. Statische JavaScript- en .NET-inspectie werkt zonder native analyse-engine. Setup kan Hopper na toestemming installeren; Ghidra en IDA gebruiken bestaande installaties. Zie [providerconfiguratie](../installation.md#hopper).

</details>

<details>
<summary><strong>Moet ik Hopper eerst starten?</strong></summary>

REA start Hopper wanneer een bewerking het nodig heeft. Op macOS kan een dialoog bij het eerste gebruik om de demomodus of licentieactivatie vragen. Rond dit af in dezelfde gebruikerssessie vóór je eerste CLI/MCP-bewerking of onbeheerde taak. Open Hopper indien nodig handmatig. Zie [Hopper starten en problemen oplossen](../installation.md#launcher-paths-and-troubleshooting).

</details>

<details>
<summary><strong>Wat doet installatie van de skill via skills.sh?</strong></summary>

De skill geeft je agent onderzoeksinstructies. Gebruik `npx rea-agents setup` om de MCP-server van REA en bijpassende instructies te installeren en herstart je agent. Zie [alleen de skill installeren](../installation.md#skill-only-installation).

</details>

<details>
<summary><strong>Welke code geeft REA terug?</strong></summary>

Native analyse geeft pseudocode en assembly terug. JavaScript/Electron-analyse brengt modules en relaties in kaart. Je agent gebruikt deze bevindingen om een implementatie te schrijven en te testen. De [praktijkvoorbeelden](#showcases) laten dat zien.

</details>

<details>
<summary><strong>Uploadt REA mijn app?</strong></summary>

REA analyseert doelen lokaal. Je agent ontvangt de toolresultaten; de modelprovider heeft een eigen gegevensbeleid.

</details>

<details>
<summary><strong>Wat doe ik als ik een bug tegenkom?</strong></summary>

Werk eerst bij; een recente release kan het probleem al verhelpen.

Voor een CLI die met `npm install --global` of `bun add --global` is geïnstalleerd:

```bash
rea update
```

Voor agentconfiguratie via `npx`:

```bash
npx rea-agents@latest setup
```

Voltooi bij agentgebruik de [configuratie-update](#update-rea) en herstart de agent. Probeer dezelfde taak opnieuw. Blijft het probleem bestaan, [open dan een issue](https://github.com/morluto/rea/issues) met je REA-versie, doeltype, reproductiestappen en foutuitvoer.

</details>

<a id="documentation"></a>

## Documentatie

Begin met de [praktische handleidingen](https://rea.tools/guides/). Voor exacte opties, vereisten en resultaatcontracten:

- [Installatie en configuratie](../installation.md): agentregistratie, providers, updates en verwijderen.
- [Gereedheid en probleemoplossing](../installation.md#check-readiness-for-your-task): diagnose van een agent of analyse-engine.
- [CLI en Evidence](../cli.md): commando's, providerkeuze, snapshots, import/export en afsluitstatussen.
- [MCP-contracten](../mcp-contracts.md) en [agentprompts](../mcp-prompts.md): toolresultaten, sessies en begeleid onderzoek.
- [Toolcatalogus](../mcp-contracts.md#generated-catalog): gegenereerd overzicht van tools, providers en CLI-commando's.
- [Roadmap](../roadmap.md): gepland werk en mogelijkheden in ontwikkeling.

Meld kwetsbaarheden volgens [SECURITY.md](../../SECURITY.md).

<a id="star-history"></a>

## Sterrengeschiedenis

**200.000 GitHub-sterren. Bedankt!**

Dank aan iedereen die REA gebruikt, bugs meldt, functies aanvraagt, builds test en verbeteringen bijdraagt.

<a href="https://www.star-history.com/?repos=morluto%2Frea&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date&amp;theme=dark&amp;legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
    <img alt="REA-sterrengeschiedenis op GitHub" src="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
  </picture>
</a>

<a id="disclaimer"></a>

## Disclaimer

Zie [DISCLAIMER.md](../../DISCLAIMER.md) voor richtlijnen voor verantwoord gebruik.

Het standpunt van het project over illegaal of ongeautoriseerd gebruik geldt voor alle REA-versies, distributiekanalen en platforms. Elk exemplaar behoudt de toepasselijke licenties.

REA is bedoeld voor rechtmatig onderzoek, onderwijs, interoperabiliteit, softwarebehoud en analyse van software die je bezit of mag onderzoeken.

<a id="contributing"></a>

## Bijdragen

Je hulp is welkom! [Open een issue](https://github.com/morluto/rea/issues) voor een bug of functievoorstel, of [stuur een pull request](https://github.com/morluto/rea/pulls) om code of documentatie te verbeteren.

Zie [CONTRIBUTING.md](../../CONTRIBUTING.md) voor de ontwikkelomgeving en controles, [testen](../testing.md) voor verificatietrajecten en de [architectuurkaart](../architecture.mermaid) voor de projectstructuur.

<a id="license"></a>

## Licentie

[MIT](../../LICENSE)

Door REA geschreven code valt onder MIT. Materiaal van derden behoudt de eigen licenties en auteursrechtvermeldingen. Zie [vermeldingen van derden](../../THIRD_PARTY_NOTICES.md) voor afhankelijkheden, bewaarde licentieteksten en voorwaarden van externe tools.

**Je moet commerciële tools rechtmatig verkrijgen en bevoegd zijn ze te gebruiken**, waaronder IDA Pro / Hex-Rays-decompilers, Hopper en JEB, volgens hun licenties. REA verleent geen toollicentie, sleutel of activatierecht. Proef- en demoversies blijven onderworpen aan leveranciersvoorwaarden, inclusief beperkingen voor gebruikers, functies, automatisering en het delen van uitvoer. Gekraakte exemplaren, gestolen sleutels, ongeautoriseerd delen van sleutels en het omzeilen van licentiebeperkingen zijn niet toegestaan. Deze uitleg verandert MIT of licenties van derden niet.
