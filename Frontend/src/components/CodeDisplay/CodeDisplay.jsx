
import { useContext } from 'react';
import './CodeDisplay.css';
import ContextAPI from '../ContextAPI/ContextAPI';

function CodeDisplay() {

    const { isCode } = useContext(ContextAPI);

     return ( 
        <div className='codedisplay-wrapper' style={ { display: (isCode)? 'block': 'none'  } } >
            <div className="codedisplay">
                <div className="sample1">

                </div>
            </div>
        </div>
     );
}


export default CodeDisplay