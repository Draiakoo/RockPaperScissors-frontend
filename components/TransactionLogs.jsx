import Web3 from "web3"
import { formatDate } from "@dateHelper"

const TransactionLogs = ({loadingBalanceLog, errorBalanceLog, dataBalanceLog, loadingDeposits, errorDeposits, dataDeposits, loadingWithdraw, errorWithdraw, dataWithdraw}) => {
  return (
    <div className="grid-transaction-list-displays py-3 mx-5">
          
          {/* Transaction log */}
          <div>
            <h4 className="text-center">All transaction log</h4>
            {loadingBalanceLog
                ? <div className="bg-white m-3 rounded-md text-center p-10">
                    <div>Obtaining your transaction log</div>
                  </div>
                : errorBalanceLog
                  ? <div className="bg-white m-3 rounded-md text-center p-10">
                      <div>You have no transactions</div>
                    </div>
                  : dataBalanceLog["balanceLogs"].length===0 
                    ? <div className="bg-white m-3 rounded-md text-center p-10">
                        <div>You have no transactions</div>
                      </div>
                    : <div className="bg-white m-3 rounded-md grid-full-transaction-log p-3"> 
                        <div>
                        <p className="text-size-responsive text-center underline">
                          Amount
                        </p>
                        {dataBalanceLog["balanceLogs"].map(({amount, type}, index) => {
                          var formatedAmount = Web3.utils.fromWei(amount, 'ether')
                          if(formatedAmount=="0."){
                            formatedAmount="0"
                          }
                          return(
                            <p key={index} className={type==="0x0000000000000000000000000000000000000001" || type==="0x0000000000000000000000000000000000000002" ? "text-red-600 text-size-responsive text-center" : "text-green-600 text-size-responsive text-center"}>
                              {type==="0x0000000000000000000000000000000000000001" || type==="0x0000000000000000000000000000000000000002" ? "-" : "+"}{formatedAmount} ETH
                            </p>
                          )
                        })}
                      </div>
                      <div>
                        <p className="text-size-responsive text-center underline">
                          Transaction type
                        </p>
                        {dataBalanceLog["balanceLogs"].map(({type}, index) => {
                          return(
                            <p key={index} className={type==="0x0000000000000000000000000000000000000001" || type==="0x0000000000000000000000000000000000000002" ? "text-red-600 text-size-responsive text-center" : "text-green-600 text-size-responsive text-center"}>
                              {type==="0x0000000000000000000000000000000000000000"
                                ? "Deposit"
                                : type==="0x0000000000000000000000000000000000000001"
                                  ? "Withdraw"
                                  : type==="0x0000000000000000000000000000000000000002"
                                    ? "Entry bey payment"
                                    : type==="0x0000000000000000000000000000000000000003"
                                      ? "Game prize receiving"
                                      : ""}
                            </p>
                          )
                        })}
                      </div>
                      <div>
                        <p className="text-size-responsive text-center underline">
                          Game ID
                        </p>
                        {dataBalanceLog["balanceLogs"].map(({gameId, type}, index) => {
                          return(
                            <p key={index} className={type==="0x0000000000000000000000000000000000000001" || type==="0x0000000000000000000000000000000000000002" ? "text-red-600 text-size-responsive text-center" : "text-green-600 text-size-responsive text-center"}>
                              {type==="0x0000000000000000000000000000000000000000" || type==="0x0000000000000000000000000000000000000001"
                                ? "-"
                                : gameId}
                            </p>
                          )
                        })}
                      </div>
                      <div>
                        <p className="text-size-responsive text-center underline">
                          Transaction date
                        </p>
                        {dataBalanceLog["balanceLogs"].map(({blockTimestamp, type}, index) => {
                          return(
                            <p key={index} className={type==="0x0000000000000000000000000000000000000001" || type==="0x0000000000000000000000000000000000000002" ? "text-red-600 text-size-responsive text-center" : "text-green-600 text-size-responsive text-center"}>
                              {formatDate(parseInt(blockTimestamp))}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  }
          </div>


          {/* Deposits */}
          <div>
            <h4 className="text-center">Deposits</h4>
              {loadingDeposits
                ? <div className="bg-white m-3 rounded-md text-center p-10">
                    <div>Obtaining your deposits</div>
                  </div>
                : errorDeposits
                  ? <div className="bg-white m-3 rounded-md text-center p-10">
                      <div>You have no deposits</div>
                    </div>
                  : dataDeposits["deposits"].length===0 
                    ? <div className="bg-white m-3 rounded-md text-center p-10">
                        <div>You have no deposits</div>
                      </div>
                    : <div className="bg-white m-3 rounded-md grid-transaction-log p-3"> 
                        <div>
                        <p className="text-size-responsive text-center underline">
                          Amount
                        </p>
                        {dataDeposits["deposits"].map(({amount}, index) => {
                          var formatedAmount = Web3.utils.fromWei(amount, 'ether')
                          if(formatedAmount=="0."){
                            formatedAmount="0"
                          }
                          return(
                            <p key={index} className="text-green-600 text-center">
                              +{formatedAmount} ETH
                            </p>
                          )
                        })}
                      </div>
                      <div>
                        <p className="text-size-responsive text-center underline">
                          Transaction date
                        </p>
                        {dataDeposits["deposits"].map(({blockTimestamp}, index) => {
                          return(
                            <p key={index} className="text-green-600 text-center">
                              {formatDate(parseInt(blockTimestamp))}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  }
          </div>



          {/* Withdraws */}
          <div>
            <h4 className="text-center">Withdraws</h4>
            {loadingWithdraw
                ? <div className="bg-white m-3 rounded-md text-center p-10">
                    <div>Obtaining your withdraws</div>
                  </div>
                : errorWithdraw
                  ? <div className="bg-white m-3 rounded-md text-center p-10">
                      <div>You have no withdraws</div>
                    </div>
                  : dataWithdraw["withdraws"].length===0 
                    ? <div className="bg-white m-3 rounded-md text-center p-10">
                        <div>You have no withdraws</div>
                      </div>
                    : <div className="bg-white m-3 rounded-md grid-transaction-log p-3"> 
                        <div>
                        <p className="text-size-responsive text-center underline">
                          Amount
                        </p>
                        {dataWithdraw["withdraws"].map(({amount}, index) => {
                          var formatedAmount = Web3.utils.fromWei(amount, 'ether')
                          if(formatedAmount=="0."){
                            formatedAmount="0"
                          }
                          return(
                            <p key={index} className="text-red-600 text-center">
                              -{formatedAmount} ETH
                            </p>
                          )
                        })}
                      </div>
                      <div>
                        <p className="text-size-responsive text-center underline">
                          Transaction date
                        </p>
                        {dataWithdraw["withdraws"].map(({blockTimestamp}, index) => {
                          return(
                            <p key={index} className="text-red-600 text-center">
                              {formatDate(parseInt(blockTimestamp))}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  }
          </div>
        </div>
  )
}

export default TransactionLogs