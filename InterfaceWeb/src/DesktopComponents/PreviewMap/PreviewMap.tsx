import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useEffect, useState } from "react";
import { CompleteModel } from "../../models/completemodel";
import { InterestPoint } from "../../models/interestpointsmodel";
import { Queries } from "../../models/queries";
import { Trail } from "../../models/trailmodel";
import { useStyles } from "../Preview/Styles";
import PreviewInterestPoint from "../PreviewInterestPoint/PreviewInterestPoint";
import PreviewTrail from "../PreviewTrail/PreviewTrail";

type MyPreviewMapProps = {
  model: CompleteModel;
  zoneId: string;
  mapId: string;
};
/**
 * Méthode qui fait l'affichage des informations d'une carte dans la section de prévisualisation
 * @param MyPreviewMapProps Propriétés servant à l'indentification de la carte qu'on veut prévisualiser
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function PreviewMap({
  model,
  zoneId,
  mapId,
}: MyPreviewMapProps): JSX.Element {
  const [premiseMapId, setMapId] = useState<string>("");
  const [trails, setTrails] = useState<Map<string, Trail>>(
    new Map<string, Trail>()
  );
  const [interestPoints, setIterestPoints] = useState<
    Map<string, InterestPoint>
  >(new Map<string, InterestPoint>());
  const classes = useStyles();

  // eslint-disable-next-line
  useEffect(() => {
    const completeModel = Queries.getUserMapFromObjectModel(
      model,
      zoneId,
      mapId
    );
    setMapId(completeModel.name);
    setTrails(completeModel.trails);
    setIterestPoints(completeModel.pointsOfInterest);
  });

  function convertArrayOfTrails(): Trail[] {
    const arrayOfTrails: Trail[] = [];
    trails.forEach((trail) => arrayOfTrails.push(trail));
    return arrayOfTrails;
  }

  function convertArrayOfPoi(): InterestPoint[] {
    const arrayOfPoi: InterestPoint[] = [];
    interestPoints.forEach((poi) => arrayOfPoi.push(poi));
    return arrayOfPoi;
  }

  return (
    <div className={classes.accordionElement}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
          aria-controls="panel1a-content"
          id={premiseMapId}
          className={classes.root}
        >
          <p className={classes.headings}> Carte : {premiseMapId} </p>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.accordionDoubleElement}>
            <div className={classes.accordionElement}>
              <div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className={classes.expandIcon} />
                    }
                    aria-controls="panel1a-content"
                    className={classes.root}
                  >
                    <p className={classes.headings}> Sentiers </p>
                  </AccordionSummary>
                  {trails.size === 0 ? (
                    <p className={classes.normalText}>
                      Vous avez créé une carte sans lui associer de sentier(s)
                    </p>
                  ) : (
                    <AccordionDetails>
                      <div className={classes.contentAligner}>
                        {/* Pour chaque sentiers de la carte */}
                        {convertArrayOfTrails().map((trail: Trail, index) => (
                          // Afficher le sentier
                          <PreviewTrail
                            key={trail.name}
                            model={model}
                            zoneId={zoneId}
                            mapId={premiseMapId}
                            trailName={trail.name}
                            itemNumber={index}
                          />
                        ))}
                      </div>
                    </AccordionDetails>
                  )}
                </Accordion>
              </div>
            </div>
            <div className={classes.accordionElement}>
              <div>
                <Accordion>
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className={classes.expandIcon} />
                    }
                    aria-controls="panel1a-content"
                    className={classes.root}
                  >
                    <p className={classes.headings}> Points d'intérêt </p>
                  </AccordionSummary>
                  {interestPoints.size === 0 ? (
                    <p className={classes.normalText}>
                      Vous avez créé une carte sans lui associer de point(s)
                      d'intérêt
                    </p>
                  ) : (
                    <AccordionDetails>
                      <div className={classes.contentAligner}>
                        {/* Pour chaque points d'intérêt de la carte */}
                        {convertArrayOfPoi().map(
                          (interestPoint: InterestPoint, index) => (
                            // Afficher le point d'intérêt
                            <PreviewInterestPoint
                              key={interestPoint.name}
                              model={model}
                              zoneId={zoneId}
                              mapId={premiseMapId}
                              interestPointName={interestPoint.name}
                              itemNumber={index}
                            />
                          )
                        )}
                      </div>
                    </AccordionDetails>
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
