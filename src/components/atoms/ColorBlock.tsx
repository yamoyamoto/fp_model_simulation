import * as React from 'react'

type Props = {
  s?: number,
}

const ColorBlock: React.FC<Props> = (props) => {
  return(
    <div 
      className='color_block'
      style={{padding: "5px", backgroundColor: props.s == 1 ? "red" : "gray", display: "inline-block"}}
    >
    </div>
  );
}

export default ColorBlock;