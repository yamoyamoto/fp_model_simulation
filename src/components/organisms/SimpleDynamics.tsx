import * as React from "react";
import PatternSquare from "./PatternSquare";
import axios from "../../../libs/axios";
import { Button } from "@material-ui/core";

type Props = {};

type Post = {
  train_data: Array<Array<Array<number>>>;
  input: Array<Array<number>>;
  dynamics_count: number;
};

type PostData = {
  train_data: Array<Array<number>>;
  input_pattern: Array<number>;
  dynamics_count: number;
};

type OutputPattern = {
  pattern: Array<Array<number>>;
  count: number;
};

const SimpleDynamics: React.FC<Props> = (props: Props) => {
  const default_input: Array<Array<number>> = [
    [1, 1, 1, 1, 1],
    [1, -1, -1, -1, 1],
    [1, -1, -1, -1, 1],
    [1, -1, -1, -1, 1],
    [1, 1, 1, 1, 1],
  ];
  const row_length = default_input[0].length;
  const [is_show_output, change_show_output] = React.useState(false);
  const [data, set_data] = React.useState<Array<OutputPattern>>([]);
  const [clicked, set_clicked] = React.useState(false);
  const [input, update_input] = React.useState(default_input);

  const post: Post = {
    train_data: [
      [
        [1, -1, 1, -1, 1],
        [1, -1, 1, -1, 1],
        [1, -1, 1, -1, 1],
        [1, -1, 1, -1, 1],
        [1, -1, 1, -1, 1],
      ],
      [
        [1, 1, 1, 1, 1],
        [1, -1, -1, -1, 1],
        [1, -1, -1, -1, 1],
        [1, -1, -1, -1, 1],
        [1, 1, 1, 1, 1],
      ],
    ],
    input: input,
    dynamics_count: 10,
  };

  const fetch_data = () => {
    set_clicked(true);
    change_show_output(false);
    var url: string = "/api";
    var post_data: PostData = {
      train_data: post.train_data.map((value: Array<Array<number>>) => {
        return value.flat(1);
      }),
      input_pattern: post.input.flat(1),
      dynamics_count: post.dynamics_count,
    };
    axios.post(url, post_data).then((res) => {
      console.log(res);
      var body = [];
      for (var flat_pattern of res.data.body) {
        var pattern = [];
        var row = [];
        for (var s of flat_pattern.pattern) {
          row.push(s);
          if (row.length == row_length) {
            pattern.push(row);
            row = [];
          }
        }
        body.push({ pattern: pattern, count: flat_pattern.count });
      }
      set_data(body);
      change_show_output(true);
    });
  };

  const get_output_jsx = (data: OutputPattern[]): Array<JSX.Element> => {
    let output_patterns: Array<JSX.Element> = [];
    data.map((one, i) => {
      output_patterns.push(
        <>
          <p>{one.count + 1}回</p>
          <PatternSquare key={i} s={one.pattern} update_input={() => {}} />
        </>
      );
    });
    return output_patterns;
  };

  return (
    <div className="pattern_square" style={{ margin: "10px" }}>
      <div>==========TRAIN DATA=========</div>
      {post.train_data.map((one, i) => {
        return <PatternSquare key={i} s={one} update_input={() => {}} />;
      })}
      <div>============INPUT============</div>
      <PatternSquare
        s={input}
        update_input={(input: Array<Array<number>>) => {
          update_input(input);
        }}
      />
      <Button
        onClick={fetch_data}
        style={{ marginLeft: "30%", marginTop: "30px", marginBottom: "30px" }}
        variant="contained"
      >
        GO!!
      </Button>
      <div>============RESULT============</div>
      {clicked ? (
        is_show_output ? (
          get_output_jsx(data)
        ) : (
          <div>想起中....</div>
        )
      ) : null}
    </div>
  );
};

export default SimpleDynamics;
