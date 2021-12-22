import * as React from 'react'
import PatternRow from '../molecules/PatternRow'

type Props = {
  s: Array<Array<number>>,
  update_input: (input: Array<Array<number>>) => void,
}

const PatternSquare: React.FC<Props> = (props: Props) => {
  const update_row = (i: number, row_data: Array<number>) => {
    var input_copy = props.s.slice();
    input_copy[i] = row_data;
    props.update_input(input_copy);
  }

  const rows = props.s.map((row, i)=>{
    return <PatternRow key={i} pattern_row={row} update_row={(row_data: Array<number>) => {update_row(i, row_data);}} />
  });

  return(
    <div className='pattern_square' style={{margin: "10px"}}>
      {rows}
    </div>
  );
}

export default PatternSquare;