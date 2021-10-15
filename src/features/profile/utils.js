import validator from 'validator';

export const areValidSkills = (skills) => {
    return skills.length > 0;
} 

export const isValidGithub = (url) => {
    return validator.isURL(url);
}

export const isValidProfile = (skills, url) => {
  return areValidSkills(skills) && isValidGithub(url);
};