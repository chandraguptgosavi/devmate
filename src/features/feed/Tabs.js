import {Tab, Tabs} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {selectIsSearchBoxVisible, selectTabIndex, tabChanged} from "./feedSlice";

function FeedTabs() {

  const tabIndex = useSelector(selectTabIndex);
  const isSearchBoxVisible = useSelector(selectIsSearchBoxVisible);
    const dispatch = useDispatch();

    const onTabChange = (event, newValue) => {
        dispatch(tabChanged(newValue));
    }

  return (
    <div>
      {!isSearchBoxVisible && (
        <Tabs
          variant="fullWidth"
          indicatorColor="secondary"
          value={tabIndex}
          TabIndicatorProps={{ style: { height: ".2em" } }}
          onChange={onTabChange}
        >
          <Tab style={{ fontSize: "1rem", color: "white" }} label="Discover" />
          <Tab style={{ fontSize: "1rem", color: "white" }} label="Requests" />
        </Tabs>
      )}
    </div>
  );
}

export default FeedTabs;