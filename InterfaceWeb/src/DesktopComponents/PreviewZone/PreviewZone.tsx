import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect, useState } from "react";
import { CompleteModel } from "../../models/completemodel";
import { Queries } from "../../models/queries";
import { UserMap } from "../../models/usermapmodel";
import { useStyles } from "../Preview/Styles";
import PreviewMap from "../PreviewMap/PreviewMap";

type MyPreviewZoneProps = {
  model: CompleteModel;
  zoneId: string;
};

/**
 * Méthode qui fait l'affichage des informations d'une zone dans la section de prévisualisation
 * @param MyPreviewZoneProps Propriétés servant à l'indentification de la zone qu'on veut prévisualiser
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function PreviewZone({
  model,
  zoneId,
}: MyPreviewZoneProps): JSX.Element {
  const [premiseZoneId, setZoneId] = useState<string>("");
  const [maps, setMaps] = useState<Map<string, UserMap>>(
    new Map<string, UserMap>()
  );
  const classes = useStyles();

  // eslint-disable-next-line
  useEffect(() => {
    const zone = Queries.getZoneFromObjectModel(model, zoneId);
    setZoneId(zone._id);
    setMaps(zone.maps);
  });

  function convertArrayOfMaps(): UserMap[] {
    const arrayOfMaps: UserMap[] = [];
    maps.forEach((map) => arrayOfMaps.push(map));
    return arrayOfMaps;
  }

  return (
    <div className={classes.accordionElement}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
          aria-controls="panel1a-content"
          id={premiseZoneId}
          className={classes.root}
        >
          <p className={classes.headings}> Zone : {premiseZoneId} </p>
        </AccordionSummary>
        {maps.size === 0 ? (
          <p className={classes.normalText}>
            Vous avez créé une zone sans lui associer de carte(s)
          </p>
        ) : (
          <AccordionDetails>
            <div className={classes.contentAligner}>
              {/* Pour chaque cartes de la zone */}
              {convertArrayOfMaps().map((map: UserMap) => (
                // Afficher la carte
                <PreviewMap
                  key={map.name}
                  model={model}
                  zoneId={premiseZoneId}
                  mapId={map.name}
                />
              ))}
            </div>
          </AccordionDetails>
        )}
      </Accordion>
    </div>
  );
}
