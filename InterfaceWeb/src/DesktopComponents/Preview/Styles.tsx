import { makeStyles } from "@material-ui/core/styles";
import { colors } from "../../Utils/colors";

const useStyles = makeStyles((theme) => ({
  addInfos: {
    textAlign: "center",
  },
  normalText: {
    fontWeight: "bold",
    padding: "2%",
  },
  headings: {
    fontWeight: "bold",
    margin: 0,
  },
  title: {
    display: "block",
    fontSize: "1.5em",
    margin: "0.83em 0",
    fontWeight: "bold",
  },
  rowNotColored: {
    backgroundColor: colors.rowNotColored,
    padding: "10px",
  },
  rowColored: {
    backgroundColor: colors.rowColored,
    padding: "10px",
  },
  circularProgress: {
    color: colors.graySentiersEstrieHover,
    padding: "5px",
  },
  accordionElement: {
    width: "100%",
    border: "2px solid " + colors.accordion,
    borderRadius: "5px",
    marginBottom: "5px",
  },
  contentAligner: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  preview: {
    margin: "0 8%",
  },
  accordionDoubleElement: {
    width: "100%",
    borderRadius: "5px",
  },
  root: {
    backgroundColor: colors.accordion,
    color: "white",
  },
  expandIcon: {
    color: "white",
  },
}));

export { useStyles };
