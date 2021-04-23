/*
Comprend les différentes valeurs que peuvent avoir un point d'intérêt en fonction
*/
import { InterestType } from "../types";

export enum CATEGORY_COLORS {
  nature = "green",
  service = "blue",
  other = "grey",
  unknown = "orange",
}

export function getPOIInfosByType(
  type: InterestType
): { icon: string; color: string } {
  const infos = { icon: "", color: "" };
  switch (type) {
    case InterestType.service:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "H";
      break;
    case InterestType.summit:
      infos.color = CATEGORY_COLORS.nature;
      infos.icon = "S";
      break;
    case InterestType.view:
      infos.color = CATEGORY_COLORS.nature;
      infos.icon = "V";
      break;
    case InterestType.nature:
      infos.color = CATEGORY_COLORS.nature;
      infos.icon = "N";
      break;
    case InterestType.parking:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "P";
      break;
    case InterestType.restroom:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "P";
      break;
    case InterestType.camping:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "C";
      break;
    case InterestType.telephone:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "T";
      break;
    case InterestType.picnic:
      infos.color = CATEGORY_COLORS.nature;
      infos.icon = "I";
      break;
    case InterestType.refuge:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "R";
      break;
    case InterestType.hosting:
      infos.color = CATEGORY_COLORS.service;
      infos.icon = "H";
      break;
    default:
      infos.color = CATEGORY_COLORS.unknown;
      infos.icon = "U";
  }
  return infos;
}
