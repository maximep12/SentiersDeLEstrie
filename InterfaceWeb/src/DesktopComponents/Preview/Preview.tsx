import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect, useState } from "react";
import { CompleteModel } from "../../models/completemodel";
import PreviewZone from "../PreviewZone/PreviewZone";
import { Zone } from "./../../models/zonemodel";
import { useStyles } from "./Styles";

type MyProp = {
  m: CompleteModel;
};

/**
 * Méthode qui fait l'affichage de la section pour prévisualiser le contenu qu'on s'apprete à utiliser pour mettre à jour l'app mobile.
 * @param MyProp Le model représentant le contenu qu'on veut prévisualiser.
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function Preview({ m }: MyProp): JSX.Element {
  const [model, setModel] = useState<CompleteModel>(new CompleteModel());
  const [zones, setZones] = useState<Map<string, Zone>>(
    new Map<string, Zone>()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classes = useStyles();

  useEffect(() => {
    setIsLoading(true);
    setModel(m);
    setZones(m.zones);
    setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  function convertArrayOfZones(): Zone[] {
    const arrayOfzones: Zone[] = [];
    zones.forEach((zone) => arrayOfzones.push(zone));
    return arrayOfzones;
  }

  return (
    <div className={classes.preview}>
      <p className={classes.title}> Aperçu des données </p>
      <div className={classes.accordionElement}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
            aria-controls="panel1a-content"
            id="accordionSummary"
            className={classes.root}
          >
            <p className={classes.headings}> Zones </p>
          </AccordionSummary>
          {isLoading ? (
            <CircularProgress className={classes.circularProgress} />
          ) : zones.size === 0 ? (
            <p> Vous n'avez pas de zones </p>
          ) : (
            <AccordionDetails>
              <div className={classes.contentAligner}>
                {
                  // boucle for each sur les zones dans l'objet
                  convertArrayOfZones().map((zone: Zone) => (
                    // afficher la zone
                    <PreviewZone
                      key={zone._id}
                      model={model}
                      zoneId={zone._id}
                    />
                  ))
                }
              </div>
            </AccordionDetails>
          )}
        </Accordion>
      </div>
    </div>
  );
}
