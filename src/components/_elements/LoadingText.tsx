import React, { memo } from "react";

import LoadingSpinner from "./LoadingSpinner";

type LoadingTextProps = {
  text: string;
  className: string;
  iconClassName: string;
};

function LoadingText(props: LoadingTextProps) {
  return (
    <div className={`text-gray-500 text-md flex flex-row justify-center items-center ${props.className}`}>
      <LoadingSpinner className={props.iconClassName} />
      {props.text && <div className="flex">{props.text}</div>}
    </div>
  );
}

export default memo(LoadingText);
