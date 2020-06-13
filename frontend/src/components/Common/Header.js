import React, {Component} from 'react';

class Home extends Component {

    render(){
        
        return(    
            <div className="row">
                <div className="col-3">
                    <img src="/res/image.jpg" style={{ maxWidth : "100%", maxHeight : "100%" }} className="rounded-circle" alt="Jayasurya"/>
                </div>
                <div className="col-9">
                    <h1 className="display-1 text-break">Jayasurya Pinaki</h1>
                    <h1>Gradute student at San Jose State University</h1>
                </div>
            </div>
        )
    }
}
//export Home Component
export default Home;