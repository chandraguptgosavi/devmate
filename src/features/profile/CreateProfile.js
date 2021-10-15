import {
  Button,
  Chip,
  CircularProgress,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import validator from "validator";
import { isValidProfile } from "./utils";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "@firebase/auth";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Routes from "routes/types";
import { selectAuthenticated } from "features/auth/authSlice";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

const useStyle = makeStyles((theme) => {
  return {
    formField: {
      margin: "1em 0",
    },
    colorPrimaryLight: {
      backgroundColor: theme.palette.primary.light,
    },
    button: {
      color: "white",
      margin: "1.5em 0",
      borderRadius: "2em",
    },
  };
});

function Skills(props) {
  const skills = props.skills;
  const setSkills = props.setSkills;
  const style = props.style;

  const deleteSkill = (deleteSkill) => {
    setSkills(skills.filter((skill) => skill !== deleteSkill));
  };

  return skills.length > 0 ? (
    <Paper
      variant="outlined"
      className={`
  ${props.style.formField}
   flex
   flex-wrap
   list-none
   justify-center
   `}
    >
      {skills.map((skill) => (
        <Chip
          key={skill}
          label={skill}
          className={`${style.colorPrimaryLight} m-1`}
          onDelete={() => {
            deleteSkill(skill);
          }}
        />
      ))}
    </Paper>
  ) : (
    <></>
  );
}

function CreateProfile() {
  const isAuthenticated = useSelector(selectAuthenticated);
  const style = useStyle();
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [githubURL, setGithubURL] = useState("");
  const [skillsError, setSkillsError] = useState(false);
  const [githubError, setGithubError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // if (isAuthenticated)
  //   return <Route render={() => <Redirect to={Routes.FEED} />} />;

  const onStartYearChange = (event) => {
    setStartYear(event.target.value);
  };

  const onEndYearChange = (event) => {
    setEndYear(event.target.value);
  };

  const onSkillsChange = (event) => {
    if (skills.length === 0) {
      setSkillsError(true);
    }
    setSkill(event.target.value);
    const input = event.target.value.trim();
    if (input.slice(-1) === ",") {
      setSkills((skills) => [...skills, input.slice(0, input.length - 1)]);
      setSkill("");
      if (skills.length === 0) {
        setSkillsError(false);
      }
    }
  };

  const onGithubURLChange = (event) => {
    const url = event.target.value.trim();
    setGithubURL(url);
    if (!validator.isURL(url)) {
      setGithubError(true);
    } else {
      setGithubError(false);
    }
  };

  const onCreateProfileClick = async () => {
    const isValid = isValidProfile(skills, githubURL);
    if (isValid) {
      try {
        setIsLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const db = getFirestore();
        const user = {
          education: {
            degree: degree,
            specialization: specialization,
            startYear: startYear,
            endYear: endYear,
          },
          skills: skills,
          github: githubURL,
        };
        await setDoc(doc(db, "users", currentUser.uid), user);
        setIsLoading(false);
        history.push(Routes.FEED);
      } catch (err) {
        console.log(`create profile error: ${err}`);
      }
    } else {
      setGithubError(true);
      setSkillsError(true);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-y-scroll flex flex-col justify-center items-center">
      <p className="w-3/4 text-2xl mt-4 font-semibold text-center">
        Your profile helps you discover new developers and opportunities
      </p>
      <div className="flex w-2/3 md:w-2/5 h-full flex-col">
        <form className="flex flex-col">
          <TextField
            label="Degree"
            variant="outlined"
            size="small"
            fullWidth
            className={`${style.formField}`}
            onChange={(event) => {
              setDegree(event.target.value.trim());
            }}
          />
          <TextField
            label="Specialization"
            variant="outlined"
            size="small"
            fullWidth
            className={`${style.formField}`}
            onChange={(event) => {
              setSpecialization(event.target.value.trim());
            }}
          />
          <div className={`${style.formField} flex justify-between`}>
            <TextField
              variant="outlined"
              size="small"
              className="w-2/5"
              label="Start Year"
              onChange={onStartYearChange}
            />
            <TextField
              variant="outlined"
              size="small"
              className="w-2/5"
              label="End Year"
              onChange={onEndYearChange}
            />
          </div>
          <Skills setSkills={setSkills} skills={skills} style={style} />
          <TextField
            variant="outlined"
            size="small"
            label="Skills"
            error={skillsError}
            helperText={
              skillsError
                ? "Enter at least one skill"
                : "Type a skill and press comma ',' to add it"
            }
            fullWidth
            className={`
            ${style.formField} 
            `}
            value={skill}
            onChange={onSkillsChange}
            required
          />
          <TextField
            variant="outlined"
            size="small"
            label="Github"
            error={githubError}
            helperText={githubError ? "Add github profile link" : null}
            fullWidth
            className={`
            ${style.formField} 
            `}
            onChange={onGithubURLChange}
            required
          />
          <Button
            color="primary"
            className={`${style.button} w-full self-center`}
            variant="contained"
            onClick={onCreateProfileClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size="1.7em" color="primary" />
            ) : (
              <span>Create Profile</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfile;
