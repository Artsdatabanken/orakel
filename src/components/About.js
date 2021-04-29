import React from "react";
import "../App.css";

function About() {
  return (
    <div className="scrollable scrollbarless">
      <img
        src="Artsdatabanken_long_light.svg"
        alt="Artsdatabanken"
        className="aboutHeader light"
      />

      <img
        src="Artsdatabanken_long_dark.svg"
        alt="Artsdatabanken"
        className="aboutHeader dark"
      />

      <hr />

      <p className="weight400">
        Artsorakelet er utviklet av Artsdatabanken i samarbeid med Naturalis
        Biodiversity Center. Appen prøver å artsbestemme bilder ved hjelp av
        maskinlæring.
      </p>

      <img
        src="Artsorakel_logo_trans.svg"
        alt="Artsorakelet"
        className="aboutHeader"
      />

      <p>
        Gjenkjenningsmodellen trenes hos Naturalis Biodiversity Center, med
        bilder som er offentlig tilgjengelig på artsobservasjoner.no. Når appen
        brukes sier modellen hva det ligner mest på av artene den har blitt
        trent med. Dette innebærer at den kun kan foreslå arter som finnes i
        Norsk natur hvor bildene ikke er unntatt offentlighet (som ved store
        rovdyr). Den kjenner altså kun viltlevende arter (ingen husdyr,
        hageplanter, osv.) og gir svar på artsnivå (og noen underarter).
      </p>

      <p>
        Bilder sendes til serveren til gjenkjenning. Bilder og brukerinformasjon
        blir ikke tilgjengelige for Artsdatabanken eller andre.
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
        <p>
          Artsorakelet er også tilgjengelig som Android og iOS app, se lenkene i
          hovedmenyen.
        </p>
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
          src="Artsdatabanken_high_light.svg"
          alt="Artsdatabanken"
          className="aboutLogo light"
        />
        <img
          src="Artsdatabanken_high_dark.svg"
          alt="Artsdatabanken"
          className="aboutLogo dark"
        />
        <img src="Naturalis.svg" className="aboutLogo" alt="Naturalis" />
      </p>
    </div>
  );
}

export default About;
