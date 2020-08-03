import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { red, grey } from "@material-ui/core/colors";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    btn: {
      color: "white",
    },
    input: {
      background: "white",
    },
    inputBase: {
      marginLeft: theme.spacing(3),
      width: "calc(90% - 50px)",
      minHeight: "50px",
    },
    paper: {
      width: "100%",
      marginTop: "1rem",
    },
    dangerBtn: {
      color: "white !important",
      backgroundColor: red[900] + ` !important`,
      right: "4% !important",
      minWidth: "36px !important",
    },
    textLg: {
      fontSize: "20px",
    },
    flexPaper: {
      display: "flex",
      alignItems: "center",
      marginTop: "1rem",
    },
    filterCheck: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      height: "4rem",
      margin: "0.5rem 0",
      padding: "0 1rem",
      backgroundColor: "white",
    },
    likeBtn: {
      backgroundColor: red[800],
      color: "white",
      margin: "0.5rem 0",
      display: "inline-block",
    },
    deleteBtn: {
      margin: "1rem auto",
      backgroundColor: red[900] + ` !important`,
      color: `white !important`,
      display: "inline-block",
    },
    btnPrimary: {
      display: "block",
      height: "3rem",
      width: "100%",
      fontSize: "18px !important",
    },
    editBtn: {
      cursor: "pointer",
    },
    backBtn: {
      backgroundColor: red[800],
      color: "white",
    },
    editInput: {
      minWidth: "230px",
      width: "100%",
    },
  })
);
