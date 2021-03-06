import * as React from "react";
import { PatternSquare } from "../molecules/PatternSquare";
import axios from "../../../libs/axios";
import { Button, ButtonGroup, Select, MenuItem, InputLabel } from "@material-ui/core";

type Props = {};

type Pattern2D = Array<Array<number>>;
type Pattern1D = Array<number>;

type Post = {
  train_data: Pattern2D[];
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
  const row_length = 10;
  const [is_show_output, change_show_output] = React.useState(false);
  const [output_data, set_output_data] = React.useState<Array<OutputPattern>>([]);
  const [is_clicked, change_is_clicked] = React.useState(false);
  const [input, update_input] = React.useState(template_inputs[0]);
  const [T, update_T] = React.useState(10);
  const [dynamics_count, update_dynamics_count] = React.useState(10);

  const post: Post = {
    train_data: train_data,
  };

  const fetch_data = () => {
    change_is_clicked(true);
    change_show_output(false);
    var url: string = "/api";
    var post_data: PostData = {
      train_data: post.train_data.map((value: Pattern2D) => {
        return value.flat(1);
      }),
      input_pattern: input.flat(1),
      dynamics_count: dynamics_count,
      beta: 1 / T,
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
    data.slice(0, 4).map((one, i) => {
      output_patterns.push(
        <div style={{display:"inline-block"}}>
          <p style={{fontSize:"30px"}}>{one.count + 1}???</p>
          <PatternSquare key={i} s={one.pattern} update_input={() => {}} />
          <p style={{fontSize:"30px"}}>?????????: {calculate_hamming_distance(train_data[0].flat(), one.pattern.flat())}</p>
        </div>
      );
    });
    return output_patterns;
  };

  const calculate_hamming_distance = (train_data: Pattern1D, output_pattern: Pattern1D): number => {
    let hamming_distance = 0;
    for(let i=0; i<train_data.length; i++){
      hamming_distance += train_data[i] === output_pattern[i] ? 1 : 0;
    }
    return hamming_distance / train_data.length;
  }

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
    update_T(T);
  };

  const change_default_input = (index: number) => {
    update_input(template_inputs[index]);
  }

  return (
    <div className="simple_dynamics_app" style={{ textAlign: "center", margin: "50px 0px" }}>
      <div className="train_data_wrap" style={{ margin: "30px 0px" }}>
        <div>==========??????????????????=========</div>
        {post.train_data.map((one, i) => {
          return <PatternSquare key={i} s={one} update_input={() => {}} />;
        })}
        {/* <div>
          <p>?????????{calculate_inner_product(post.train_data)}</p>
        </div> */}
      </div>
      <div className="input_wrap" style={{ margin: "30px 0px" }}>
        <div>========INPUT(???????????????????????????????????????!)=======</div>
        <ButtonGroup  variant="outlined" aria-label="outlined button group">
          {template_inputs.map((input, i) =>{
            return <Button key={i} onClick={()=>{change_default_input(i)}}>{i}</Button>
          }
          )}
        </ButtonGroup>
        <PatternSquare
          s={input}
          update_input={(input: Array<Array<number>>) => {
            update_input(input);
          }}
        />
        <div className="choose_T_wrap" style={{ margin: "30px 0" }}>
          <InputLabel id="select-T-label">T(?????????????????????)?????????</InputLabel>
          <Select
            labelId="select-T-label"
            value={T}
            style={{ fontSize: "20px", margin: "10px 0" }}
            onChange={(event) => change_T(Number(event.target.value))}
          >
            <MenuItem value={0.1}>0.1</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>
        {/* <div className="choose_dynamics_count_wrap" style={{ margin: "30px 0" }}>
          <InputLabel id="select-dynamics-count-label">??????????????????????????????????????????</InputLabel>
          <Select
            labelId="select-dynamics-count-label"
            value={dynamics_count}
            style={{ fontSize: "20px", margin: "10px 0" }}
            onChange={(event) => update_dynamics_count(Number(event.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={1000}>1000</MenuItem>
          </Select>
        </div> */}
        <div className="simulation_button">
          <Button onClick={fetch_data} style={{ marginTop: "10px" }} variant="contained">
            GO!!
          </Button>
        </div>
      </div>
      <div>============RESULT============</div>
      {is_clicked ? is_show_output ? get_output_jsx(output_data) : <div>?????????....</div> : null}
    </div>
  );
};

export default SimpleDynamics;

const train_data = [
  [
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
    [1,1,-1,-1,1,1,-1,-1,1,1],
  ],
  [
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,1,1,1,1,1,1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
];

const template_inputs = [
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,-1,-1,-1,-1,-1,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,-1,-1,-1,1,-1,-1,1,1],
    [1,-1,1,1,-1,-1,-1,1,1,1],
    [1,-1,-1,-1,1,1,-1,1,-1,1],
    [1,-1,1,-1,1,-1,-1,-1,-1,1],
    [1,-1,1,-1,1,-1,-1,1,-1,1],
    [1,-1,-1,1,1,-1,-1,-1,1,1],
    [1,-1,1,-1,1,1,-1,-1,1,1],
    [1,1,1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,-1,1,-1,1,-1,1,1],
    [1,-1,-1,-1,1,-1,-1,-1,1,1],
  ],
  [
    [1,-1,1,-1,-1,1,-1,-1,1,-1],
    [-1,-1,1,1,-1,-1,-1,1,1,1],
    [-1,-1,1,-1,1,1,-1,1,-1,-1],
    [1,-1,1,-1,-1,-1,-1,1,-1,1],
    [1,-1,1,-1,-1,-1,-1,-1,-1,1],
    [1,-1,-1,1,1,-1,-1,-1,-1,1],
    [1,-1,1,-1,1,1,1,-1,1,1],
    [-1,1,1,-1,-1,-1,-1,-1,-1,1],
    [1,1,-1,-1,1,-1,1,-1,1,-1],
    [1,-1,-1,-1,1,-1,-1,1,1,-1],
  ],
]