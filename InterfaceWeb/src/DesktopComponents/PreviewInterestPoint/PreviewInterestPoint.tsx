import { useEffect, useState } from "react";
import { CompleteModel } from "../../models/completemodel";
import { InterestPoint } from "../../models/interestpointsmodel";
import { Queries } from "../../models/queries";
import { useStyles } from "../Preview/Styles";

type MyPreviewInterestPointProps = {
  model: CompleteModel;
  zoneId: string;
  mapId: string;
  interestPointName: string;
  itemNumber: number;
};

/**
 * Méthode qui fait l'affichage des informations d'un point d'intérêt dans la section de prévisualisation
 * @param MyPreviewInterestPointProps Propriétés servant à l'indentification du point d'intérêt qu'on veut prévisualiser
 * @returns {JSX.Element} Elements JSX, qui permet l'affichage de la section
 */
export default function PreviewInterestPoint({
  model,
  zoneId,
  mapId,
  interestPointName,
  itemNumber,
}: MyPreviewInterestPointProps): JSX.Element {
  const [premiseInterestPoint, setInterestPoint] = useState<InterestPoint>();
  const classes = useStyles();

  // eslint-disable-next-line
  useEffect(() => {
    const poi = Queries.getInterestPointsFromObjectModel(
      model,
      zoneId,
      mapId,
      interestPointName
    );
    setInterestPoint(poi);
  });

  return (
    <div
      className={
        itemNumber % 2 !== 0 ? classes.rowColored : classes.rowNotColored
      }
    >
      <div className="poiName">
        <b>{premiseInterestPoint?.name} </b>
      </div>
      <div className="poiCode">
        <u>Code</u> : {premiseInterestPoint?.code}
      </div>
      <div className="poiType">
        <u>Type</u> : {premiseInterestPoint?.type}
      </div>
      <div className="poiType">
        <u>Description</u> : {premiseInterestPoint?.description}
      </div>
      <div className="poiActive">
        <u> actif </u> :{" "}
        {premiseInterestPoint?.active?.toString() === "true" ? "Vrai" : "Faux"}
      </div>
      <div className="poiCoordinate">
        <div>
          <u>Longitude</u> : {premiseInterestPoint?.coordinate.longitude}{" "}
        </div>
        <div>
          <u>Latitude</u> :{premiseInterestPoint?.coordinate.latitude}
        </div>
      </div>
    </div>
  );
}
