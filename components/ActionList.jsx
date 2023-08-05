import "@styles/globals.css"


const ActionList = ({list1, list2}) => {
  return (
    <div className="actions">
        <h3>What to do?</h3>
            <div className="grid grid-cols-2">
                {list1.map((action, index) => {
                    return(
                        <div key={index} className="flex justify-center items-center mr-auto">
                            <a className="my-2 professional-link" href={action.href}>
                                {"> " + action.action}
                            </a>
                        </div>
                    )
                })}
            </div>

        <h3>Your lists</h3>
        <div className="grid grid-cols-2">
            {list2.map((action, index) => {
                return(
                    <div key={index} className="flex justify-center items-center mr-auto">
                        <a className="my-2 professional-link" href={action.href}>
                            {"> " + action.action}
                        </a>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ActionList