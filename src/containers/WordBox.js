import { connect } from "react-redux";
import React, {Component} from 'react'
import {Card} from 'react-bootstrap'

function mapStateToProps(state) {
    return  state
}



class Word extends Component {
    
    state = {
         currentWord: []
    }

    render() { 
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