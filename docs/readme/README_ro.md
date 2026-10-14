<div align="center">

<details>
<summary>Alege limba</summary>

[English](../../README.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](README_fr.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md) · [Ελληνικά](README_el.md) · [Nederlands](README_nl.md) · [Svenska](README_sv.md) · [Čeština](README_cs.md) · **Română**

</details>

# REA: Reverse Engineer Anything

<a id="one-mcp-for-reverse-engineering-across-binaries-applications-and-runtime-behavior"></a>

### Un singur MCP pentru inginerie inversă asupra fișierelor binare, aplicațiilor și comportamentului la execuție.

**Ai găsit o funcție interesantă? Înțelege cum funcționează, până la nivel de cod mașină.**

[![Versiune npm](https://img.shields.io/npm/v/rea-agents?style=flat-square&color=cb3837)](https://www.npmjs.com/package/rea-agents)
[![Catalog de instrumente MCP](https://img.shields.io/badge/MCP-tool_catalog-5c4ee5?style=flat-square)](../mcp-contracts.md#generated-catalog)
[![Cerințe Node.js](https://img.shields.io/badge/Node.js-requirements-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#what-you-can-analyze)
[![skills.sh](https://skills.sh/b/morluto/rea?style=flat-square)](https://skills.sh/morluto/rea/reverse-engineer-anything)
[![Licență MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)
[![Discord](https://img.shields.io/discord/1556595354999332884?logo=discord&logoColor=white&label=Discord&color=5865F2)](https://discord.gg/GkcryMnJDM)

<a href="https://trendshift.io/repositories/82054?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-82054" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/82054" alt="morluto%2Frea | Trendshift" width="250" height="55"/></a>

**[Site](https://rea.tools/) · [Ghiduri](https://rea.tools/guides/) · [Exemple](https://rea.tools/showcase/)**

[Pornire rapidă](#quick-start) · [Cum funcționează REA](#how-rea-works) · [Ce poți analiza](#what-you-can-analyze) · [Exemple](#showcases) · [Întrebări frecvente](#faq) · [Documentație](#documentation)

<code>npx rea-agents setup</code>

</div>

> [!IMPORTANT]
> Obține REA din [morluto/rea](https://github.com/morluto/rea), [rea.tools](https://rea.tools/) sau din [pachetul npm rea-agents](https://www.npmjs.com/package/rea-agents). Urmează linkurile de instalare și de versiuni publicate din aceste surse oficiale. Un nume de depozit asemănător sau un README copiat nu dovedește că o descărcare este oficială.

---

Vrei să înțelegi cum funcționează o opțiune dintr-o aplicație? Cere-i agentului tău să o investigheze cu REA. Agentul poate inspecta aplicația fără codul-sursă, poate prezenta dovezile și poate folosi rezultatele pentru a scrie și testa o implementare pentru proiectul tău.

REA conectează agentul la instrumente pentru inspectarea fișierelor binare native, a aplicațiilor JavaScript și Electron, a ansamblurilor .NET și a site-urilor. Aceleași fluxuri sunt disponibile în terminal. Analiza rulează local, iar rezultatele includ dovezile și limitările fiecărei concluzii.

Configurarea înregistrează REA în agent și instalează instrucțiunile de lucru corespunzătoare. Analiza nativă poate folosi o instalare existentă de Hopper, Ghidra sau IDA; configurarea poate instala opțional Hopper cu aprobarea ta. Analiza statică JavaScript nu necesită un motor de analiză nativă.

> **[Vizitează site-ul REA](https://rea.tools/)** pentru instrucțiuni de instalare, ghiduri ilustrate și studii de caz reale.

<a id="quick-start"></a>

## Pornire rapidă

| Vreau să…                                          | Începe aici                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| Cer agentului să investigheze o aplicație          | [Configurează agentul](#set-up-your-agent) și pune o întrebare concretă. |
| Inspectez JavaScript sau Electron fără motor nativ | [Folosește terminalul](#use-the-terminal) cu un director local sau ASAR. |
| Aleg un furnizor pentru altă țintă                 | Vezi [țintele și cerințele](#what-you-can-analyze).                      |
| Urmăresc o reconstrucție completă                  | Citește [exemplele](#showcases).                                         |

**Cerințe:** Node.js 22.x (>=22.19), 24.x (>=24.11) sau 26+, plus npm.

Pe Linux, Ghidra, JADX, lansarea instrumentelor de firmware și analiza statică JavaScript/Electron necesită un `ps` compatibil cu procps în `PATH` pentru verificarea proprietății proceselor. Pașii de remediere sunt în `docs/installation.md`, la "Linux owned-process prerequisite".

<a id="set-up-your-agent"></a>

### Configurează agentul

Cu Node.js și npm instalate, rulează:

```bash
npx rea-agents setup
```

Alege agenții, verifică modificările propuse și aprobă-le. Configurarea adaugă serverul MCP REA și instrucțiunile corespunzătoare, păstrând copii de siguranță ale configurației existente. Repornește apoi agentul.

Configurarea acceptă Claude Code, Codex, Cursor, Gemini CLI, Grok Build și [alți agenți](../installation.md#supported-agents). Vezi [instalarea și configurarea](../installation.md) pentru furnizori și înregistrarea manuală MCP.

<a id="ask-your-agent"></a>

### Întreabă agentul

```text
Investighează cum funcționează căutarea în aplicația Notes, arată-mi dovezile
și construiește o funcție similară pentru proiectul meu.
```

Înlocuiește Notes cu aplicația țintă și numește funcția pe care vrei să o înțelegi.

<a id="use-the-terminal"></a>

### Folosește terminalul

Inspectează un director extras al unei aplicații JavaScript/Electron sau un ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

Rezultatul include module, importuri, granițele dintre componentele Electron și dovezile aferente. Înlocuiește calea cu ținta ta, de exemplu `"D:/apps/example"` pe Windows.

Pentru a instala comanda `rea` pentru utilizare regulată:

```bash
npm install --global rea-agents
rea --help
```

Pentru analiză nativă, configurează mai întâi un furnizor. Vezi [ghidul CLI și Evidence](../cli.md) pentru comenzi native, alegerea furnizorului, instantanee și scripturi.

### Citește primul rezultat

Verifică ținta, locațiile sursă și acoperirea înainte de a trage o concluzie. Rezultatele pot include importuri nerezolvate, informații indisponibile sau limitări chiar dacă o comandă se încheie cu succes. Relațiile statice descriu ce s-a găsit în fișierele furnizate. Confirmă afirmațiile despre comportament printr-o observație la execuție relevantă sau printr-un test țintit.

<a id="update-rea"></a>

### Actualizează REA

REA evoluează rapid, iar versiunile noi includ frecvent corecții. Menține instalarea actualizată.

Pentru CLI instalat cu `npm install --global` sau `bun add --global`:

```bash
rea update
```

Actualizările globale prin Bun necesită Bun 1.2.17 sau ulterior. Actualizează manual o versiune Bun mai veche înainte de a rula `rea update`.

Pentru a reînnoi înregistrările agenților și skill-ul, rulează comanda de configurare afișată de actualizare.

Dacă folosești `npx`, actualizează configurarea agentului cu:

```bash
npx rea-agents@latest setup
```

Verifică modificările și repornește agentul. Pentru comenzi CLI individuale, folosește `npx rea-agents@latest` urmat de comandă. Cu Bun, înlocuiește `npx rea-agents@latest` cu `bunx rea-agents@latest`.

<div align="center">

<br />

<img src="../assets/rea-hopper-analysis.png" alt="REA pornește puntea de analiză în Hopper pentru a inspecta un fișier binar nativ" width="1200" />

<br /><br />

<table aria-label="Comunitatea REA">
<tr>
<td align="center" width="360">
  <a href="https://discord.gg/GkcryMnJDM">
    <img src="../assets/discord.svg" height="42" alt="Discord" /><br />
    <strong>Alătură-te comunității de inginerie inversă</strong>
  </a><br />
  <sub>Discord · Întrebări și răspunsuri · Prezintă proiecte</sub>
</td>
</tr>
</table>

<br />

</div>

<a id="how-rea-works"></a>

## Cum funcționează REA

Agentul apelează REA prin MCP pentru a inspecta ținta și a urmări codul relevant. REA returnează constatările împreună cu dovezile. Agentul le folosește pentru întrebări suplimentare, explicarea comportamentului sau scrierea și testarea unei implementări. Comenzile CLI folosesc aceleași fluxuri.

![Fluxul investigației: agentul întreabă despre o țintă locală, REA o inspectează cu instrumente de analiză, iar agentul folosește codul, referințele și necunoscutele pentru a explica, implementa și testa.](../../website/public/assets/figures/rea-investigation-flow.svg)

[Deschide figura la dimensiunea completă](../../website/public/assets/figures/rea-investigation-flow.svg).

<a id="current-status"></a>

<a id="what-you-can-analyze"></a>

## Ce poți analiza

REA necesită Node.js 22.x (>=22.19), 24.x (>=24.11) sau 26+, plus npm. Instrumentele suplimentare și sistemele gazdă acceptate depind de țintă:

| Țintă                       | Ce returnează REA                                                                                             | Cerințe și ghid                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Fișiere binare native       | Pseudocod, assembly, șiruri, simboluri, apeluri și referințe                                                  | Hopper, Ghidra sau IDA; [analiză nativă](../native-investigation.md)                                                     |
| Structura ELF offline       | Secțiuni, segmente, simboluri/relocări originale și posibile mecanisme statice de protecție                   | pwntools furnizat de utilizator pe Linux x64; [diagnostic binar](../binary-diagnostics.md)                               |
| Fișiere binare Go           | Versiunea încorporată a compilatorului, module, înlocuiri și setări de compilare                              | Inspecție statică ELF/PE/thin Mach-O integrată; nu necesită instalarea Go                                                |
| Fișiere binare Rust         | Nume de crates, versiuni, surse și dependențe încorporate prin cargo-auditable                                | Inspecție statică ELF/PE/thin Mach-O integrată; [Rust](../rust-binaries.md)                                              |
| Artefact WASM               | Validare, secțiuni, forme WAT exacte pentru import/export și WAT decodat                                      | WABT 1.0.42 furnizat de utilizator; `inspect_wasm_artifact`                                                              |
| Bytecode EVM                | Selectori de dispatch, poziții în octeți, argumente deduse și mutabilitate                                    | Intrare locală brută/hex pe Linux x64; [EVM offline](../evm-bytecode.md)                                                 |
| Baze de date SQLite         | Tabele, coloane, indexuri, vederi, triggere și rânduri selectate din tabele obișnuite                         | Instantaneu local al bazei/WAL; Node.js 24.x >=24.15 sau 26+ cu limite SQLite native                                     |
| Blocări Linux înregistrate  | Note brute, registre/semnale pentru toate firele înregistrate și posibile mapări de memorie                   | pwntools furnizat de utilizator pe Linux x64; opțional GDB/pwndbg; [blocări înregistrate](../recorded-crashes.md)        |
| JavaScript / Electron       | Module, importuri, source maps, rute, IPC și relații cu extensiile native                                     | Node.js și npm; Linux: `ps` compatibil cu procps; [analiza aplicațiilor](../javascript-application-workflows.md)         |
| Site-uri                    | Structura paginii, scripturi, observații de rețea și capturi de ecran solicitate                              | Browser din familia Chrome; [analiză în browser](../browser-observation.md)                                              |
| Capturi de rețea salvate    | Cereri, răspunsuri, conținuturi disponibile și locații sursă                                                  | HAR sau Fiddler Everywhere SAZ; mitmdump pe Linux pentru formatul nativ mitmproxy; [capturi](../web-network-captures.md) |
| Ansambluri .NET             | Metadate, instrucțiuni CIL, dependențe native declarate și comparații între compilări                         | Fără instrumente suplimentare (doar static); [.NET](../managed-code-analysis.md)                                         |
| APK-uri Android             | Declarații din manifest, clase, metode decompilate și referințe                                               | JADX fără interfață grafică și JDK complet pe Linux/macOS/Windows x64; [Android](../android-analysis.md)                 |
| Dispozitive Android         | Dispozitive, pachete, procese, jurnale, dump-uri, capturi de ecran și transferuri APK/fișiere                 | adb furnizat de utilizator, emulator sau hardware; [ADB](../adb-device-analysis.md)                                      |
| Proiecte JEB                | Unități de proiect din motor, amprente ale artefactelor și pseudocod pentru tipuri/metode                     | Client JEB pornit de utilizator care oferă MCP, ales prin REA_JEB_MCP_URL; [JEB](../jeb-analysis.md)                     |
| Resurse Android             | Manifest decodat, tabele de șiruri, limbi și informații despre versiuni                                       | Lansator Apktool furnizat de utilizator; [resurse](../apktool-resource-analysis.md)                                      |
| Aplicații Flutter           | Hash-ul instantaneului Dart, amprente ale bibliotecilor per ABI și proveniența compilării motorului           | Fără instrumente suplimentare (parsare statică APK); [Flutter](../flutter-analysis.md)                                   |
| Firmware                    | Regiuni, rezultate de extracție și transfer către analiza nativă                                              | Binwalk / Unblob pe Linux; [firmware](../firmware-analysis.md)                                                           |
| Pachete înregistrate        | Câmpuri selectate, valori repetate, filtre și reguli decode-as                                                | Linux: TShark 4.x + prlimit; [capturi de pachete](../packet-captures.md)                                                 |
| Rezumate de pachete         | Endpointuri, DNS, TLS SNI, distribuția protocoalelor și cereri HTTP                                           | tshark și capinfos furnizate de utilizator (verificate pe Linux); [pcap](../pcap-analysis.md)                            |
| Semnale logice înregistrate | Adnotări ale decodorului, intervale de eșantioane și diagnostic                                               | Linux: sigrok-cli 0.7.2 + prlimit; [semnale](../signal-recordings.md)                                                    |
| Pachete și resurse          | Inventare de fișiere, amprente, plists, structura pachetelor Apple și resurse extrase                         | [Artefacte și JavaScript](../javascript-artifact-reconstruction.md), [aplicații Apple](../apple-application-analysis.md) |
| Comportamentul proceselor   | Ieșire în terminal, interacțiuni, observații despre terminare și sistemul de fișiere, comparații între rulări | Linux/macOS cu PTY nativ; [capturarea proceselor](../process-capture.md)                                                 |

Inspecția statică JavaScript și .NET citește fișierele furnizate fără să ruleze aplicația. Capturarea la execuție rulează ținta selectată sau interacționează cu ea folosind permisiunile utilizatorului tău. Fiecare ghid descrie efectele.

Pentru inspecția offline a fișierelor binare native, REA acceptă și GNU objdump și Rizin furnizate de utilizator. Vezi [ghidul instrumentelor de inginerie inversă](../reverse-engineering-tools.md) pentru configurare, comenzi CLI și limitele Evidence. REA nu instalează și nu actualizează acești furnizori.

<a id="choosing-a-deep-analysis-provider"></a>

Formatele native și sistemele gazdă acceptate variază în funcție de furnizor. Vezi [configurarea Hopper și Ghidra](../installation.md#hopper), [ghidul IDA](../ida-provider.md), inclusiv puntea MCP nativă opțională, și [suportul experimental Ghidra pe Windows](../windows-ghidra-p0.md). Ghidra acceptă și [analiza DOS pe 16 biți](../ghidra-dos.md). Pentru fișiere mari, mărește limita de pornire cu `REA_GHIDRA_STARTUP_TIMEOUT_MS` sau `REA_HOPPER_STARTUP_TIMEOUT_MS`. Pentru alegerea furnizorului, vezi [ghidul CLI](../cli.md#choose-a-provider). Verifică [disponibilitatea în versiuni](../installation.md#released-package-and-main) pentru funcțiile adăugate după cea mai recentă versiune npm.

<a id="showcases"></a>

## Exemple

[![Ilustrații ale panoramării sunetului în DX-Ball, punții clipboard din Notion și cercului de proiectile din TH04](../assets/rea-showcases.png)](https://rea.tools/showcase/)

<a id="dx-ball-reconstruct-a-sound-pan-calculation"></a>

### DX-Ball: reconstruirea unui calcul de panoramare a sunetului

Urmărește un apel audio până la funcția care transformă poziția în panoramare, inspectează instrucțiunile și transformă pseudocodul incomplet în C. Reconstrucția trece 3.205 cazuri pe codul x86 original și reproduce toți cei 63 de octeți ai funcției compilate.

[Citește studiul de caz](https://rea.tools/showcase/dx-ball/) · [Depozitul reconstrucției](https://github.com/N0zoM1z0/dx-ball)

<a id="notion-trace-the-electron-clipboard-bridge"></a>

### Notion: urmărirea punții clipboard din Electron

Găsește API-ul clipboard al rendererului, urmărește-l prin preload și IPC până la procesul principal și inspectează formatul clipboard cu conținut formatat.

[Citește studiul de caz](https://rea.tools/showcase/notion/)

<a id="th04-recover-a-dos-bullet-ring-calculation"></a>

### TH04: recuperarea calculului unui cerc de proiectile în DOS

Inspectează instrucțiunile originale pe 16 biți ale jocului PC-98, recuperează calculele unghiurilor fixe și orientate spre țintă și compară C++ reconstruit cu ieșirea compilatorului istoric.

[Citește studiul de caz](https://rea.tools/showcase/th04/) · [Depozitul reconstrucției](https://github.com/N0zoM1z0/th04)

Ai folosit REA pentru ceva interesant? Prezintă cazul într-un [issue](https://github.com/morluto/rea/issues) sau [pull request](https://github.com/morluto/rea/pulls), incluzând ținta, întrebarea, cum te-a ajutat REA și ce ai descoperit.

<a id="faq"></a>

## Întrebări frecvente

<details>
<summary><strong>Ce agenți pot folosi REA?</strong></summary>

Orice agent care acceptă servere MCP locale. Configurarea pregătește [agenții acceptați](../installation.md#supported-agents); alți clienți pot folosi [înregistrarea manuală MCP](../installation.md#mcp-registry).

</details>

<details>
<summary><strong>Am nevoie de Hopper, Ghidra sau IDA?</strong></summary>

Analiza nativă aprofundată folosește unul dintre aceste motoare. Inspecția statică JavaScript și .NET funcționează fără un motor de analiză nativă. Configurarea poate instala Hopper după aprobare; Ghidra și IDA folosesc instalările existente. Vezi [configurarea furnizorilor](../installation.md#hopper).

</details>

<details>
<summary><strong>Trebuie să pornesc Hopper înainte?</strong></summary>

REA pornește Hopper când o operație are nevoie de el. Pe macOS, un dialog la prima utilizare poate cere alegerea modului demo sau activarea licenței. Finalizează dialogul în aceeași sesiune de utilizator înainte de prima operație CLI/MCP sau de o sarcină nesupravegheată. Deschide Hopper manual dacă este necesar. Vezi [pornirea Hopper și depanarea](../installation.md#launcher-paths-and-troubleshooting).

</details>

<details>
<summary><strong>Ce face instalarea skill-ului de pe skills.sh?</strong></summary>

Skill-ul oferă agentului instrucțiuni pentru investigații. Folosește `npx rea-agents setup` pentru a înregistra serverul MCP REA și a instala instrucțiunile corespunzătoare, apoi repornește agentul. Vezi [instalarea doar a skill-ului](../installation.md#skill-only-installation).

</details>

<details>
<summary><strong>Ce cod returnează REA?</strong></summary>

Analiza nativă returnează pseudocod și assembly. Analiza JavaScript/Electron recuperează module și relațiile dintre ele. Agentul folosește aceste constatări pentru a scrie și testa o implementare. [Exemplele](#showcases) arată procesul complet.

</details>

<details>
<summary><strong>REA încarcă aplicația mea pe un server?</strong></summary>

REA analizează țintele local. Agentul primește rezultatele instrumentelor, iar furnizorul modelului are propria politică privind datele.

</details>

<details>
<summary><strong>Ce fac dacă întâmpin o eroare?</strong></summary>

Actualizează mai întâi; o versiune recentă poate conține deja remedierea.

Pentru CLI instalat cu `npm install --global` sau `bun add --global`:

```bash
rea update
```

Pentru configurarea agentului prin `npx`:

```bash
npx rea-agents@latest setup
```

Dacă folosești un agent, finalizează [actualizarea configurației](#update-rea) și repornește-l. Repetă aceeași sarcină. Dacă problema persistă, [deschide un issue](https://github.com/morluto/rea/issues) cu versiunea REA, tipul țintei, pașii de reproducere și mesajele de eroare.

</details>

<a id="documentation"></a>

## Documentație

Începe cu [ghidurile practice](https://rea.tools/guides/). Pentru opțiuni exacte, cerințe și contractele rezultatelor:

- [Instalare și configurare](../installation.md): înregistrarea agenților, furnizori, actualizări și dezinstalare.
- [Pregătire și depanare](../installation.md#check-readiness-for-your-task): diagnosticarea unui agent sau motor de analiză.
- [CLI și Evidence](../cli.md): comenzi, alegerea furnizorului, instantanee, import/export și stări de ieșire.
- [Contracte MCP](../mcp-contracts.md) și [prompturi pentru agenți](../mcp-prompts.md): rezultate, sesiuni și investigații ghidate.
- [Catalog de instrumente](../mcp-contracts.md#generated-catalog): inventar generat de instrumente, furnizori și comenzi CLI.
- [Plan de dezvoltare](../roadmap.md): lucrări planificate și urmărirea capabilităților.

Raportează vulnerabilitățile conform [SECURITY.md](../../SECURITY.md).

<a id="star-history"></a>

## Istoricul stelelor

**200.000 de stele pe GitHub. Mulțumim!**

Mulțumim tuturor celor care folosesc REA, raportează erori, cer funcții, testează versiuni și contribuie cu remedieri.

<a href="https://www.star-history.com/?repos=morluto%2Frea&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date&amp;theme=dark&amp;legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
    <img alt="Istoricul stelelor REA pe GitHub" src="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
  </picture>
</a>

<a id="disclaimer"></a>

## Precizări

Vezi [DISCLAIMER.md](../../DISCLAIMER.md) pentru utilizare responsabilă.

Poziția proiectului privind utilizarea ilegală sau neautorizată se aplică tuturor versiunilor REA, canalelor de distribuție și platformelor. Fiecare copie își păstrează licențele aplicabile.

REA este destinat cercetării legale, educației, interoperabilității, conservării software-ului și analizei programelor pe care le deții sau ai dreptul să le examinezi.

<a id="contributing"></a>

## Contribuții

Ajutorul tău este binevenit! [Deschide un issue](https://github.com/morluto/rea/issues) pentru a raporta o eroare sau a propune o funcție, ori [trimite un pull request](https://github.com/morluto/rea/pulls) pentru a îmbunătăți codul sau documentația.

Vezi [CONTRIBUTING.md](../../CONTRIBUTING.md) pentru mediul de dezvoltare și verificări, [testarea](../testing.md) pentru fluxurile de verificare și [harta arhitecturii](../architecture.mermaid) pentru structura proiectului.

<a id="license"></a>

## Licență

[MIT](../../LICENSE)

Codul scris pentru REA este licențiat sub MIT. Materialele terților își păstrează propriile licențe și notificări de drepturi de autor. Vezi [notificările terților](../../THIRD_PARTY_NOTICES.md) pentru inventarul dependențelor, textele licențelor și condițiile instrumentelor externe.

**Trebuie să obții legal instrumentele comerciale și să ai dreptul să le folosești**, inclusiv IDA Pro / decompilatoarele Hex-Rays, Hopper și JEB, conform licențelor lor. REA nu acordă o licență, o cheie sau un drept de activare pentru aceste instrumente. Versiunile de probă și demo rămân supuse condițiilor furnizorilor, inclusiv limitărilor privind utilizatorii, funcțiile, automatizarea și partajarea rezultatelor. Copiile modificate pentru a eluda licența, cheile furate, partajarea neautorizată a cheilor și ocolirea restricțiilor de licență nu sunt autorizate. Aceste precizări nu modifică MIT sau licențele terților.
