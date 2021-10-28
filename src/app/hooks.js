import {makeStyles} from "@material-ui/core";
import {useEffect, useRef} from "react";

export const useStyle = makeStyles((theme) => {
  return {
    chip: {
      backgroundColor: theme.palette.primary.light,
    },
    menuItem: {
      padding: "0 1em"
    }
  };
});

export function useIsComponentMounted() {
  const isComponentMounted = useRef(false);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false
    };
  }, []);

  return isComponentMounted;
}
