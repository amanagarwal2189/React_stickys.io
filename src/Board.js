import React from 'react'
import './App.css'
import Note from './Note'

var Board=React.createClass({
                propTypes: {
                    count: function(props, propName){
                        if(typeof props[propName] !== "number"){
                            return new Error ("count must be number")
                        }
                        if( props[propName] > 100){
                            return new Error ("Too high a number:" + props[propName])
                        }
                    }
                },
                getInitialState(){
                    return{
                        notes:[]
                    }
                },
                nextId(){
                    this.uniqueId=this.uniqueId || 0
                    return this.uniqueId++
                },

                componentWillMount(){
                    if(this.props.count){
                        var header=new Headers({
                            'Access-Control-Allow-Origin':'',
                            'Content-Type': 'multipart/form-data'
                        });
                        var sentData={
                            method:'POST',
                            mode: 'cors',
                            header: header,
                            body:''
                        };

                        var url=`http://baconipsum.com/api?type=all-meat&sentences=${this.props.count}`
                        fetch(url, sentData)
                            .then(results => results.json())
                            .then(array =>array[0])
                            .then(text =>text.split('. '))
                            .then(array => array.forEach(
                                sentence => this.add(sentence)))
                            .catch(function(err){
                                console.log("No data loaded", err)
                            })
                    }
                },
                /*first add all the notes that exist in the array and then add new one*/
                add(text){
                    var notes=[
                        ...this.state.notes,
                        {
                            id: this.nextId(),
                            note:text
                        }
                    ]
                    this.setState({notes})
                },

                /*This checks the note array to find if the array has the id 
                  equal to the one passed. if not, the note is 
                  added as is, else, the note is updated and then put in the map
                */

                update(newText, id){
                    var notes=this.state.notes.map(
                        note =>(note.id !== id) ? note
                        :
                        {
                            ...note,
                            note: newText
                        }
                    )
                    this.setState({notes})
                },
                remove(id){
                    /*This returns copies the note array and filters to return the array without the note of that id*/
                    
                    var notes=this.state.notes.filter(note => note.id !== id)
                    this.setState({notes})
                },
                eachNote(note){
                    return (<Note key={note.id} 
                                    id={note.id}
                                    onChange={this.update}
                                    onRemove={this.remove}>{note.note}</Note>)
                },
                render(){
                    return(<div className="board">
                                {this.state.notes.map(this.eachNote)}
                                <button onClick={() => this.add()}>New Note</button>
                            </div>)
                }
            })

export default Board
