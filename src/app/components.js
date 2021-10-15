import { motion } from "framer-motion";

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
}

export const NotFound = () => {
  return (
    <div>Not Found </div>
  );
}