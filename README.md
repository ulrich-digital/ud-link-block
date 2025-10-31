# UD Block: Link 

Ein modularer Block zur Darstellung einzelner Links mit automatischer Icon-Erkennung (z. B. PDF, extern, ZIP, Video).
Der Block wird einzeln oder innerhalb anderer Container-Blöcke – etwa `ud/tagged-links-block` – verwendet, um strukturierte Linklisten aufzubauen.


## Funktionen

- Unterstützt verschiedene Linktypen:
  - Interne Seiten (über Seitenauswahl)
  - Externe Links
  - PDF- und andere Mediendateien (über Medienauswahl)
  - ZIP- und MP4-Dateien mit passender Icon-Erkennung
- Automatische Icon-Zuweisung je nach Dateityp:
  - interne Links
  - externe Links
  - Video / MP4
  - PDF
  - ZIP
- Öffnet externe Links und Mediendateien automatisch in einem neuen Tab, interne Links bleiben im selben Tab
- Integration von Schlagwörtern (`data-tags` & `data-tags-slug`)
- Kompatibel mit Full Site Editing (FSE)
- Unterstützt Kombination mit Container-Blöcken wie `ud-tagged-links-block`


## Screenshots
![Frontend-Ansicht](./assets/ud-link-block.png)
*Darstellung des Link-Blocks mit automatischem Icon.*

![Editor-Ansicht](./assets/details_context.png)
*Der Block im Gutenberg-Editor mit Eingabefeldern für Titel, Link und Tags. Optionen werden kontextabhängig eingeblendet.*


## Technische Details

- Entwickelt mit [`@wordpress/scripts`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- Modularer Aufbau mit getrennten Dateien für:
  - `edit.js` – Editor-Komponente und Medienauswahl
  - `save.js` – Rendering-Logik für Gutenberg
  - `render.php` – serverseitige Ausgabe (für dynamische Nutzung)
  - `helpers.php` – Hilfsfunktionen für Typ- und Icon-Erkennung
- Automatische Erkennung des Dateityps über MIME oder Dateiendung
- Zukunftssichere Props für WordPress 7.0+:
  - `__next40pxDefaultSize={true}`
  - `__nextHasNoMarginBottom={true}`



## Autor

[ulrich.digital gmbh](https://ulrich.digital)


## Lizenz

GPL v2 or later
[https://www.gnu.org/licenses/gpl-2.0.html](https://www.gnu.org/licenses/gpl-2.0.html)

