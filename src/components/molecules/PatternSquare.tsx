import * as React from "react";
import ColorBlock from "../atoms/ColorBlock";

type PatternRowProps = {
  pattern_row: Array<number>;
  update_row: (row_data: Array<number>) => void;
};

const PatternRow: React.FC<PatternRowProps> = (props: PatternRowProps) => {
  const update_block = (i: number, s_ij: number) => {
    var row_data_copy = props.pattern_row.slice();
    row_data_copy[i] = s_ij;
    props.update_row(row_data_copy);
  };

  const blocks = props.pattern_row.map((s: number, i) => {
    return <ColorBlock key={i} s={s} update_block={(s_ij: number) => update_block(i, s_ij)} />;
  });

  return (
    <div className="pattern_row" style={{ fontSize: "0" }}>
      {blocks}
    </div>
  );
};

type PatternSquareProps = {
  s: Array<Array<number>>;
  update_input: (input: Array<Array<number>>) => void;
};

export const PatternSquare: React.FC<PatternSquareProps> = (props) => {
  const update_row = (i: number, row_data: Array<number>) => {
    var input_copy = props.s.slice();
    input_copy[i] = row_data;
    props.update_input(input_copy);
  };

  const rows = props.s.map((row, i) => {
    return (
      <PatternRow
        key={i}
        pattern_row={row}
        update_row={(row_data: Array<number>) => {
          update_row(i, row_data);
        }}
      />
    );
  });

  return (
    <div className="pattern_square" style={{ margin: "10px", textAlign: "center", display:"inline-block" }}>
      {rows}
    </div>
  );
};
