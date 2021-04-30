import React from "react";
import "../App.css";

function ExtendedManual() {
  return (
    <div className="scrollable scrollbarless extendedManual">
      <p className="intro">
        Artsdatabankens Artsorakel prøver å artsbestemme bilder ved hjelp av
        maskinlæring. Artsorakelet kjenner kun viltlevende arter (ingen husdyr,
        hageplanter, osv.) og gir svar på artsnivå (og noen underarter).
      </p>
      <p>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M3,13A9,9 0 0,0 12,22A9,9 0 0,0 3,13M12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,22M18,3V8A6,6 0 0,1 12,14A6,6 0 0,1 6,8V3C6.74,3 7.47,3.12 8.16,3.39C8.71,3.62 9.2,3.96 9.61,4.39L12,2L14.39,4.39C14.8,3.96 15.29,3.62 15.84,3.39C16.53,3.12 17.26,3 18,3Z"
          />
        </svg>
        Legg til et bilde, enten ved å bruke kameraet, eller velge et bilde du
        har lagret.
      </p>
      <p>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,3H15V5H19V9H21V5C21,3.89 20.1,3 19,3M19,19H15V21H19A2,2 0 0,0 21,19V15H19M5,15H3V19A2,2 0 0,0 5,21H9V19H5M3,5V9H5V5H9V3H5A2,2 0 0,0 3,5Z"
          />
        </svg>
        Når du har lagt til bilde kommer redigeringsskjermen opp. Zoom inn og
        rotér slik at du får fokus på arten.
      </p>
      <p>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z"
          />
        </svg>
        Du kan legge til flere bilder, og det kan hjelpe på gjenkjenningen. Ta
        gjerne bilder fra forskjellige vinkler eller av ulike deler. Du har
        alltid muligheten til å trykke på bildene som er lagt til for å redigere
        dem på nytt eller fjerne dem.
      </p>
      <p>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M22,13A3,3 0 0,0 19,10H17.5V9.5A5.5,5.5 0 0,0 12,4C9.5,4 7.37,5.69 6.71,8H6A4,4 0 0,0 2,12A4,4 0 0,0 6,16H9V16.5C9,17 9.06,17.5 9.17,18H6A6,6 0 0,1 0,12C0,8.9 2.34,6.36 5.35,6.04C6.6,3.64 9.11,2 12,2C15.64,2 18.67,4.59 19.36,8.04C21.95,8.22 24,10.36 24,13C24,14.65 23.21,16.1 22,17V16.5C22,15.77 21.88,15.06 21.65,14.4C21.87,14 22,13.5 22,13Z"
          />
        </svg>
        Tykk på «Identifiser». Bildene sendes til orakelet og etter kort tid har
        du fått resultatet! Resultatene vises med treffprosent for hver art.
      </p>
      <p>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M13 3C16.88 3 20 6.14 20 10C20 12.8 18.37 15.19 16 16.31V21H9V18H8C6.89 18 6 17.11 6 16V13H4.5C4.08 13 3.84 12.5 4.08 12.19L6 9.66C6.19 5.95 9.23 3 13 3M13 1C8.41 1 4.61 4.42 4.06 8.9L2.5 11L2.47 11L2.45 11.03C1.9 11.79 1.83 12.79 2.26 13.62C2.62 14.31 3.26 14.79 4 14.94V16C4 17.85 5.28 19.42 7 19.87V23H18V17.5C20.5 15.83 22 13.06 22 10C22 5.03 17.96 1 13 1M17.33 9.3L15.37 9.81L16.81 11.27C17.16 11.61 17.16 12.19 16.81 12.54S15.88 12.89 15.54 12.54L14.09 11.1L13.57 13.06C13.45 13.55 12.96 13.82 12.5 13.7C12 13.57 11.72 13.08 11.84 12.59L12.37 10.63L10.41 11.16C9.92 11.28 9.43 11 9.3 10.5C9.18 10.05 9.46 9.55 9.94 9.43L11.9 8.91L10.46 7.46C10.11 7.12 10.11 6.55 10.46 6.19C10.81 5.84 11.39 5.84 11.73 6.19L13.19 7.63L13.7 5.67C13.82 5.18 14.32 4.9 14.79 5.03C15.28 5.16 15.56 5.65 15.43 6.13L14.9 8.1L16.87 7.57C17.35 7.44 17.84 7.72 17.97 8.21C18.1 8.68 17.82 9.18 17.33 9.3Z"
          />
        </svg>
        Nå er det din tur til å bruke hodet! En høy treffprosent i Artsorakelet
        garanterer ikke at resultatet er riktig. Artsorakelet prøver å matche
        bildene dine med bilder det har sett før, men mange arter har det sett
        få, dårlige eller ingen bilder av! Husdyr, hageplanter og mennesker har
        det ikke blitt trent med i det hele tatt, og heller ikke bilder som er
        unntatt offentlighet, som bilder av store rovdyr.
      </p>

      <p>
        Trykker du på et resultat kan du lese mer om det, klikke videre og se
        mer om arten på Artsdatabankens nettside. Vi anbefaler deg å være litt
        detektiv i denne delen av prosessen. Let opp informasjon om de
        foreslåtte artene eller diskuter resultatet med andre som har kunnskap.
        Er du sikker på at du har et riktig resultat kan du rapportere funnet i
        Artsobservasjoner.no. Vennligst ikke rapporter funn kun basert på
        Artsorakelets svar.
      </p>
      <p>
        <span className="intro">Noen tips:</span>
        <ul>
          <li>
            Det er helt ok å teste appen med en selfie, et kjæledyr, eller noe
            eksotisk. Det er både gøy og en god måte å få erfaring med appen på.
            Husk bare at svaret ikke kommer til å stemme: appen kan kun kjenne
            igjen ville norske arter.
          </li>
          <li>
            Husk også at appen kun har blitt trent med bilder som er åpent
            tilgjengelige. Den har for eksempel aldri sett en ulv fordi
            observasjoner av ulv er unntatt offentlighet. Den foreslår derfor
            aldri ulv som en mulighet.
          </li>
          <li>
            Noen arter, for eksempel fisk, rapporteres relativt lite. Der er
            ikke Artsorakelet like flink. Hvis du rapporterer bilder på
            Artsobservasjoner.no er med til å gjøre neste versjonen bedre.
          </li>
          <li>
            Er gjenkjenningen usikker? Det kan hjelpe å legge til flere bilder
            av samme eksemplar, fra forskjellige deler eller vinkler.
          </li>
          <li>
            Høy treffprosent er ikke det samme som høy sikkerhet, og svar med
            høy score kan være feil. Sammenlign med bilder, bøker, eller spør
            noen som kan hjelpe deg.
          </li>
          <li>
            Aldri ta svaret for gitt i viktige situasjoner. Ikke bruk
            Artsorakelet til å vurdere om noe er giftig eller ikke, for
            eksempel.
          </li>
        </ul>
      </p>
    </div>
  );
}

export default ExtendedManual;
