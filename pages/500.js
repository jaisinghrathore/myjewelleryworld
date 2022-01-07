import React from 'react';

import { useRouter } from 'next/router';


export default function Custom500() {
    const router = useRouter();
    React.useEffect(()=>{
        router.push('/');
    });

    const clicky = ()=>{
        router.push('/');
    };

    return(
        <div style={{display:"flex",justifyContent: "center",placeItems: "center",width:"100%",height:"100vh"}}>
        <h1>500 - Server-side error occurred. <span style={{color:'skyblue',cursor:'pointer'}} onClick={clicky}>Go to Home.</span></h1>
        </div>
    );
  }