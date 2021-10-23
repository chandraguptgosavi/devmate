import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faCode,
  faGraduationCap,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Paper, Grow } from "@mui/material";
import { Chip, IconButton } from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  currentProfileConnectionStatusUpdatedAsync,
  selectCurrentProfileConnectionStatus,
} from "./profileSlice";
import { useDispatch } from "react-redux";
import { setDoc, doc, getFirestore, getDoc } from "firebase/firestore";
import {
  selectUser,
  selectUserID,
  userUpdatedAsync,
} from "features/auth/authSlice";
import { useHistory } from "react-router";
import ProfileIcon from "assets/profile-icon.png";
import { useIsComponentMounted } from "app/hooks";

export function Intro({
  editIndex,
  currentUser,
  profileID,
  isEditable,
  setEditIndex,
  setCurrentUser,
}) {
  const currentProfileConnectionStatus = useSelector(
    selectCurrentProfileConnectionStatus
  );
  const userID = useSelector(selectUserID);
  const user = useSelector(selectUser);
  const history = useHistory();
  const dispatch = useDispatch();
  const isComponentMounted = useIsComponentMounted();

  const onConnect = async () => {
    const db = getFirestore();
    if (currentProfileConnectionStatus === "normal") {
      dispatch(currentProfileConnectionStatusUpdatedAsync("request_sending"));
      try {
        const updatedUser = {
          ...user,
          connections: {
            ...user.connections,
            sent: [...user.connections.sent, profileID],
          },
        };
        await setDoc(doc(db, "users", userID), updatedUser);
        if (isComponentMounted.current) {
          dispatch(userUpdatedAsync(updatedUser));
        }
        const currentProfileUpdatedConnections = {
          ...currentUser.connections,
          received: [...currentUser.connections.received, userID],
        };
        await setDoc(doc(db, "users", profileID), {
          ...currentUser,
          connections: currentProfileUpdatedConnections,
        });
        if (isComponentMounted.current) {
          setCurrentUser({
            ...currentUser,
            connections: currentProfileUpdatedConnections,
          });
          dispatch(currentProfileConnectionStatusUpdatedAsync("request_sent"));
        }
      } catch (err) {
        console.log(`error from Intro section: ${err}`);
      }
    } else if (currentProfileConnectionStatus === "request_received") {
      dispatch(currentProfileConnectionStatusUpdatedAsync("connecting"));
      try {
        const updatedUser = {
          ...user,
          connections: {
            ...user.connections,
            received: user.connections.received.filter(
              (id) => id !== profileID
            ),
            connected: [...user.connections.connected, profileID],
          },
        };
        await setDoc(doc(db, "users", userID), updatedUser);
        if (isComponentMounted.current) {
          dispatch(userUpdatedAsync(updatedUser));
        }
        const currentProfileUpdatedConnections = {
          ...currentUser.connections,
          sent: currentUser.connections.sent.filter((id) => id !== userID),
          connected: [...currentUser.connections.connected, userID],
        };
        await setDoc(doc(db, "users", profileID), {
          ...currentUser,
          connections: currentProfileUpdatedConnections,
        });
        const userChatsSnapshot = await getDoc(doc(db, "user_chats", userID));
        await setDoc(doc(db, "user_chats", userID), {
          ...userChatsSnapshot.data(),
          [profileID]: {
            lastMessage: "",
          },
        });
        const profileChatsSnapshot = await getDoc(doc(db, "user_chats", profileID));
        await setDoc(doc(db, "user_chats", profileID), {
          ...profileChatsSnapshot.data(),
          [userID]: {
            lastMessage: "",
          },
        });
        if (isComponentMounted.current) {
          setCurrentUser({
            ...currentUser,
            connections: currentProfileUpdatedConnections,
          });
          dispatch(currentProfileConnectionStatusUpdatedAsync("connected"));
       }
      } catch (err) {
        console.log(`error from Intro section: ${err}`);
      }
    } else if (currentProfileConnectionStatus === "connected") {
      history.push();
    }
  };

  return (
    <div
      className={`${
        editIndex !== -1 ? "opacity-60 pointer-events-none" : ""
      } sm:h-1/4 md:h-26% lg:h-28% xl:h-30% 
              sm:max-h-180px md:max-h-200px lg:max-h-220px xl:max-h-250px
            w-full lg:w-11/12
            -mt-8 md:-mt-10
            flex flex-col sm:flex-row sm:justify-evenly`}
    >
      <div className="relative w-1/5 h-full  self-center sm:self-stretch flex justify-center">
        <Card
          className="w-full md:w-4/5 lg:w-3/4 xl:w-2/3 h-12vh xs:h-1/6vh sm:h-full"
          onClick={() => {
            setEditIndex(0);
          }}
          raised
        >
          <img
            className="object-cover w-full h-full overflow-hidden"
            src={
              currentUser.profilePicture.length > 0
                ? currentUser.profilePicture
                : ProfileIcon
            }
            alt="profile"
          />
        </Card>
      </div>
      <div className="w-4/5 sm:w-3/5 self-center sm:self-end mt-4 sm:mb-4">
        <div className="flex w-full justify-between items-center">
          <p className="text-xl mb-1 font-bold">{currentUser.firstName}</p>
          {isEditable && (
            <IconButton
              size="small"
              onClick={() => {
                setEditIndex(1);
              }}
            >
              <FontAwesomeIcon
                className="text-colorPrimaryDark"
                icon={faPencilAlt}
              />
            </IconButton>
          )}
        </div>
        <p className="text-sm mb-3">{currentUser.headline}</p>
        {!isEditable && (
          <span
            className={`${
              currentProfileConnectionStatus === "request_sending" ||
              currentProfileConnectionStatus === "connecting"
                ? "pointer-events-none bg-colorPrimaryLight text-colorPrimaryDark"
                : "bg-colorPrimary text-white"
            } cursor-pointer mr-2 py-2 px-4 font-medium text-sm rounded-2xl`}
            onClick={onConnect}
          >
            {currentProfileConnectionStatus === "normal" && "Connect"}
            {currentProfileConnectionStatus === "request_received" && "Connect"}
            {currentProfileConnectionStatus === "request_sent" &&
              "Request Sent"}
            {currentProfileConnectionStatus === "connected" && "Message"}
            {currentProfileConnectionStatus === "request_sending" &&
              "Sending Request..."}
            {currentProfileConnectionStatus === "connecting" && "Connecting..."}
          </span>
        )}
        <span
          className={`${
            !isEditable ? "ml-2" : ""
          } cursor-pointer py-2 px-4 font-medium text-sm text-white rounded-2xl bg-colorPrimary`}
          onClick={() => {
            window.open(currentUser.github, "_blank").focus();
          }}
        >
          Github
        </span>
      </div>
    </div>
  );
}

function About(props) {
  const isEditable = props.isEditable;
  const setEditIndex = props.setEditIndex;
  const about = props.about;

  return (
    <Grow
      appear={true}
      in={true}
      style={{ transformOrigin: "0 0 0" }}
      {...{ timeout: 1000 }}
    >
      <div className="w-4/5 sm:w-3/5">
        <div className="flex justify-between items-center">
          <p className="my-8 text-colorPrimary font-semibold text-xl">About</p>
          {isEditable && (
            <IconButton
              size="small"
              onClick={() => {
                setEditIndex(2);
              }}
            >
              <FontAwesomeIcon
                className="text-colorPrimaryDark"
                icon={faPencilAlt}
              />
            </IconButton>
          )}
        </div>
        <p className="mx-4 mb-8 text-justify">{about}</p>
      </div>
    </Grow>
  );
}

function Education(props) {
  const isEditable = props.isEditable;
  const setEditIndex = props.setEditIndex;
  const education = props.education;

  return (
    <Grow in={true} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
      <div className="w-4/5 sm:w-3/5">
        <div className="flex justify-between items-center">
          <p className="my-4 text-colorPrimary font-semibold text-xl">
            Education
          </p>
          {isEditable && (
            <IconButton
              size="small"
              onClick={() => {
                setEditIndex(3);
              }}
            >
              <FontAwesomeIcon
                className="text-colorPrimaryDark"
                icon={faPencilAlt}
              />
            </IconButton>
          )}
        </div>
        <div className="mx-4 mb-8 text-justify">
          <p className="my-1 font-semibold text-lg">{education.degree}</p>
          <p className="my-1">{education.specialization}</p>
          <p className="my-1">
            {education.startYear} - {education.endYear}
          </p>
        </div>
      </div>
    </Grow>
  );
}

function Skills(props) {
  const style = props.style;
  const isEditable = props.isEditable;
  const setEditIndex = props.setEditIndex;
  const skills = props.skills;

  return (
    <Grow in={true} style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
      <div className="w-4/5 sm:w-3/5">
        <div className="flex justify-between items-center">
          <p className="my-4 text-colorPrimary font-semibold text-xl">Skills</p>
          {isEditable && (
            <IconButton
              size="small"
              onClick={() => {
                setEditIndex(4);
              }}
            >
              <FontAwesomeIcon
                className="text-colorPrimaryDark"
                icon={faPencilAlt}
              />
            </IconButton>
          )}
        </div>
        <Paper variant="outlined" className="p-4 mb-8 sm:m-0">
          {skills.map((skill) => (
            <Chip key={skill} label={skill} className={`${style.chip} m-2`} />
          ))}
        </Paper>
      </div>
    </Grow>
  );
}

export function MainSection(props) {
  const editIndex = props.editIndex;
  const selectedIndex = props.selectedIndex;
  const isEditable = props.isEditable;
  const setEditIndex = props.setEditIndex;
  const currentUser = props.currentUser;
  const style = props.style;
  const onSectionSelected = props.onSectionSelected;

  return (
    <div
      className={`${
        editIndex !== -1 ? "opacity-60 pointer-events-none" : ""
      } mt-8 h-1/3 w-full lg:w-11/12 flex flex-col sm:flex-row sm:justify-evenly items-center sm:items-stretch`}
    >
      <div className="w-1/5 hidden sm:flex flex-col justify-evenly bg-colorLightGrey">
        <div
          className="cursor-pointer flex justify-evenly items-center"
          onClick={(event) => {
            onSectionSelected(event, 0);
          }}
        >
          <FontAwesomeIcon
            className={`${
              selectedIndex === 0 ? "text-colorPrimary" : ""
            } w-1/5`}
            icon={faUser}
          />
          <p
            className={`${
              selectedIndex === 0 ? "text-colorPrimary font-semibold" : ""
            } w-3/5 text-lg`}
          >
            About
          </p>
        </div>
        <div
          className="cursor-pointer flex justify-evenly items-center"
          onClick={(event) => {
            onSectionSelected(event, 1);
          }}
        >
          <FontAwesomeIcon
            className={`${
              selectedIndex === 1 ? "text-colorPrimary" : ""
            } w-1/5`}
            icon={faGraduationCap}
          />
          <p
            className={`${
              selectedIndex === 1 ? "text-colorPrimary font-semibold" : ""
            } w-3/5 text-lg`}
          >
            Education
          </p>
        </div>
        <div
          className="cursor-pointer flex justify-evenly items-center"
          onClick={(event) => {
            onSectionSelected(event, 2);
          }}
        >
          <FontAwesomeIcon
            className={`${
              selectedIndex === 2 ? "text-colorPrimary" : ""
            } w-1/5`}
            icon={faCode}
          />
          <p
            className={`${
              selectedIndex === 2 ? "text-colorPrimary font-semibold" : ""
            } w-3/5 text-lg`}
          >
            Skills
          </p>
        </div>
      </div>
      {selectedIndex === 0 && (
        <About
          about={currentUser.about}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
      {selectedIndex === 1 && (
        <Education
          education={currentUser.education}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
      {selectedIndex === 2 && (
        <Skills
          skills={currentUser.skills}
          style={style}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
      {selectedIndex === -1 && (
        <About
          about={currentUser.about}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
      {selectedIndex === -1 && (
        <Education
          education={currentUser.education}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
      {selectedIndex === -1 && (
        <Skills
          skills={currentUser.skills}
          style={style}
          isEditable={isEditable}
          setEditIndex={setEditIndex}
        />
      )}
    </div>
  );
}
