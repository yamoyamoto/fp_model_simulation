import * as React from 'react'
import ColorBlock from '../atoms/ColorBlock'

type Props = {
  pattern_row: Array<number>,
}


const PatternRow: React.FC<Props> = (props: Props) => {
  var blocks = props.pattern_row.map((s: number, i)=>{
    return <ColorBlock key={i} s={s} />
  });

  return(
    <div className='pattern_row' style={{fontSize: "0"}}>
      {blocks}
    </div>
  );
}

export default PatternRow;