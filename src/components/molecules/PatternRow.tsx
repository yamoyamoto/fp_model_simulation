import * as React from 'react'
import ColorBlock from '../atoms/ColorBlock'

type Props = {
  pattern_row: Array<number>,
  update_row: (row_data: Array<number>) => void
}


const PatternRow: React.FC<Props> = (props: Props) => {
  const update_block = (i: number, s_ij: number) => {
    var row_data_copy = props.pattern_row.slice();
    row_data_copy[i] = s_ij;
    // console.log(row_data_copy);
    props.update_row(row_data_copy);
  }

  const blocks = props.pattern_row.map((s: number, i)=>{
    return <ColorBlock key={i} s={s} update_block={(s_ij: number) => update_block(i, s_ij)}/>
  });

  return(
    <div className='pattern_row' style={{fontSize: "0"}}>
      {blocks}
    </div>
  );
}

export default PatternRow;