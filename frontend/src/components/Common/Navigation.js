import React, {Component} from 'react';

class Home extends Component {

    render(){
        
        return(
            <div class="col-3">
                <div class="border-bottom mt-1 mb-1"><a href="/about" class="text-info text-decoration-none"><h3>ABOUT</h3></a></div>
                <div class="border-bottom mt-1 mb-1"><a href="/work" class="text-info text-decoration-none"><h3>WORK</h3></a></div>
                <div class="border-bottom mt-1 mb-1"><a href="/reminiscence" class="text-info text-decoration-none"><h3>REMINISCENCE</h3></a></div>
                {/* <div class="border-bottom mt-1 mb-1"><a href="/skills" class="text-info text-decoration-none"><h3>SKILLS</h3></a></div> */}
                <div class="border-bottom mt-1 mb-1"><a href="/projects" class="text-info text-decoration-none"><h3>PROJECTS</h3></a></div>
            </div>
        )
    }
}
//export Home Component
export default Home;