import * as React from "react";
import { PatternSquare } from "../molecules/PatternSquare";
import axios from "../../../libs/axios";
import { Button, TextField } from "@material-ui/core";

type Props = {};

type Pattern2D = Array<Array<number>>;
type Pattern1D = Array<number>;

type Post = {
  train_data: Pattern2D[];
  input: Pattern2D;
  dynamics_count: number;
  beta: number;
};

type PostData = {
  train_data: Pattern1D[];
  input_pattern: Pattern1D;
  dynamics_count: number;
  beta: number;
};

type OutputPattern = {
  pattern: Pattern2D;
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
  const [output_data, set_output_data] = React.useState<Array<OutputPattern>>([]);
  const [is_clicked, change_is_clicked] = React.useState(false);
  const [input, update_input] = React.useState(default_input);
  const [beta, update_beta] = React.useState(1);

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
    beta: beta,
  };

  const fetch_data = () => {
    change_is_clicked(true);
    change_show_output(false);
    var url: string = "/api";
    var post_data: PostData = {
      train_data: post.train_data.map((value: Pattern2D) => {
        return value.flat(1);
      }),
      input_pattern: post.input.flat(1),
      dynamics_count: post.dynamics_count,
      beta: beta,
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
      set_output_data(body);
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

  const calculate_inner_product = (train_data: Pattern2D[]): number => {
    let inner_product: number = 0;
    const flatted_train_data_1 = train_data[0].flat(1);
    const flatted_train_data_2 = train_data[1].flat(1);
    const N = flatted_train_data_1.length;
    for (let i = 0; i < flatted_train_data_1.length; i++) {
      inner_product += flatted_train_data_1[i] * flatted_train_data_2[i];
    }
    return inner_product / N;
  };

  const change_T = (T: number) => {
    if (T == 0) {
      return;
    }
    update_beta(1 / T);
  };

  return (
    <div className="simple_dynamics_app" style={{ textAlign: "center", margin: "50px 0px" }}>
      <div className="train_data_wrap" style={{ margin: "30px 0px" }}>
        <div>==========記銘パターン=========</div>
        {post.train_data.map((one, i) => {
          return <PatternSquare key={i} s={one} update_input={() => {}} />;
        })}
        <div>
          <p>内積：{calculate_inner_product(post.train_data)}</p>
        </div>
      </div>
      <div className="input_wrap" style={{ margin: "30px 0px" }}>
        <div>========INPUT(クリックで色を変えられます!)=======</div>
        <PatternSquare
          s={input}
          update_input={(input: Array<Array<number>>) => {
            update_input(input);
          }}
        />
        <TextField id="filled-basic" label="Tを入力" variant="filled" onChange={(event) => change_T(Number(event.target.value))} />
        <div className="simulation_button">
          <Button onClick={fetch_data} style={{ marginTop: "30px" }} variant="contained">
            GO!!
          </Button>
        </div>
      </div>
      <div>============RESULT============</div>
      {is_clicked ? is_show_output ? get_output_jsx(output_data) : <div>想起中....</div> : null}
    </div>
  );
};

export default SimpleDynamics;
