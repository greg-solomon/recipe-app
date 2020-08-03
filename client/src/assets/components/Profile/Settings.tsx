import React, { useState, useEffect } from "react";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { AuthState } from "../../../redux/reducers/authReducer";
import { Paper, Button, Modal, InputBase, IconButton } from "@material-ui/core";
import useStyles from "../../../lib/hooks/useStyles";
import { Redirect } from "react-router-dom";
import {
  deleteUser,
  updateProfile,
  removeAlert,
  updateColor,
  saveColor,
} from "../../../redux/actions";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";
import { green, red, grey } from "@material-ui/core/colors";
import { AlertState } from "../../../redux/reducers/alertReducer";
import { Alert, colors } from "../Utilities/";
import Colors from "../Auth/Colors";
interface IProps {
  auth: AuthState;
  alert: AlertState;
  deleteUser: Function;
  updateProfile: Function;
  removeAlert: Function;
  updateColor: Function;
  saveColor: Function;
}

const Settings = ({
  auth,
  deleteUser,
  updateProfile,
  updateColor,
  saveColor,
  alert,
  removeAlert,
}: IProps) => {
  const [confAccountDelete, setConfAccountDelete] = useState<boolean>(false);
  const [isEditingName, setEditingName] = useState<boolean>(false);
  const [isEditingColor, setEditingColor] = useState<boolean>(false);
  const [originalColor] = useState(auth.user.color || colors[0]);
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(
    auth.user.color || colors[0]
  );
  const classes = useStyles(auth.user !== null ? auth.user.color : grey[900]);

  useEffect(() => {
    updateColor(selectedColor);
    return () => removeAlert();
  }, [removeAlert, selectedColor, updateColor]);

  if (!auth.isAuth || !auth) return <Redirect to="/login" />;

  const { displayName, metadata, email } = auth.user;

  const handleUpdate = () => {
    updateProfile(newDisplayName, auth.user.session);
    setEditingName(false);
  };

  const handleSaveColor = () => {
    const { session, uid } = auth.user;
    saveColor(uid, session, selectedColor);
  };
  const handleColorClose = () => {
    updateColor(originalColor);
    setEditingColor(false);
  };
  return (
    <>
      <div className="setting-wrapper">
        {alert.showMessage && <Alert />}
        <Paper
          variant="outlined"
          className={classes.paper}
          style={{ flexDirection: "column", padding: "24px" }}
        >
          <h1
            style={{
              color: auth.user.color,
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Settings
          </h1>
          <div className="setting-item">
            <div className="setting-label">
              <p>Display Name</p>
            </div>
            {isEditingName ? (
              <div className="setting-value">
                <Paper variant="outlined" className={classes.editInput}>
                  <InputBase
                    type="text"
                    name="Display Name"
                    placeholder={"New Display Name"}
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className={classes.inputBase}
                  />
                </Paper>
                <IconButton onClick={handleUpdate}>
                  <MdSave color={green[500]} />
                </IconButton>
                <IconButton onClick={() => setEditingName(false)}>
                  <MdCancel color={red[800]} />
                </IconButton>
              </div>
            ) : (
              <>
                <div className="setting-value">
                  <p className="display-name">{displayName}</p>
                  <Button
                    onClick={() => setEditingName(true)}
                    className="edit-btn"
                  >
                    <MdEdit fontSize="18px" color={auth.user.color} />
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <p>Color</p>
            </div>
            {isEditingColor ? (
              <div className="setting-value">
                <Colors
                  selected={selectedColor}
                  setSelected={setSelectedColor}
                />
                <div>
                  <IconButton onClick={() => handleSaveColor()}>
                    <MdSave color={green[500]} />
                  </IconButton>
                  <IconButton onClick={() => handleColorClose()}>
                    <MdCancel color={red[800]} />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="setting-value">
                <div
                  style={{
                    height: 32,
                    width: 32,
                    backgroundColor: auth.user.color,
                    boxShadow: "2px 2px 2px rgba(0,0,0,0.3)",
                  }}
                  className="color-pick-preview"
                />
                <Button
                  onClick={() => setEditingColor(true)}
                  className="edit-btn"
                >
                  <MdEdit fontSize="18px" color={auth.user.color} />
                </Button>
              </div>
            )}
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <p>Email</p>
            </div>
            <div className="setting-value">
              <p>{email}</p>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <p>Member Since</p>
            </div>
            <div className="setting-value">
              <p style={{ textAlign: "center" }}>
                {metadata.creationTime.split(" ").slice(1, 4).join(" ")}
              </p>
            </div>
          </div>
          <div className="flex-center">
            <Button
              type="button"
              variant="text"
              className={classes.deleteBtn}
              disableRipple={true}
              onClick={() => setConfAccountDelete(true)}
            >
              Delete Account
            </Button>
          </div>
          <Modal
            open={confAccountDelete}
            onClose={() => setConfAccountDelete(false)}
          >
            <Paper variant="outlined" className="modal-body">
              <h2>Delete Account?</h2>
              <p style={{ margin: "1.75rem auto" }}>
                Are you sure you want to do this?
              </p>
              <Button
                type="button"
                className={classes.deleteBtn}
                onClick={() => deleteUser()}
              >
                Delete Account
              </Button>
            </Paper>
          </Modal>
        </Paper>
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  deleteUser,
  updateProfile,
  removeAlert,
  updateColor,
  saveColor,
})(Settings);
