import React from "react";
import "../App.css";

function ExtendedManual() {
  return (
    <div className="scrollable scrollbarless">
      <p className="weight400">
        Artsdatabankens Artsorakel prøver å artsbestemme bilder ved hjelp av
        maskinlæring. Artsorakelet kjenner kun viltlevende arter (ingen husdyr,
        hageplanter, osv.) og gir svar på artsnivå (og noen underarter).
      </p>

      <p>
        Noen tips:
        <ul>
          <li>
            Det er helt ok å teste appen med en selfie, et kjæledyr, eller noe
            eksotisk. Det er både gøy og en god måte å få erfaring med appen på.
            Husk bare at svaret ikke kommer til å stemme: appen kan kun ville
            norske arter.
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
            artsobservasjoner.no er med til å gjøre neste versjonen bedre.
          </li>
          <li>
            Er gjenkjenningen usikker? Det kan hjelpe å legge til flere bilder
            av samme individet, fra forskjellige deler eller vinkler.
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

      <p>
        For å kjenne igjen en art tar du et bilde ved å trykke på kamera
        knappen, eller velger et bilde du har lagret tidligere. Når et bilde
        blir lagt til åpnes det en redigeringsskjerm der du kan zoome inn til
        arten og rotere om nødvendig. Når et bilde er lagt til kan du legge til
        flere bilder, det kan hjelpe gjenkjenningen å ha flere bilder av samme
        individed, fra forskjellige vinkler eller av ulike deler av individet.
        Du kan trykke på bilder som allerede er lagt til for å redigere de på
        nytt eller fjerne de.
      </p>

      <p>
        Når bildet eller bildene er klare til gjenkjenning trykker du på
        "Identifiser". Bildene sendes da til serveren som sender tilbake et svar
        i løpet av kort tid (1 sekund, i snitt). Resultatene vises med
        treffprosent for hver art. Merk at også en høy treffprosent ikke betyr
        at resultatet er riktig. Artsorakelet prøver å matche bildene dine med
        bilder den har sett før, men det er mange arter den har kun sett få
        eller ingen bilder av. Husdyr, hageplanter, mennesker har den ikke blitt
        trent med, og heller ikke bilder som er unntatt offentlighet, som bilder
        av store rovdyr.
      </p>

      <p>
        Ved å trykke på et resultat kan du lese mer om det resultatet, klikke
        videre til å lese mer om arten på Artsdatabankens nettside, eller
        rapportere funnet i Artsobservasjoner.no. Vennligst rapporter kun det du
        vet er riktig, ikke kun basert på Artsorakelets svar.
      </p>
    </div>
  );
}

export default ExtendedManual;
