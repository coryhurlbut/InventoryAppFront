//Import dependencies
import React            from 'react';

//Import CSS and components
import ContentBuilder   from './components/ContentBuilder';
import LoginLogout      from './components/LoginLogout';
import './styles/App.css';
export default class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            auth: ''
        };
    };

    render(){
        return(
            <div>
                 <div className="header">
                     Inventory App
                     <div className="logInLogOut">
                        <LoginLogout loginLogoutIsVisible={true}/>
                     </div>
                </div>
                <ContentBuilder auth={this.state.auth}/>
            </div>
        );
    };
};
