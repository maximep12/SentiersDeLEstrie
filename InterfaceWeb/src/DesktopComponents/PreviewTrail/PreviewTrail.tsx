import { useEffect, useState } from "react";
import { CompleteModel } from "../../models/completemodel";
import { Queries } from "../../models/queries";
import { Trail } from "../../models/trailmodel";
import { useStyles } from "../Preview/Styles";

type MyPreviewTrailProps = {
  model: CompleteModel;
  zoneId: string;
  mapId: string;
  trailName: string;
  itemNumber: number;
};

/**
 * Méthode qui fait l'affichage des informations d'un sentier dans la section de prévisualisation
 * @param MyPreviewTrailProps Propriétés servant à l'indentification du sentier qu'on veut prévisualiser
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function PreviewTrail({
  model,
  zoneId,
  mapId,
  trailName,
  itemNumber,
}: MyPreviewTrailProps): JSX.Element {
  const [premiseTrail, setTrail] = useState<Trail>();
  const classes = useStyles();

  // eslint-disable-next-line
  useEffect(() => {
    const trail = Queries.getTrailFromObjectModel(
      model,
      zoneId,
      mapId,
      trailName
    );
    setTrail(trail);
  });

  return (
    <div
      className={
        itemNumber % 2 !== 0 ? classes.rowColored : classes.rowNotColored
      }
    >
      <div className="trailName">
        <b> {premiseTrail?.name} </b>
      </div>
      <div className={classes.addInfos}>
        <div className="trailDifficulty">
          <u>Difficulté</u> : {premiseTrail?.difficulty}
        </div>
        <div className="trailDescription">
          <u>Description</u> : {premiseTrail?.description}
        </div>
        <div className="trailColor">
          <u>Couleur</u> : {premiseTrail?.color}
        </div>
        <div className="trailActive">
          <u> actif </u> :{" "}
          {premiseTrail?.active?.toString() === "true" ? "Vrai" : "Faux"}
        </div>
      </div>
    </div>
  );
}
