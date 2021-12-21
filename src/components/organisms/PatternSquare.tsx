import * as React from 'react'
import PatternRow from '../molecules/PatternRow'

type Props = {
  s: Array<Array<number>>,
}

const PatternSquare: React.FC<Props> = (props) => {
  var rows = props.s.map((row)=>{
    return <PatternRow pattern_row={row} />
  });

  return(
    <div className='pattern_square' style={{margin: "10px"}}>
      {rows}
    </div>
  );
}

export default PatternSquare;