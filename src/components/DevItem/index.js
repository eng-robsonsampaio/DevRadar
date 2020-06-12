import React from 'react';
import {ReactComponent as ReactLogo} from './deleteIcon.svg';
import './style.css'

function DevItem(props){
    
    async function handleOnClick(){
        props.onHandleDelete(props.dev)
    }

    return (
        <li className="dev-item">
            <header>
                <img src={props.dev.avatar_url} alt={props.dev.name}></img>
                <div className="user-info">
                    <strong>{props.dev.name}</strong>
                    <span>{props.dev.techs.join(', ')}</span>
                </div>
                <ReactLogo onClick={handleOnClick} className="delete-icon" alt="delete" />      
            </header>
            <p>{props.dev.bio}</p>
            <div className="github-link">
                <a href={`http://github.com/${props.dev.github_username}`}>Access github profile</a>
            </div>
        </li>
    )
}

export default DevItem