import React from "react";
import "../App.css";

function About() {
  return (
      <div className="scrollable scrollbarless">
      <p>
        Artsdatabankens Artsorakel prøver å artsbestemme bilder ved hjelp av
        maskinlæring.
      </p>

      <p>
        Vi trener denne modellen hos Naturalis Biodiversity Center i Nederland,
        med bilder som er offentlig tilgjengelig på artsobservasjoner.no. Når
        appen brukes sier modellen hva det ligner mest på av artene den har
        blitt trent med. Dette innebærer at den kun kan foreslå arter som finnes
        i Norsk natur og som ikke er unntatt offentlighet (som store rovdyr).
        Den kjenner altså kun viltlevende arter (ingen husdyr, hageplanter,
        osv.) og gir svar på artsnivå (og noen underarter).
      </p>

      <p>
        Når appen brukes blir bildene sendt til serveren til gjenkjenning. Dette
        skjer anonymt, og bildene blir ikke tilgjengelige for Artsdatabanken eller
        andre.
      </p>

      {window.cordova && (
        <p>
          Artsorakelet er også tilgjengelig som nettversjon for pc og mobil på{" "}
          <a href="https://orakel.artsdatabanken.no">
            orakel.artsdatabanken.no
          </a>
          .
        </p>
      )}

      {!window.cordova && (
        <p>Artsorakelet er også tilgjengelig som Android og iOS app.</p>
      )}

      <p>
        Du kan lese mer om Artsorakelet på{" "}
        <a href="https://www.artsdatabanken.no/Pages/299643">
          Artsdatabankens nettsider
        </a>
        . Spørsmål og tilbakemelding kan sendes til{" "}
        <a href="mailto:support@artsobservasjoner.no">
          support@artsobservasjoner.no
        </a>
        .
      </p>

      <p>
        <img
          src="Artsdatabanken_high.svg"
          alt="Artsdatabanken"
          className="aboutLogo"
        />
        <img src="Naturalis.svg" className="aboutLogo" alt="Naturalis" />
      </p>
    </div>
  );
}

export default About;
