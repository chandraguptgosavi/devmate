import {selectAuthenticated} from "features/auth/authSlice";
import {useSelector} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import Routes from "./types";

/**
 * Allows only logged in users to access route
 * @param children
 * @param rest
 * @returns {JSX.Element}
 */
function PrivateRoute({children, ...rest}) {
    const isAuthenticated = useSelector(selectAuthenticated);

    return (<Route {...rest}
                   render={() => (
                       isAuthenticated ? children : <Redirect to={Routes.LOGIN}/>
                   )}
    />);
}

export default PrivateRoute;