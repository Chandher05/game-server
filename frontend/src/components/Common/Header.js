import React, {Component} from 'react';

class Home extends Component {

    render(){
        
        return(    
            <div class="row">
                <div class="col-3">
                    <img src="/res/image.jpg" style={{ maxWidth : "100%", maxHeight : "100%" }} className="rounded-circle" alt="Jayasurya"/>
                </div>
                <div class="col-9">
                    <h1 class="display-1 text-break">Jayasurya Pinaki</h1>
                    <h1>Gradute student at San Jose State University</h1>
                </div>
            </div>
        )
    }
}
//export Home Component
export default Home;