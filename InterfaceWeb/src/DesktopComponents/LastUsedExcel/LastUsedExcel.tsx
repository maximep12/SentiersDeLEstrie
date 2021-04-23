import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import {
  ErrorMessages,
  SendingState,
} from "../../DesktopControllers/UpdateAppMap";
import {
  downloadFile,
  getLastUpdatedDate,
} from "../../DesktopViews/DownloadLastFile";
import { colors } from "../../Utils/colors";
import SentiersButton, { MyButtonTypes } from "../Button/SentiersButton";
import "./Styles.css";
/**
 * Méthode qui fait l'affichage de la section qui permet le téléchargement du dernier excel ayant servi à mettre à jour l'application mobile
 *
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function LastUsedExcel(): JSX.Element {
  const [lastUpdadedDate, setLastUpdadedDate] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<{
    message: ErrorMessages;
    sendingState: SendingState;
  }>({
    message: ErrorMessages.none,
    sendingState: SendingState.UNKNOWN,
  });

  // Mettre à jour la date qui indique la dernière mise à jour de l'app mobile
  useEffect(() => {
    (async () => {
      setLastUpdadedDate(await getLastUpdatedDate());
    })();
  }, []);

  return (
    <div
      className="lastUsedExcel"
      style={{ backgroundColor: colors.graySentiersEstrie }}
    >
      <h2> Dernière mise à jour de l'application </h2>
      <p> {lastUpdadedDate} </p>
      <div className="contentSection" style={{ borderColor: colors.redBanner }}>
        <div className="getFileSection">
          <p className="titleLastUsedExcel">
            Cliquez ici pour récuperer la dernière version de Excel qui a mis à
            jour l'application mobile
          </p>
          {/* Bouton permettant de télécharger le dernier fichier excel qui a servi à mettre à jour l'app mobile */}
          <div className="buttonToDownloadFile">
            <SentiersButton
              color={colors.redBanner}
              hover={colors.redBannerHover}
              textColorHover={colors.white}
              type={MyButtonTypes.small}
              text={"Télécharger"}
              textColor={colors.white}
              borderColor={colors.redBannerHover}
              icon={faFileDownload}
              onClick={async () => {
                var isSent = await downloadFile();
                if (!isSent) {
                  setErrorMessage({
                    message: ErrorMessages.failedToDownload,
                    sendingState: SendingState.ERROR,
                  });
                }
              }}
            />
          </div>
          {/* Afficher message d'erreur à l'utilisateur si besoin */}
          {errorMessage.sendingState !== SendingState.UNKNOWN && (
            <div className="errorMessage">
              <Alert
                className="alertLastUsedExcel"
                severity={errorMessage.sendingState}
              >
                {errorMessage.message}
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
