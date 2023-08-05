import { useState } from "react"
import { FaCaretDown } from "react-icons/fa"

const Combobox = ({selected, setSelected, options}) => {

    const [isActive, setIsActive] = useState(false);

    return (
      <div className="dropdown ml-10 inline-block">
        <div className="dropdown-btn w-full" onClick={(e) => setIsActive(!isActive)}>
            {selected}<span className="ml-auto"><FaCaretDown /></span>
        </div>
        {isActive && (
        <div className="dropdown-content">
            {options.map((option, index) => {
                return(
                    <div key={index} className="dropdown-item" onClick={(e) => {
                        setSelected(option);
                        setIsActive(false);
                        }}>
                        {option}
                    </div>
                )
            })}
        </div>
      )}
      </div>
    )
  }
  
  export default Combobox