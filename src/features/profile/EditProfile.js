import { Card, Paper } from "@mui/material";
import { TextField, CircularProgress, Button, Chip, TextareaAutosize } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import isURL from "validator/lib/isURL";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserID } from "./userSlice";

function EditProfilePicture({ setCurrentUser, user, ...props }) {
  const setEditIndex = props.setEditIndex;
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userID = useSelector(selectUserID);

  const onSave = async () => {
    let valid = true;
    if (file) {
      setFileError(false);
    } else {
      valid = false;
      setFileError(true);
    }
    if (valid) {
      setIsLoading(true);
      try {
        const storageReference = ref(
          getStorage(),
          `profile-pictures/${userID}`
        );
        await uploadBytes(storageReference, file);
        const profilePictureURL = await getDownloadURL(storageReference);
        const newUser = {
          ...user,
          profilePicture: profilePictureURL,
        };
        await setDoc(doc(getFirestore(), "users", userID), newUser);
        setCurrentUser(newUser);
        setIsLoading(false);
      } catch (err) {
        console.log(`error from edit profile picture: ${err}`);
      }
    }
  };

  return (
    <Card
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-4/5 sm:w-3/5 md:w-2/5"
      raised
    >
      <div className="p-2 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between">
          <p className="text-lg">Edit Profile Picture</p>
          <CloseIcon
            onClick={() => {
              setEditIndex(-1);
            }}
          />
        </div>
        <Button
          style={{ margin: "1em 0.25em" }}
          color="primary"
          variant="contained"
          component="label"
        >
          <span className="text-white">Upload File</span>
          <input
            accept="image/jpeg, image/png"
            type="file"
            className="hidden"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
        </Button>
        <p className="mb-4 mx-1">Selected image: "{file && file.name}"</p>
        {fileError && (
          <p className="mb-4 mx-1 text-red-500">Please select image</p>
        )}

        <Button
          style={{ marginRight: ".125em" }}
          className="justify-self-end self-end"
          size="small"
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span className="text-white">Save</span>
          )}
        </Button>
      </div>
    </Card>
  );
}

function EditIntro({ setCurrentUser, user, ...props }) {
  const setEditIndex = props.setEditIndex;
  const [firstName, setFirstName] = useState(user.firstName);
  const [headline, setHeadline] = useState(user.headline);
  const [github, setGithub] = useState(user.github);
  const [firstNameError, setFirstNameError] = useState(false);
  const [headlineError, setHeadlineError] = useState(false);
  const [githubError, setGithubError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userID = useSelector(selectUserID);

  const onSave = async () => {
    let error = false;
    if (firstName.trim().length > 0) {
      setFirstNameError(false);
    } else {
      error = true;
      setFirstNameError(true);
    }
    if (headline.trim().length > 0) {
      setHeadlineError(false);
    } else {
      error = true;
      setHeadlineError(true);
    }
    if (isURL(github.trim())) {
      setGithubError(false);
    } else {
      error = true;
      setGithubError(true);
    }
    if (!error) {
      setIsLoading(true);
      try {
        const newUser = {
          ...user,
          firstName: firstName.trim(),
          headline: headline.trim(),
          github: github.trim(),
        };
        await setDoc(doc(getFirestore(), "users", userID), newUser);
        setCurrentUser(newUser);
        setIsLoading(false);
      } catch (error) {
        console.log(`error from edit intro: ${error}`);
      }
    }
  };

  return (
    <Card
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-4/5 sm:w-3/5 md:w-2/5 h-3/5"
      raised
    >
      <div className="p-2 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between">
          <p className="text-lg">Edit intro</p>
          <CloseIcon
            onClick={() => {
              setEditIndex(-1);
            }}
          />
        </div>
        <TextField
          className=""
          label="First Name"
          size="small"
          variant="outlined"
          value={firstName}
          error={firstNameError}
          helperText={firstNameError ? "Required field" : null}
          onChange={(event) => {
            setFirstName(event.target.value);
          }}
          required
        />
        <TextField
          className=""
          label="Headline"
          size="small"
          variant="outlined"
          value={headline}
          error={headlineError}
          helperText={headlineError ? "Required field" : null}
          onChange={(event) => {
            setHeadline(event.target.value);
          }}
          required
        />
        <TextField
          className=""
          label="Github"
          size="small"
          variant="outlined"
          value={github}
          error={githubError}
          helperText={githubError ? "Required field" : null}
          onChange={(event) => {
            setGithub(event.target.value);
          }}
          required
        />
        <Button
          style={{ marginRight: ".125em" }}
          className="justify-self-end self-end"
          size="small"
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span className="text-white">Save</span>
          )}
        </Button>
      </div>
    </Card>
  );
}

function EditAbout({ setCurrentUser, user, ...props }) {
  const setEditIndex = props.setEditIndex;
  const [about, setAbout] = useState(user.about);
  const [aboutError, setAboutError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userID = useSelector(selectUserID);

  const onSave = async () => {
    let valid = true;
    const currentAbout = about.trim();
    if (currentAbout.length > 0) {
      setAboutError(false);
    } else {
      valid = false;
      setAboutError(true);
    }
    if (valid) {
      setIsLoading(true);
      try {
        const newUser = {
          ...user,
          about: currentAbout,
        };
        await setDoc(doc(getFirestore(), "users", userID), newUser);
        setCurrentUser(newUser);
        setIsLoading(false);
      } catch (err) {
        console.log(`error from edit about: ${err}`);
      }
    }
  };

  return (
    <Card
      raised
      className="fixed 
      top-1/2 
      left-1/2
       transform 
       -translate-x-1/2 
       -translate-y-1/2 
       z-10 
       w-4/5 sm:w-3/5 md:w-2/5 
       "
    >
      <div className="p-2 w-full  flex flex-col">
        <div className="flex justify-between">
          <p className="text-lg">Edit about</p>
          <CloseIcon
            onClick={() => {
              setEditIndex(-1);
            }}
          />
        </div>
        <TextField
          className="resize-none p-2 mx-1 my-4 rounded-sm border-gray-400 border-2"
          variant="outlined"
          maxRows="10"
          style={{ margin: "1em 0.25em" }}
          value={about}
          error={aboutError}
          helperText={aboutError ? "Required field" : null}
          onChange={(event) => {
            setAbout(event.target.value);
          }}
          multiline
          required
        />
        <Button
          style={{ marginRight: ".125em" }}
          className="justify-self-end self-end"
          size="small"
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span className="text-white">Save</span>
          )}
        </Button>
      </div>
    </Card>
  );
}

function EditEducation({ setCurrentUser, user, ...props }) {
  const setEditIndex = props.setEditIndex;
  const [degree, setDegree] = useState(user.education.degree);
  const [specialization, setSpecialization] = useState(
    user.education.specialization
  );
  const [startYear, setStartYear] = useState(user.education.startYear);
  const [endYear, setEndYear] = useState(user.education.endYear);
  const [degreeError, setDegreeError] = useState(false);
  const [specializationError, setSpecializationError] = useState(false);
  const [startYearError, setStartYearError] = useState(false);
  const [endYearError, setEndYearError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userID = useSelector(selectUserID);

  const onSave = async () => {
    let valid = true;
    const currentDegree = degree.trim();
    const currentSpecialization = specialization.trim();
    const currentStartYear = startYear.trim();
    const currentEndYear = endYear.trim();

    if (currentDegree.length > 0) {
      setDegreeError(false);
    } else {
      valid = false;
      setDegreeError(true);
    }
    if (currentSpecialization.length > 0) {
      setSpecializationError(false);
    } else {
      valid = false;
      setSpecializationError(true);
    }
    if (currentStartYear.length > 0) {
      setStartYearError(false);
    } else {
      valid = false;
      setStartYearError(true);
    }
    if (currentStartYear.length > 0) {
      setEndYearError(false);
    } else {
      valid = false;
      setEndYearError(true);
    }

    if (valid) {
      setIsLoading(true);
      try {
        const newUser = {
          ...user,
          education: {
            degree: currentDegree,
            specialization: currentSpecialization,
            startYear: currentStartYear,
            endYear: currentEndYear,
          },
        };
        await setDoc(doc(getFirestore(), "users", userID), newUser);
        setCurrentUser(newUser);
        setIsLoading(false);
      } catch (err) {
        console.log(`error from edit education: ${err}`);
      }
    }
  };

  return (
    <Card
      raised
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-4/5 sm:w-3/5 md:w-2/5 h-3/5"
    >
      <div className="p-2 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between">
          <p className="text-lg">Edit education</p>
          <CloseIcon
            onClick={() => {
              setEditIndex(-1);
            }}
          />
        </div>
        <TextField
          label="Degree"
          size="small"
          variant="outlined"
          value={degree}
          error={degreeError}
          helperText={degreeError ? "Required field" : null}
          onChange={(event) => {
            setDegree(event.target.value);
          }}
          required
        />
        <TextField
          label="Specialization"
          size="small"
          variant="outlined"
          value={specialization}
          error={specializationError}
          helperText={specializationError ? "Required field" : null}
          onChange={(event) => {
            setSpecialization(event.target.value);
          }}
          required
        />
        <div className="flex justify-between w-full">
          <TextField
            label="Start Year"
            size="small"
            variant="outlined"
            className="w-2/5"
            value={startYear}
            error={startYearError}
            helperText={startYearError ? "Required field" : null}
            onChange={(event) => {
              setStartYear(event.target.value);
            }}
            required
          />
          <TextField
            label="End Year"
            size="small"
            variant="outlined"
            className="w-2/5"
            value={endYear}
            error={endYearError}
            helperText={endYearError ? "Required field" : null}
            onChange={(event) => {
              setEndYear(event.target.value);
            }}
            required
          />
        </div>
        <Button
          style={{ marginRight: ".125em" }}
          className="justify-self-end self-end"
          size="small"
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span className="text-white">Save</span>
          )}
        </Button>
      </div>
    </Card>
  );
}

function EditSkills({ setCurrentUser, user, ...props }) {
  const style = props.style;
  const setEditIndex = props.setEditIndex;
  const [skills, setSkills] = useState(user.skills);
  const [skill, setSkill] = useState("");
  const [skillsError, setSkillsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userID = useSelector(selectUserID);

  const onSkillChange = (event) => {
    setSkill(event.target.value);
    const currentSkill = event.target.value.trim();
    if (currentSkill.length >= 2 && currentSkill.slice(-1) === ",") {
      setSkills([...skills, currentSkill.slice(0, currentSkill.length - 1)]);
      setSkill("");
    }
  };

  const onSave = async () => {
    let valid = true;
    if (skills.length > 0) {
      setSkillsError(false);
    } else {
      valid = false;
      setSkillsError(true);
    }

    if (valid) {
      setIsLoading(true);
      try {
        const newUser = {
          ...user,
          skills: skills,
        };
        await setDoc(doc(getFirestore(), "users", userID), newUser);
        setCurrentUser(newUser);
        setIsLoading(false);
      } catch (err) {
        console.log(`error from edit skills: ${err}`);
      }
    }
  };

  const deleteSkill = (currentSkill) => {
    setSkills(skills.filter((skill) => skill !== currentSkill));
  };

  return (
    <Card
      raised
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-4/5 sm:w-3/5 md:w-2/5 h-3/5 "
    >
      <div className="p-2 w-full h-full  flex flex-col justify-between">
        <div className="flex justify-between">
          <p className="text-lg">Edit skills</p>
          <CloseIcon
            onClick={() => {
              setEditIndex(-1);
            }}
          />
        </div>

        <Paper
          variant="outlined"
          className="h-2/3 my-2 p-2 overflow-y-auto hide-scrollbar flex justify-center items-center flex-wrap"
        >
          {skills.length > 0 ? (
            <>
              {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                className={`${style.chip} m-2`}
                onDelete={() => {
                  deleteSkill(skill);
                }}
              />
              ))}
            </>
          ) : (
              <div>Add some skills...</div>
          )}
        </Paper>

        <TextField
          label="Comma adds a skill"
          style={{ margin: ".5em 0" }}
          size="small"
          variant="outlined"
          value={skill}
          error={skillsError}
          helperText={skillsError ? "Minimum one skill required" : null}
          onChange={onSkillChange}
          required
        />
        <Button
          style={{ marginRight: ".125em" }}
          className="justify-self-end self-end"
          size="small"
          color="primary"
          variant="contained"
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size="1.7em" color="primary" />
          ) : (
            <span className="text-white">Save</span>
          )}
        </Button>
      </div>
    </Card>
  );
}

function EditProfile({
  editIndex,
  currentUser,
  setCurrentUser,
  setEditIndex,
  style,
}) {
  return (
    <>
      {editIndex === 0 && (
        <EditProfilePicture
          user={currentUser}
          setCurrentUser={setCurrentUser}
          setEditIndex={setEditIndex}
        />
      )}
      {editIndex === 1 && (
        <EditIntro
          user={currentUser}
          setCurrentUser={setCurrentUser}
          setEditIndex={setEditIndex}
        />
      )}
      {editIndex === 2 && (
        <EditAbout
          user={currentUser}
          setCurrentUser={setCurrentUser}
          setEditIndex={setEditIndex}
        />
      )}
      {editIndex === 3 && (
        <EditEducation
          user={currentUser}
          setCurrentUser={setCurrentUser}
          setEditIndex={setEditIndex}
        />
      )}
      {editIndex === 4 && (
        <EditSkills
          user={currentUser}
          setCurrentUser={setCurrentUser}
          setEditIndex={setEditIndex}
          style={style}
        />
      )}
    </>
  );
}



export default EditProfile;