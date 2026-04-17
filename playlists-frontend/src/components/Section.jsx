import { useState } from "react"

const Section = ({title, children}) => {
    const [showDetails, setShowDetails] = useState(false);
  return (
    <>
        {!showDetails ? (
            <div style={{border: "1px solid #ddd", padding: "0 10px", marginBottom: "10px", borderRadius: "10px"}}>
                <h2>{title}</h2> 
                <button onClick={() => setShowDetails(true)}>Show Details</button>
                <br /><br />
            </div>
        ) : (
            <div style={{border: "1px solid #ddd", padding: "0 10px", marginBottom: "10px", borderRadius: "10px"}}>
                <div>
                    {children}
                </div>
                <button onClick={() => setShowDetails(false)}>Hide Details</button>
                <br /><br />
            </div>
        )}
        
    </>
  )
}

export default Section