import * as React from "react";

type Props = {
  s?: number;
  update_block: (s_ij: number) => void;
};

const ColorBlock: React.FC<Props> = (props) => {
  const handle_click = () => {
    var new_s_ij = props.s == 1 ? -1 : 1;
    props.update_block(new_s_ij);
  };

  return (
    <div
      className="color_block"
      style={{ padding: "8px", backgroundColor: props.s == 1 ? "red" : "gray", display: "inline-block" }}
      onClick={() => {
        handle_click();
      }}
    ></div>
  );
};

export default ColorBlock;
