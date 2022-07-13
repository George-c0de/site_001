import captchaImg from '../../Ảnh Pokemon Dự Trù/captcha.jpg';
import React, { useState} from 'react';


const Captcha = (props)=> {
  const [usercapt, setUsercapt] = useState({
      username:""
  });

  // eslint-disable-next-line
  const [isCorrect,setIsCorrect]=useState(false);

  const characters ='abc123';

  const sendData = () => {
    props.parentCallback(!isCorrect);
  }
  
//Generate string of captcha
  function generateString(length) 
  {
      let result = '';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
     return result;
   }

   const captcha = generateString(6) // Function called here and save in captcha variable

   let handleChange = (e) => {
     let name = e.target.name;
     let value = e.target.value;
     usercapt[name] = value;
     setUsercapt(usercapt);
    }

  const onSubmit = () => {
    var element =  document.getElementById("succesBTN");
    var inputData = document.getElementById("inputType");
     element.style.cursor = "wait";
     element.innerHTML  = "Checking...";
     inputData.disabled = true;
     element.disabled = true;
      const myFunctions =()=>{
          if(captcha === usercapt.usercaptname)
          {
            element.style.backgroundColor   = "green";
            element.innerHTML  = "Captcha Verified";
            element.disabled = true;
            element.style.cursor = "not-allowed";
            inputData.style.display = "none";
            sendData()
          }
          else
          {
            element.style.backgroundColor   = "red";
            element.style.cursor = "not-allowed";
            element.innerHTML  = "Not Matched";
            element.disabled = true;

            const myFunction = ()=>{
              element.style.backgroundColor   = "#007bff";
              element.style.cursor = "pointer";
              element.innerHTML  = "Verify Captcha";
              element.disabled = false;
              inputData.disabled = false;
              inputData.value ='sssss';
            };
            setTimeout(myFunction,3000);
          }
        }   
        setTimeout(myFunctions,3000); 
  };


   return (
    <div className="container">
      <div className="row mt-4">
            <div className="form-group row">
                <img src={captchaImg} className="mt-3 mb-3" height="40" style={{width:"75%",marginLeft:"15%"}}alt=""/> 
            </div>
         
          <div className="col-md-8">
            <h4 id="captcha" style={{ marginTop:"-50px",marginLeft:"120px",position:"absolute"}}>{captcha}</h4>
            
            <div className="form-group row">
              <input type="text" id="inputType" className="form-control"placeholder="Enter Captcha"
                name="usercaptname"  onChange={handleChange} autoComplete="off" style={{marginLeft:"25%",width:"100%"}}
                />
              <button type="button" id="succesBTN" onClick={onSubmit} className="btn btn-primary ml-1"  style={{marginLeft:"25%",marginTop:"20px"}}>Verify Captcha</button>
            </div>
        
           </div>
        </div>
      </div>
    );
}
export default React.memo(Captcha);