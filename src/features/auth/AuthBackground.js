import {  Card, CardContent } from "@material-ui/core";
import showcaseImage from "assets/auth-card.png";
import bottomLeftBackground from "assets/left-corner-background.png";
import topRightBackground from "assets/right-corner-background.png";

function AuthBackground({ children }) {
  return (
    <div className="ralative bg-colorPrimaryLight flex justify-center items-center h-screen">
      <img
        className="absolute bottom-0 left-0"
        src={bottomLeftBackground}
        alt="bottom-left-background"
      />
      <img
        className="absolute right-0 top-0"
        src={topRightBackground}
        alt="top-right-background"
      />
      <Card className="w-4/5 h-3/4 z-10">
        <CardContent className="p-4 flex w-full h-full rounded-2xl">
          <div
            className="
        relative 
        bg-colorPrimaryLight 
        w-1/2
        hidden
        md:block
        "
          >
            <img
              className="absolute top-0 right-0 h-full"
              src={showcaseImage}
              alt="auth-card"
            />
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthBackground;
