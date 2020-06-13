import React, {Component} from 'react';

class Home extends Component {

    render(){
        
        return(
            <div className="col-3">
                <div className="border-bottom mt-1 mb-1"><a href="/about" className="text-info text-decoration-none"><h3>ABOUT</h3></a></div>
                <div className="border-bottom mt-1 mb-1"><a href="/work" className="text-info text-decoration-none"><h3>WORK</h3></a></div>
                <div className="border-bottom mt-1 mb-1"><a href="/reminiscence" className="text-info text-decoration-none"><h3>REMINISCENCE</h3></a></div>
                {/* <div className="border-bottom mt-1 mb-1"><a href="/skills" className="text-info text-decoration-none"><h3>SKILLS</h3></a></div> */}
                <div className="border-bottom mt-1 mb-1"><a href="/projects" className="text-info text-decoration-none"><h3>PROJECTS</h3></a></div>
            </div>
        )
    }
}
//export Home Component
export default Home;