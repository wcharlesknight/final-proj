import { connect } from "react-redux";
import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {useTransition, animated} from 'react-spring'

function mapStateToProps(state) {
    return  state
}

const Word = (props) => {
    
const [items, set] = useState([])
const transitions = useTransition(items, item => item.key, {
from: { transform: 'translate3d(0,-40px,0)' },
enter: { transform: 'translate3d(0,0px,0)' },
leave: { transform: 'translate3d(0,-40px,0)' },
})
transitions.map(({ item, props, key }) =>
<animated.div key={key} style={props}>{item.text}</animated.div>
)

  { 
    return (
        <div>
        {this.props.points.map(point => <Button className= 'magictime tinUpOut' > {point} </Button> )}
        <Form onSubmit={this.checkWord}>
           <input type='text' onChange={(e) => this.clear(e)}></input>
           <Button type="submit"  name="Submit">Check Word</Button>
        </Form>
        <Button className='button' data-micron='groove' onClick={() => this.getWord()}> Try </Button>
        </div>
      )
    }
}

const WordBox = connect(mapStateToProps)(Word)

export default WordBox;








// {this.props.points.map(point => <Button className= 'magictime tinUpOut' > {point} </Button> )}
// <Form onSubmit={this.checkWord}>
//    <input type='text' onChange={(e) => this.clear(e)}></input>
//    <Button type="submit"  name="Submit">Check Word</Button>
// </Form>
// <Button className='button' data-micron='groove' onClick={() => this.getWord()}> Try </Button>