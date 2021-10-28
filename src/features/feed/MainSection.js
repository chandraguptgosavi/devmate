import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import ProfileIcon from "assets/profile-icon.png";
import {Chip, CircularProgress} from "@material-ui/core";
import {Card, Grid} from "@mui/material";
import {useStyle} from "app/hooks";
import Routes from "routes/types";
import {selectIsLoading, selectTabIndex} from "./feedSlice";
import Connect from "./Connect";

/**
 * MainSection component shows developer profiles in grid layout
 * @param {Array} profiles - list of developers
 * @returns {JSX.Element}
 */
function MainSection({profiles}) {
  const isLoading = useSelector(selectIsLoading);
  const tabIndex = useSelector(selectTabIndex);
  const history = useHistory();
  const chipStyle = useStyle();

  return (
      <>
        {isLoading ? (
            <div className="w-full h-10/12vh flex justify-center items-center">
              <CircularProgress color="primary" />
            </div>
        ) : (
            <>
              {profiles.length > 0 ? (
                  <div className="p-8">
                    <Grid
                        container
                        justifyContent="center"
                        spacing={{ xs: 4, md: 8 }}
                    >
                      {profiles.map((dev) => (
                          <Grid
                              item
                              key={dev.uid}
                              xs={11}
                              sm={9}
                              md={6}
                              lg={4}
                              xl={3}
                              className="max-h-2/3vh"
                          >
                            <Card
                                raised
                                className="relative w-full h-full flex flex-col overflow-hidden"
                            >
                              <div className="px-4 pt-4">
                                <div className="w-full flex flex-col items-center">
                                  <img
                                      src={
                                        dev.profilePicture
                                            ? dev.profilePicture
                                            : ProfileIcon
                                      }
                                      alt="profile"
                                      className={`${
                                          dev.profilePicture ? "" : "text-colorPrimaryDark"
                                      } max-w-70px max-h-80px sm:max-h-90px rounded-md shadow-xl object-contain`}
                                  />
                                  <div className="w-full my-2 flex flex-col items-center">
                                    <p className="text-colorPrimaryDark text-lg font-medium">
                                      {dev.firstName}
                                    </p>
                                    <p className="text-sm">{dev.headline}</p>
                                  </div>
                                  <div className="my-2">
                            <span
                                className="cursor-pointer mr-2 py-2 px-4 font-medium text-sm text-white rounded-2xl bg-colorPrimary"
                                onClick={() => {
                                  history.push(`${Routes.PROFILE}/${dev.uid}`);
                                }}
                            >
                              Profile
                            </span>
                                    <span
                                        className="cursor-pointer mr-l py-2 px-4 font-medium text-sm text-white rounded-2xl bg-colorPrimary"
                                        onClick={() => {
                                          window.open(dev.github, "_blank").focus();
                                        }}
                                    >
                              Github
                            </span>
                                  </div>
                                </div>
                                <div className="my-2">
                                  <p className="text-colorPrimaryDark font-medium">
                                    About
                                  </p>
                                  <p
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                      }}
                                      className="text-sm overflow-ellipsis overflow-hidden"
                                  >
                                    {dev.about}
                                  </p>
                                </div>
                                <div className="mt-2">
                                  <p className="text-colorPrimaryDark font-medium">
                                    Skills
                                  </p>
                                  <div
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: "2",
                                        WebkitBoxOrient: "vertical",
                                      }}
                                      className="overflow-ellipsis overflow-hidden"
                                  >
                                    {dev.skills &&
                                    dev.skills.map((skill) => (
                                        <Chip
                                            key={skill}
                                            label={skill}
                                            className={`${chipStyle.chip} m-1`}
                                        />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Connect
                                  devID={dev.uid}
                                  dev={{
                                    profilePicture: dev.profilePicture,
                                    firstName: dev.firstName,
                                    headline: dev.headline,
                                    github: dev.github,
                                    about: dev.about,
                                    education: dev.education,
                                    skills: dev.skills,
                                    connections: dev.connections,
                                    connectionStatus: dev.connectionStatus,
                                  }}
                              />
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </div>
              ) : (
                  <div className="w-full h-10/12vh flex flex-col justify-center text-center">
                    {tabIndex === 1 ? (
                        <p className=" text-colorPrimaryDark">No pending requests</p>
                    ) : null}
                  </div>
              )}
            </>
        )}
      </>
  );
}

export default MainSection;
