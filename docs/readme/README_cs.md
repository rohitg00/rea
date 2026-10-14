<div align="center">

<details>
<summary>Vyberte jazyk</summary>

[🇺🇸&nbsp;English](../../README.md) · [🇨🇳&nbsp;简体中文](README_zh.md) · [🇹🇼&nbsp;繁體中文](README_zh-TW.md) · [🇯🇵&nbsp;日本語](README_ja.md) · [🇰🇷&nbsp;한국어](README_ko.md) · [🇹🇷&nbsp;Türkçe](README_tr.md) · [🇷🇺&nbsp;Русский](README_ru.md) · [🇻🇳&nbsp;Tiếng Việt](README_vi.md) · [🇹🇭&nbsp;ไทย](README_th.md) · [🇩🇪&nbsp;Deutsch](README_de.md) · [🇪🇸&nbsp;Español](README_es.md) · [🇫🇷&nbsp;Français](README_fr.md) · [🇺🇦&nbsp;Українська](README_uk.md) · [🇵🇱&nbsp;Polski](README_pl.md) · [🇧🇷&nbsp;Português (Brasil)](README_pt-BR.md) · [🇸🇦&nbsp;العربية](README_ar.md) · [🇮🇷&nbsp;فارسی](README_fa.md) · [🇮🇩&nbsp;Bahasa Indonesia](README_id.md) · [🇮🇹&nbsp;Italiano](README_it.md) · [🇬🇷&nbsp;Ελληνικά](README_el.md) · [🇳🇱&nbsp;Nederlands](README_nl.md) · [🇸🇪&nbsp;Svenska](README_sv.md) · **🇨🇿&nbsp;Čeština** · [🇷🇴&nbsp;Română](README_ro.md)

</details>

# REA: Reverse Engineer Anything

<a id="one-mcp-for-reverse-engineering-across-binaries-applications-and-runtime-behavior"></a>

### Jedno MCP pro reverzní inženýrství binárních souborů, aplikací a chování za běhu.

**Zaujala vás nějaká funkce? Zjistěte, jak funguje, až na úroveň strojového kódu.**

[![Verze npm](https://img.shields.io/npm/v/rea-agents?style=flat-square&color=cb3837)](https://www.npmjs.com/package/rea-agents)
[![Katalog nástrojů MCP](https://img.shields.io/badge/MCP-tool_catalog-5c4ee5?style=flat-square)](../mcp-contracts.md#generated-catalog)
[![Požadavky Node.js](https://img.shields.io/badge/Node.js-requirements-339933?style=flat-square&logo=nodedotjs&logoColor=white)](#what-you-can-analyze)
[![skills.sh](https://skills.sh/b/morluto/rea?style=flat-square)](https://skills.sh/morluto/rea/reverse-engineer-anything)
[![Licence MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](../../LICENSE)
[![Discord](https://img.shields.io/discord/1556595354999332884?logo=discord&logoColor=white&label=Discord&color=5865F2)](https://discord.gg/GkcryMnJDM)

<a href="https://trendshift.io/repositories/82054?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-82054" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/82054" alt="morluto%2Frea | Trendshift" width="250" height="55"/></a>

**[Web](https://rea.tools/) · [Průvodci](https://rea.tools/guides/) · [Ukázky](https://rea.tools/showcase/)**

[Rychlý start](#quick-start) · [Jak REA funguje](#how-rea-works) · [Co lze analyzovat](#what-you-can-analyze) · [Ukázky](#showcases) · [Časté dotazy](#faq) · [Dokumentace](#documentation)

<code>npx rea-agents setup</code>

</div>

> [!IMPORTANT]
> REA získávejte z [morluto/rea](https://github.com/morluto/rea), [rea.tools](https://rea.tools/) nebo z [balíčku rea-agents na npm](https://www.npmjs.com/package/rea-agents). Používejte odkazy na instalaci a vydání z těchto oficiálních zdrojů. Podobný název repozitáře ani zkopírovaný README nedokazují, že je stažený soubor oficiální.

---

Chcete pochopit funkci v nějaké aplikaci? Požádejte svého agenta, aby ji prozkoumal pomocí REA. Agent může aplikaci zkoumat bez zdrojového kódu, doložit zjištění a využít výsledky k napsání a otestování implementace pro váš projekt.

REA propojuje agenta s nástroji pro zkoumání nativních binárních souborů, aplikací JavaScript/Electron, sestavení .NET a webů. Stejné postupy jsou dostupné v terminálu. Analýza probíhá lokálně a výsledky obsahují podklady i omezení jednotlivých závěrů.

Instalace zaregistruje REA u agenta a přidá odpovídající pracovní instrukce. Nativní analýza může využít existující instalaci Hopperu, Ghidry nebo IDA; instalátor může s vaším souhlasem nainstalovat Hopper. Statická analýza JavaScriptu nativní analytický engine nevyžaduje.

> **[Navštivte web REA](https://rea.tools/)** s instalačními pokyny, ilustrovanými průvodci a skutečnými případovými studiemi.

<a id="quick-start"></a>

## Rychlý start

| Chci…                                                 | Začněte zde                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| Nechat agenta prozkoumat aplikaci                     | [Nastavte agenta](#set-up-your-agent) a položte konkrétní otázku.      |
| Zkoumat JavaScript nebo Electron bez nativního enginu | [Použijte terminál](#use-the-terminal) s lokálním adresářem nebo ASAR. |
| Vybrat poskytovatele pro jiný cíl                     | Podívejte se na [cíle a požadavky](#what-you-can-analyze).             |
| Projít hotovou rekonstrukci                           | Přečtěte si [ukázky](#showcases).                                      |

**Požadavky:** Node.js 22.x (>=22.19), 24.x (>=24.11) nebo 26+ a npm.

Na Linuxu vyžadují Ghidra, JADX, spouštění nástrojů pro firmware a statická analýza JavaScript/Electron příkaz `ps` kompatibilní s procps v `PATH` REA pro kontrolu vlastnictví procesů. Nápravu popisuje `docs/installation.md` v části "Linux owned-process prerequisite".

<a id="set-up-your-agent"></a>

### Nastavte agenta

S nainstalovaným Node.js a npm spusťte:

```bash
npx rea-agents setup
```

Vyberte agenty, zkontrolujte navržené změny a schvalte je. Instalace přidá MCP server REA a odpovídající instrukce a zazálohuje existující konfiguraci. Poté agenta restartujte.

Instalace podporuje Claude Code, Codex, Cursor, Gemini CLI, Grok Build a [další agenty](../installation.md#supported-agents). Konfiguraci poskytovatelů a ruční registraci MCP popisuje [instalační průvodce](../installation.md).

<a id="ask-your-agent"></a>

### Zeptejte se agenta

```text
Zjisti, jak funguje vyhledávání v aplikaci Notes, ukaž mi podklady a vytvoř
podobnou funkci pro můj projekt.
```

Nahraďte Notes cílovou aplikací a uveďte funkci, které chcete porozumět.

<a id="use-the-terminal"></a>

### Použijte terminál

Prozkoumejte rozbalený adresář aplikace JavaScript/Electron nebo soubor ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

Výsledek zahrnuje moduly, importy, rozhraní mezi částmi Electronu a příslušné podklady. Nahraďte cestu vlastním cílem, například `"D:/apps/example"` na Windows.

Pro pravidelné používání nainstalujte příkaz `rea`:

```bash
npm install --global rea-agents
rea --help
```

Pro nativní analýzu nejprve nastavte poskytovatele. [Průvodce CLI a Evidence](../cli.md) popisuje nativní příkazy, výběr poskytovatele, snímky a skriptování.

### Jak číst první výsledek

Před vyvozením závěru ověřte cíl, zdrojová umístění a rozsah pokrytí. Výsledky mohou obsahovat nevyřešené importy, nedostupné skutečnosti nebo omezení, i když příkaz skončí úspěšně. Statické vztahy popisují nálezy v dodaných souborech. Tvrzení o chování potvrďte vhodným pozorováním za běhu nebo cíleným testem.

<a id="update-rea"></a>

### Aktualizujte REA

REA se rychle vyvíjí a nová vydání často opravují chyby. Udržujte instalaci aktuální.

Pro CLI nainstalované pomocí `npm install --global` nebo `bun add --global`:

```bash
rea update
```

Globální aktualizace přes Bun vyžadují Bun 1.2.17 nebo novější. Starší Bun nejprve aktualizujte ručně a teprve potom spusťte `rea update`.

Registrace agentů a skill obnovíte instalačním příkazem, který aktualizace vypíše.

Pokud používáte `npx`, obnovte nastavení agenta pomocí:

```bash
npx rea-agents@latest setup
```

Zkontrolujte změny a restartujte agenta. Pro jednorázové příkazy použijte `npx rea-agents@latest` následované příkazem. S Bun použijte místo `npx rea-agents@latest` příkaz `bunx rea-agents@latest`.

<div align="center">

<br />

<img src="../assets/rea-hopper-analysis.png" alt="REA spouští analytický bridge v Hopperu při zkoumání nativního binárního souboru" width="1200" />

<br /><br />

<table aria-label="Komunita REA">
<tr>
<td align="center" width="360">
  <a href="https://discord.gg/GkcryMnJDM">
    <img src="../assets/discord.svg" height="42" alt="Discord" /><br />
    <strong>Přidejte se ke komunitě reverzního inženýrství</strong>
  </a><br />
  <sub>Discord · Otázky a odpovědi · Sdílení projektů</sub>
</td>
</tr>
</table>

<br />

</div>

<a id="how-rea-works"></a>

## Jak REA funguje

Agent volá REA přes MCP, aby zkoumal cíl a sledoval související kód. REA vrací zjištění s podklady. Agent je využívá k doplňujícím otázkám, vysvětlení chování nebo napsání a otestování implementace. CLI používá stejné postupy.

![Postup zkoumání: agent se ptá na lokální cíl, REA jej zkoumá analytickými nástroji a agent využívá vrácený kód, odkazy a neznámé skutečnosti k vysvětlení, implementaci a testování.](../../website/public/assets/figures/rea-investigation-flow.svg)

[Otevřít obrázek v plné velikosti](../../website/public/assets/figures/rea-investigation-flow.svg).

<a id="current-status"></a>

<a id="what-you-can-analyze"></a>

## Co lze analyzovat

REA vyžaduje Node.js 22.x (>=22.19), 24.x (>=24.11) nebo 26+ a npm. Další nástroje a podporované systémy závisejí na cíli:

| Cíl                         | Co REA vrací                                                                            | Požadavky a průvodce                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Nativní binární soubory     | Pseudokód, assembler, řetězce, symboly, volání a odkazy                                 | Hopper, Ghidra nebo IDA; [nativní analýza](../native-investigation.md)                                                         |
| Struktura ELF offline       | Sekce, segmenty, původní symboly/relokace a možné staticky zjištěné ochrany             | Vlastní pwntools na Linux x64; [diagnostika binárních souborů](../binary-diagnostics.md)                                       |
| Binární soubory Go          | Vložená verze kompilátoru, moduly, náhrady a nastavení sestavení                        | Vestavěná statická kontrola ELF/PE/thin Mach-O; instalace Go není potřeba                                                      |
| Binární soubory Rust        | Vložené názvy crates, verze, zdroje a závislosti ve formátu cargo-auditable             | Vestavěná statická kontrola ELF/PE/thin Mach-O; [Rust](../rust-binaries.md)                                                    |
| Artefakt WASM               | Validace, sekce, přesné WAT podoby importů/exportů a dekódovaný WAT                     | Vlastní WABT 1.0.42; `inspect_wasm_artifact`                                                                                   |
| Bytecode EVM                | Selektory dispatch, bajtové pozice, odvozené argumenty a měnitelnost                    | Lokální surový/hex vstup na Linux x64; [EVM offline](../evm-bytecode.md)                                                       |
| Databáze SQLite             | Tabulky, sloupce, indexy, pohledy, triggery a vybrané řádky běžných tabulek             | Lokální snímek databáze/WAL; Node.js 24.x >=24.15 nebo 26+ s nativními limity SQLite                                           |
| Zaznamenané pády Linuxu     | Surové notes, registry/signály všech zaznamenaných vláken a možná mapování paměti       | Vlastní pwntools na Linux x64; volitelně GDB/pwndbg; [zaznamenané pády](../recorded-crashes.md)                                |
| JavaScript / Electron       | Moduly, importy, source maps, routy, IPC a vztahy k nativním doplňkům                   | Node.js a npm; Linux: `ps` kompatibilní s procps; [analýza aplikací](../javascript-application-workflows.md)                   |
| Weby                        | Struktura stránky, skripty, síťová pozorování a vyžádané snímky obrazovky               | Prohlížeč z rodiny Chrome; [analýza prohlížeče](../browser-observation.md)                                                     |
| Uložené síťové záznamy      | Požadavky, odpovědi, dostupné datové obsahy a zdrojová umístění                         | HAR nebo Fiddler Everywhere SAZ; mitmdump na Linuxu pro nativní formát mitmproxy; [síťové záznamy](../web-network-captures.md) |
| Sestavení .NET              | Metadata, instrukce CIL, deklarované nativní závislosti a porovnání sestavení           | Bez dalších nástrojů (pouze staticky); [.NET](../managed-code-analysis.md)                                                     |
| Android APK                 | Deklarace manifestu, třídy, dekompilované metody a odkazy                               | Headless JADX a úplné JDK na Linux/macOS/Windows x64; [Android](../android-analysis.md)                                        |
| Zařízení Android            | Zařízení, balíčky, procesy, logy, výpisy, snímky obrazovky a přenos APK/souborů         | Vlastní adb, emulátor nebo hardware; [ADB](../adb-device-analysis.md)                                                          |
| Projekty JEB                | Jednotky projektu z enginu, otisky artefaktů a pseudokód typů/metod                     | Vlastní spuštěný klient JEB poskytující MCP, vybraný přes REA_JEB_MCP_URL; [JEB](../jeb-analysis.md)                           |
| Prostředky Androidu         | Dekódovaný manifest, tabulky řetězců, jazyky a údaje o verzích                          | Vlastní spouštěč Apktool; [prostředky](../apktool-resource-analysis.md)                                                        |
| Aplikace Flutter            | Hash snímku Dart, otisky knihoven podle ABI a původ sestavení enginu                    | Bez dalších nástrojů (statické parsování APK); [Flutter](../flutter-analysis.md)                                               |
| Firmware                    | Oblasti, výsledky extrakce a předání k nativní analýze                                  | Binwalk / Unblob na Linuxu; [firmware](../firmware-analysis.md)                                                                |
| Zaznamenané pakety          | Vybraná pole, opakované hodnoty, filtry a pravidla decode-as                            | Linux: TShark 4.x + prlimit; [paketové záznamy](../packet-captures.md)                                                         |
| Souhrny paketů              | Koncové body, DNS, TLS SNI, rozložení protokolů a HTTP požadavky                        | Vlastní tshark a capinfos (ověřeno na Linuxu); [pcap](../pcap-analysis.md)                                                     |
| Zaznamenané logické signály | Anotace dekodéru, rozsahy vzorků a diagnostika                                          | Linux: sigrok-cli 0.7.2 + prlimit; [signály](../signal-recordings.md)                                                          |
| Balíčky a prostředky        | Soupisy souborů, otisky, plists, struktura balíků Apple a extrahované prostředky        | [Artefakty a JavaScript](../javascript-artifact-reconstruction.md), [aplikace Apple](../apple-application-analysis.md)         |
| Chování procesů             | Výstup terminálu, interakce, pozorování ukončení a souborového systému a porovnání běhů | Linux/macOS s nativním PTY; [záznam procesů](../process-capture.md)                                                            |

Statická kontrola JavaScriptu a .NET čte dodané soubory bez spuštění aplikace. Záznam za běhu spouští vybraný cíl nebo s ním komunikuje s vašimi uživatelskými oprávněními. Účinky popisují jednotlivé průvodce.

Pro offline kontrolu nativních binárních souborů podporuje REA také vlastní instalace GNU objdump a Rizin. [Průvodce nástroji reverzního inženýrství](../reverse-engineering-tools.md) popisuje konfiguraci, příkazy CLI a omezení Evidence. REA tyto poskytovatele neinstaluje ani neaktualizuje.

<a id="choosing-a-deep-analysis-provider"></a>

Podpora nativních formátů a hostitelských systémů závisí na poskytovateli. Viz [Hopper a Ghidra](../installation.md#hopper), [průvodce IDA](../ida-provider.md) včetně volitelného nativního MCP bridge a [experimentální Ghidra na Windows](../windows-ghidra-p0.md). Ghidra podporuje i [16bitovou analýzu DOS](../ghidra-dos.md). U velkých souborů prodlužte časový limit spuštění pomocí `REA_GHIDRA_STARTUP_TIMEOUT_MS` nebo `REA_HOPPER_STARTUP_TIMEOUT_MS`. Výběr poskytovatele popisuje [průvodce CLI](../cli.md#choose-a-provider). U funkcí přidaných po posledním vydání na npm ověřte [dostupnost ve vydáních](../installation.md#released-package-and-main).

<a id="showcases"></a>

## Ukázky

[![Ilustrace panorámování zvuku v DX-Ball, propojení schránky v Notion a kruhu střel v TH04](../assets/rea-showcases.png)](https://rea.tools/showcase/)

<a id="dx-ball-reconstruct-a-sound-pan-calculation"></a>

### DX-Ball: rekonstrukce výpočtu panorámování zvuku

Sledujte zvukové volání do pomocné funkce převádějící polohu na stereopozici, prozkoumejte instrukce a převeďte neúplný pseudokód do C. Rekonstrukce vyhovuje 3 205 případům vůči původnímu x86 kódu a reprodukuje všech 63 bajtů zkompilované funkce.

[Přečíst případovou studii](https://rea.tools/showcase/dx-ball/) · [Repozitář rekonstrukce](https://github.com/N0zoM1z0/dx-ball)

<a id="notion-trace-the-electron-clipboard-bridge"></a>

### Notion: sledování propojení schránky v Electronu

Najděte API schránky v rendereru, sledujte je přes preload a IPC do hlavního procesu a prozkoumejte formát schránky s formátovaným obsahem.

[Přečíst případovou studii](https://rea.tools/showcase/notion/)

<a id="th04-recover-a-dos-bullet-ring-calculation"></a>

### TH04: obnova výpočtu kruhu střel v DOSu

Prozkoumejte původní 16bitové instrukce hry pro PC-98, obnovte výpočty pevných a mířených úhlů a porovnejte rekonstruované C++ s výstupem dobového kompilátoru.

[Přečíst případovou studii](https://rea.tools/showcase/th04/) · [Repozitář rekonstrukce](https://github.com/N0zoM1z0/th04)

Použili jste REA k zajímavému zkoumání? Sdílejte je v [issue](https://github.com/morluto/rea/issues) nebo [pull requestu](https://github.com/morluto/rea/pulls). Uveďte cíl, otázku, jak REA pomohlo a co jste zjistili.

<a id="faq"></a>

## Časté dotazy

<details>
<summary><strong>Kteří agenti mohou REA používat?</strong></summary>

Každý agent podporující lokální MCP servery. Instalace nastaví [podporované agenty](../installation.md#supported-agents); ostatní klienti mohou využít [ruční registraci MCP](../installation.md#mcp-registry).

</details>

<details>
<summary><strong>Potřebuji Hopper, Ghidru nebo IDA?</strong></summary>

Hloubková nativní analýza používá jeden z těchto enginů. Statická kontrola JavaScriptu a .NET funguje bez nativního analytického enginu. Instalátor může po schválení nainstalovat Hopper; Ghidra a IDA používají existující instalace. Viz [nastavení poskytovatelů](../installation.md#hopper).

</details>

<details>
<summary><strong>Musím nejprve spustit Hopper?</strong></summary>

REA spustí Hopper, když jej operace potřebuje. Na macOS může při prvním spuštění dialog požádat o výběr demo režimu nebo aktivaci licence. Dokončete jej ve stejné uživatelské relaci před první operací CLI/MCP nebo bezobslužnou úlohou. Podle potřeby otevřete Hopper ručně. Viz [spuštění Hopperu a řešení problémů](../installation.md#launcher-paths-and-troubleshooting).

</details>

<details>
<summary><strong>Co dělá instalace skillu ze skills.sh?</strong></summary>

Skill poskytuje agentovi instrukce pro zkoumání. Pomocí `npx rea-agents setup` zaregistrujte MCP server REA a nainstalujte odpovídající instrukce. Pak agenta restartujte. Viz [instalace samotného skillu](../installation.md#skill-only-installation).

</details>

<details>
<summary><strong>Jaký kód REA vrací?</strong></summary>

Nativní analýza vrací pseudokód a assembler. Analýza JavaScript/Electron obnovuje moduly a jejich vztahy. Agent tato zjištění používá k napsání a otestování implementace. Viz [ukázky](#showcases).

</details>

<details>
<summary><strong>Nahrává REA mou aplikaci někam?</strong></summary>

REA analyzuje cíle lokálně. Agent dostává výsledky nástrojů a poskytovatel modelu má vlastní pravidla nakládání s daty.

</details>

<details>
<summary><strong>Co mám dělat, když narazím na chybu?</strong></summary>

Nejprve aktualizujte; novější vydání už může problém opravovat.

Pro CLI nainstalované pomocí `npm install --global` nebo `bun add --global`:

```bash
rea update
```

Pro nastavení agenta přes `npx`:

```bash
npx rea-agents@latest setup
```

Dokončete [obnovení nastavení](#update-rea) a restartujte agenta, pokud jej používáte. Zopakujte stejnou úlohu. Pokud problém trvá, [otevřete issue](https://github.com/morluto/rea/issues) s verzí REA, typem cíle, kroky k reprodukci a chybovým výstupem.

</details>

<a id="documentation"></a>

## Dokumentace

Začněte [praktickými průvodci](https://rea.tools/guides/) na webu. Přesné volby, požadavky a kontrakty výsledků najdete zde:

- [Instalace a nastavení](../installation.md): registrace agentů, poskytovatelé, aktualizace a odinstalace.
- [Připravenost a řešení problémů](../installation.md#check-readiness-for-your-task): diagnostika agenta nebo analytického enginu.
- [CLI a Evidence](../cli.md): příkazy, výběr poskytovatele, snímky, import/export a návratové stavy.
- [Kontrakty MCP](../mcp-contracts.md) a [prompty pro agenty](../mcp-prompts.md): výsledky nástrojů, relace a řízené zkoumání.
- [Katalog nástrojů](../mcp-contracts.md#generated-catalog): generovaný přehled nástrojů, poskytovatelů a příkazů CLI.
- [Plán rozvoje](../roadmap.md): plánovaná práce a sledování schopností.

Zranitelnosti hlaste podle [SECURITY.md](../../SECURITY.md).

<a id="star-history"></a>

## Historie hvězdiček

**200 000 hvězdiček na GitHubu. Děkujeme!**

Děkujeme všem, kdo používají REA, hlásí chyby, navrhují funkce, testují sestavení a přispívají opravami.

<a href="https://www.star-history.com/?repos=morluto%2Frea&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date&amp;theme=dark&amp;legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
    <img alt="Historie hvězdiček REA na GitHubu" src="https://api.star-history.com/chart?repos=morluto/rea&amp;type=date" />
  </picture>
</a>

<a id="disclaimer"></a>

## Upozornění

Pokyny k odpovědnému použití najdete v [DISCLAIMER.md](../../DISCLAIMER.md).

Postoj projektu k nezákonnému nebo neoprávněnému použití platí pro všechny verze REA, distribuční kanály i platformy. Každá kopie si zachovává příslušné licence.

REA je určeno k zákonnému výzkumu, vzdělávání, interoperabilitě, uchování softwaru a analýze softwaru, který vlastníte nebo smíte zkoumat.

<a id="contributing"></a>

## Přispívání

Vaše pomoc je vítána! [Otevřete issue](https://github.com/morluto/rea/issues) s chybou či návrhem funkce nebo [pošlete pull request](https://github.com/morluto/rea/pulls) se zlepšením kódu či dokumentace.

Viz [CONTRIBUTING.md](../../CONTRIBUTING.md) pro vývojové prostředí a kontroly, [testování](../testing.md) pro ověřovací postupy a [mapu architektury](../architecture.mermaid) pro strukturu projektu.

<a id="license"></a>

## Licence

[MIT](../../LICENSE)

Kód vytvořený v projektu REA je licencován pod MIT. Materiály třetích stran si zachovávají vlastní licence a autorskoprávní oznámení. Viz [oznámení třetích stran](../../THIRD_PARTY_NOTICES.md) s přehledem závislostí, uchovanými licenčními texty a podmínkami externích nástrojů.

**Komerční nástroje musíte získat legálně a mít oprávnění je používat**, včetně IDA Pro / dekompilátorů Hex-Rays, Hopperu a JEB, podle jejich licencí. REA neposkytuje licenci, klíč ani právo na aktivaci těchto nástrojů. Zkušební a demo verze nadále podléhají podmínkám dodavatelů, včetně omezení uživatelů, funkcí, automatizace a sdílení výstupů. Cracknuté kopie, odcizené klíče, neoprávněné sdílení klíčů a obcházení licenčních omezení nejsou povoleny. Toto upozornění nemění MIT ani licence třetích stran.
