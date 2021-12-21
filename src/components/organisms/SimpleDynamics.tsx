import * as React from 'react'
import PatternSquare from './PatternSquare'
import axios from '../../../libs/axios'

type Props = {

};

const SimpleDynamics: React.FC<Props> = (props) => {
  const [remembered_pattern, set_remembered_pattern] = React.useState(false);



  return(
    <div className='pattern_square' style={{margin: "10px"}}>
    </div>
  );
}

export default PatternSquare;