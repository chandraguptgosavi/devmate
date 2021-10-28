import {motion} from "framer-motion";
import {authenticateAsync, selectUserID, signedInAsync} from "features/auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import {FaCommentDots, FaUserCircle} from "react-icons/fa";
import {FiLogOut, FiMoreVertical} from "react-icons/fi";
import {MdClose, MdSearch} from "react-icons/md";
import {IoHome} from "react-icons/io5";
import {ListItemIcon, ListItemText} from "@material-ui/core";
import {Menu, MenuItem} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Routes from "routes/types";
import {
  profilesLoading,
  searchBoxClosed,
  searchBoxRequested,
  searched,
  selectIsSearchBoxVisible,
} from "features/feed/feedSlice";
import {forwardRef, useState} from "react";
import {useStyle} from "./hooks";

export function LoadingIndicator() {
  const dotsContainer = {
    display: "flex",
    margin: "auto 0",
    alignSelf: "center",
    width: "3em",
    height: "2em",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const dotsContainerVariant = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dot = {
    width: "1em",
    height: "1em",
    borderRadius: "50%",
  };

  const dotVariant = {
    start: {
      y: "0%",
    },
    end: {
      y: "100%",
    },
  };

  const dotTransition = {
    duration: 0.4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  };

  return (
    <motion.div
      style={dotsContainer}
      variants={dotsContainerVariant}
      initial="start"
      animate="end"
    >
      <motion.div style={dot} variants={dotVariant} transition={dotTransition}>
        <div className="w-2 h-2 m-auto rounded-full bg-colorPrimary"></div>
      </motion.div>
      <motion.div style={dot} variants={dotVariant} transition={dotTransition}>
        <div className="w-2 h-2 m-auto rounded-full bg-colorPrimary"></div>
      </motion.div>
      <motion.div style={dot} variants={dotVariant} transition={dotTransition}>
        <div className="w-2 h-2 m-auto rounded-full bg-colorPrimary"></div>
      </motion.div>
    </motion.div>
  );
}

export const FallbackComponent = () => {
  return (
    <div className="flex justify-center w-full h-screen">
      <LoadingIndicator />
    </div>
  );
};

export const NotFound = () => {
  return <div>Not Found</div>;
};

function SearchBox() {
  const dispatch = useDispatch();

  const onSearchQueryChange = (query) => {
    dispatch(profilesLoading(true));
    dispatch(searched(query));
    dispatch(profilesLoading(false));
  };

  return (
    <div className={`bg-colorPrimaryDark w-full h-full flex`}>
      <input
        type="text"
        placeholder="Search skill"
        className="
          bg-colorPrimaryDark text-white placeholder-white 
          px-4 w-full h-full border-0 focus:border-0 
         focus:outline-none"
        onChange={(event) => {
          onSearchQueryChange(event.target.value.toLowerCase());
        }}
      />
      <MdClose
        className="cursor-pointer mx-4 text-white text-2xl self-center"
        onClick={() => {
          dispatch(searchBoxClosed());
        }}
      />
    </div>
  );
}

function OverflowMenu({
  showHomeOption,
  showMessagesOption,
  showProfileOption,
  logOut,
}) {
  const [anchorElement, setAnchorElement] = useState(null);
  const userID = useSelector(selectUserID);
  const history = useHistory();
  const style = useStyle();
  const isMenuOpen = Boolean(anchorElement);

  const onWindowResize = () => {
    setAnchorElement(null);
  };

  window.addEventListener("resize", onWindowResize);

  const onMenuClose = () => {
    setAnchorElement(null);
  };

  return (
    <div>
      <FiMoreVertical
        className="cursor-pointer mx-2 xs:mx-4 text-white text-2xl"
        onClick={(event) => {
          if (!isMenuOpen) {
            setAnchorElement(event.target);
          }
        }}
      />
      <Menu
        open={isMenuOpen}
        anchorEl={anchorElement}
        onClose={onMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          classes: {
            list: style.menuItem,
          },
        }}
      >
        <div className="flex flex-col">
          <div className={`${showHomeOption ? "block" : "hidden"}`}>
            <MenuItem
              onClick={() => {
                onMenuClose();
                history.push(Routes.FEED);
              }}
            >
              <ListItemIcon>
                <IoHome />
              </ListItemIcon>
              <ListItemText>Home</ListItemText>
            </MenuItem>
          </div>
          <div className={`${showMessagesOption ? "block" : "hidden"}`}>
            <MenuItem
              onClick={() => {
                onMenuClose();
                history.push(Routes.CHAT);
              }}
            >
              <ListItemIcon>
                <FaCommentDots />
              </ListItemIcon>
              <ListItemText>Messages</ListItemText>
            </MenuItem>
          </div>
          <div className={`${showProfileOption ? "block" : "hidden"}`}>
            <MenuItem
              onClick={() => {
                onMenuClose();
                history.push(`${Routes.PROFILE}/${userID}`);
              }}
            >
              <ListItemIcon>
                <FaUserCircle />
              </ListItemIcon>
              <ListItemText>Your Profile</ListItemText>
            </MenuItem>
          </div>
          <div className={``}>
            <MenuItem
              onClick={async () => {
                onMenuClose();
                await logOut();
              }}
            >
              <ListItemIcon>
                <FiLogOut />
              </ListItemIcon>
              <ListItemText>Log out</ListItemText>
            </MenuItem>
          </div>
        </div>
      </Menu>
    </div>
  );
}

export function AppBar({
  showSearchOption = true,
  showHomeOption = true,
  showMessagesOption = true,
  showProfileOption = true,
}) {
  const isSearchBoxVisible = useSelector(selectIsSearchBoxVisible);
  const userID = useSelector(selectUserID);
  const history = useHistory();
  const dispatch = useDispatch();

  const logOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(authenticateAsync(false));
      dispatch(signedInAsync(null));
    } catch (err) {
      console.log(`error from App bar: ${err}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-colorPrimary w-full h-1/12vh">
      <div
        className={`${
          isSearchBoxVisible ? "hidden" : "flex"
        } w-full h-full items-center justify-between`}
      >
        <p className="mx-4 font-semibold text-2xl text-white">DevMate</p>
        <div className="hidden sm:flex">
          <MdSearch
            className={`${
              showSearchOption ? "block" : "hidden"
            } cursor-pointer mx-4 text-white text-2xl`}
            onClick={() => {
              if (!isSearchBoxVisible) {
                dispatch(searchBoxRequested());
                dispatch(searched(""));
              }
            }}
          />
          <IoHome
            className={`${
              showHomeOption ? "block" : "hidden"
            } cursor-pointer mx-4 text-white text-2xl`}
            onClick={() => {
              history.push(Routes.FEED);
            }}
          />
          <FaCommentDots
            className={`${
              showMessagesOption ? "block" : "hidden"
            } cursor-pointer mx-4 text-white text-2xl`}
            onClick={() => {
              history.push(Routes.CHAT);
            }}
          />
          <FaUserCircle
            className={`${
              showProfileOption ? "block" : "hidden"
            } cursor-pointer mx-4 text-white text-2xl`}
            onClick={() => {
              history.push(`${Routes.PROFILE}/${userID}`);
            }}
          />
          <FiLogOut
            className="cursor-pointer mx-4 text-white text-2xl"
            onClick={logOut}
          />
        </div>
        <div className="cursor-pointer flex sm:hidden">
          <MdSearch
            className={`${
              showSearchOption ? "block" : "hidden"
            } cursor-pointer mx-4 text-white text-2xl`}
            onClick={() => {
              if (!isSearchBoxVisible) {
                dispatch(searchBoxRequested());
                dispatch(searched(""));
              }
            }}
          />
          <OverflowMenu
              showHomeOption={showHomeOption}
              showProfileOption={showProfileOption}
              showMessagesOption={showMessagesOption}
              logOut={logOut}
          />
        </div>
      </div>
      {isSearchBoxVisible && <SearchBox/>}
    </header>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomSnackbar = ({isOpen = false, setIsOpen, severity = "error", message = "Something went wrong!"}) => {
  const [,] = useState(false);

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
  };

  return (
      <Snackbar
          open={isOpen}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
          autoHideDuration={5000}
          onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={severity} className="w-full">
          {message}
        </Alert>
      </Snackbar>
  );
};