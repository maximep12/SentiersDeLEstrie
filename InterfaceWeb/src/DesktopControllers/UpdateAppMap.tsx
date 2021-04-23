import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import Alert from "@material-ui/lab/Alert";
import React, { useState } from "react";
import SentiersButton, {
  MyButtonTypes,
} from "../DesktopComponents/Button/SentiersButton";
import Preview from "../DesktopComponents/Preview/Preview";
import sendForPreview from "../DesktopViews/PreviewView";
import { sendForUpdate } from "../DesktopViews/UpdateView";
import { CompleteModel } from "../models/completemodel";
import { colors } from "../Utils/colors";
import "./Styles.css";

export enum SendingState {
  ERROR = "error",
  SUCCESS = "success",
  UNKNOWN = "unsend",
  WARNING = "warning",
}

export enum ErrorMessages {
  failedToSend = " Une erreur est survenue lors de la mise à jour du contenu de l'application. ",
  none = "",
  succeedToSend = " L'application a été mise à jour! ",
  notAnExcel = " Vous n'avez pas selectionné un fichier .xlsx! ",
  failedToParse = " Veuillez entrer un excel adapté à l'application. ",
  missingFile = "Veuillez sélectionner un fichier. ",
  failedToDownload = " Une erreur est survenue lors du téléchargement du fichier. ",
  succeedToDownload = " Le fichier a été téléchargé! ",
}

type Props = {
  visibilityToggle: (isVisible: boolean) => void;
};

/**
 * Méthode qui fait l'affichage de la section pour mettre à jour l'application ainsi que le preview
 * @param Props Propriétés servant à indiqué si on veut afficher la section
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function UpdateAppMap({ visibilityToggle }: Props): JSX.Element {
  const [receivedFile, setFile] = useState<File>();
  const [displayPreview, setDisplayPreview] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [aFileWasAdded, setAFileWasAdded] = useState<boolean>(false);
  const [modelRecieved, setModel] = useState<CompleteModel>(
    new CompleteModel()
  );

  const [errorMessage, setErrorMessage] = useState<{
    message: ErrorMessages;
    sendingState: SendingState;
  }>({
    message: ErrorMessages.none,
    sendingState: SendingState.UNKNOWN,
  });

  function resetInput(event: any) {
    event.target.value = "";
  }

  // vérifier que l'utilisateur a bien selectioné un fichier excel
  function HandleFileInput(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.item(0);
    setDisplayPreview(false);
    visibilityToggle(true);
    setErrorMessage({
      message: ErrorMessages.none,
      sendingState: SendingState.UNKNOWN,
    });
    if (file !== undefined) {
      if (file!.name.split(".").pop() === "xlsx") {
        setAFileWasAdded(true);
        setFile(file!);
        setFileName(file!.name);
      } else {
        // Erreur de fichier, ce n'est pas un Excel
        setErrorMessage({
          message: ErrorMessages.notAnExcel,
          sendingState: SendingState.ERROR,
        });
      }
    } else {
      // Erreur de fichier, ce n'est pas un Excel
      setErrorMessage({
        message: ErrorMessages.missingFile,
        sendingState: SendingState.ERROR,
      });
    }
  }

  async function sendForPreviewOnClick(file: File) {
    var response = await sendForPreview(file!);
    var isSent = await response.isSent;
    setModel(await response.model);
    setDisplayPreview(isSent);
    // on affiche la section permettant de télécharger le dernier Excel seulement si la section de preview n'est pas affichée
    visibilityToggle(!isSent);
    if (!isSent) {
      setErrorMessage({
        message: ErrorMessages.failedToParse,
        sendingState: SendingState.ERROR,
      });
    }
  }

  async function cancelUpdateOnClick() {
    setErrorMessage({
      message: ErrorMessages.none,
      sendingState: SendingState.UNKNOWN,
    });
    setDisplayPreview(false);
    // on affiche la section permettant de télécharger le dernier Excel maintenant qu'on ne voit plus la section de preview
    visibilityToggle(true);
    setFileName("");
    setFile(undefined);
    setAFileWasAdded(false);
  }

  async function sendForUpdateOnClick(file: File, model: CompleteModel) {
    const statusSend: boolean = await sendForUpdate(file!, model);
    if (statusSend) {
      setErrorMessage({
        message: ErrorMessages.succeedToSend,
        sendingState: SendingState.SUCCESS,
      });
      setFileName("");
      setFile(undefined);
      setDisplayPreview(false);
      // on affiche la section permettant de télécharger le dernier Excel car la section de preview ne sera plus affichée
      visibilityToggle(true);
      setAFileWasAdded(false);
    } else {
      setErrorMessage({
        message: ErrorMessages.failedToSend,
        sendingState: SendingState.ERROR,
      });
    }
  }

  return (
    <div className="updateAppMap">
      <h2>Mettre à jour l'application mobile</h2>
      <div className="form">
        <div className="infoForPreview">
          <div className="fileInputSection">
            <p style={{ marginTop: "0px" }}>
              Veuillez sélectionner un fichier Excel
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="importFileButton">
                <input
                  type="file"
                  id="selectedFile"
                  style={{ display: "none" }}
                  accept=".xlsx"
                  required
                  onClick={resetInput}
                  onChange={HandleFileInput}
                />
                <SentiersButton
                  type={MyButtonTypes.small}
                  color={colors.graySentiersEstrie}
                  hover={colors.graySentiersEstrieHover}
                  text={"Importer un fichier"}
                  textColor={colors.black}
                  textColorHover={colors.white}
                  borderColor={colors.graySentiersEstrie}
                  icon={faFileImport}
                  onClick={() => {
                    var doc = document.getElementById("selectedFile");
                    if (doc) {
                      doc.click();
                    }
                  }}
                />
                {receivedFile?.name ? (
                  <p
                    style={{
                      fontSize: 11,
                      fontStyle: "italic",
                      marginLeft: "1em",
                    }}
                  >
                    {fileName}
                  </p>
                ) : null}
              </div>
            </div>
            {errorMessage.sendingState !== SendingState.UNKNOWN ? (
              <div>
                <Alert
                  severity={errorMessage.sendingState}
                  style={{ marginTop: "10px" }}
                >
                  {errorMessage.message}
                </Alert>
              </div>
            ) : null}
          </div>
          {/*afficher le bouton de previsualistion si un nouveau fichier de type excel est entré et qu'il n'y a pas d'erreur */}
          {aFileWasAdded &&
          !displayPreview &&
          errorMessage.sendingState !== SendingState.ERROR ? (
            <div className="previewSection">
              <p>
                Afin de mettre à jour l’application, assurez-vous de
                prévisualiser le contenu et le confirmer
              </p>
              <div className="previewButton">
                <SentiersButton
                  color={colors.redBanner}
                  hover={colors.redBannerHover}
                  textColorHover={colors.white}
                  type={MyButtonTypes.large}
                  text={"Prévisualiser"}
                  textColor={colors.white}
                  borderColor={colors.redBannerHover}
                  onClick={async () => {
                    await sendForPreviewOnClick(receivedFile!);
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {displayPreview ? (
        <div className="infoForUpdate">
          <div className="UpdateButtons">
            <div className="cancelButton">
              <SentiersButton
                color={colors.transparent}
                hover={colors.red}
                type={MyButtonTypes.medium}
                text={"Annuler"}
                textColor={colors.red}
                textColorHover={colors.white}
                borderColor={colors.red}
                onClick={async () => {
                  await cancelUpdateOnClick();
                }}
              />
            </div>
            <div className="confirmButton">
              <SentiersButton
                color={colors.confirmationButtonColor}
                hover={colors.confirmationButtonHover}
                type={MyButtonTypes.medium}
                text={"Confirmer"}
                textColor={colors.white}
                textColorHover={colors.white}
                borderColor={colors.confirmationButtonColor}
                onClick={async () => {
                  if (
                    window.confirm(
                      "Êtes-vous sûr de vouloir envoyer ces données dans le système? Une fois envoyées, vous ne pourrez plus annuler cette opération."
                    )
                  ) {
                    await sendForUpdateOnClick(receivedFile!, modelRecieved);
                  }
                }}
              />
            </div>
          </div>
          <Preview key="preview" m={modelRecieved} />
        </div>
      ) : null}
    </div>
  );
}
